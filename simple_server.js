const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Simple configuration
const PORT = process.env.PORT || 8080;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Validate API key
if (!OPENAI_API_KEY || !OPENAI_API_KEY.startsWith('sk-')) {
    console.error('❌ Missing OPENAI_API_KEY environment variable');
    console.error('💡 Set it like: export OPENAI_API_KEY="sk-your-key-here"');
    process.exit(1);
}

console.log('🔑 API Key loaded:', OPENAI_API_KEY.substring(0, 10) + '...');

// Create HTTP server to serve the HTML file
const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.url === '/' || req.url === '/index.html') {
        // Serve the HTML file
        try {
            const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        } catch (error) {
            res.writeHead(500);
            res.end('Error loading HTML file');
        }
    } else if (req.url === '/stress_test.html') {
        // Serve the stress test file
        try {
            const htmlContent = fs.readFileSync(path.join(__dirname, 'stress_test.html'), 'utf8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlContent);
        } catch (error) {
            res.writeHead(500);
            res.end('Error loading stress test file');
        }
    } else if (req.url === '/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'running',
            port: PORT,
            websocket: `ws://localhost:${PORT}/realtime`,
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Create WebSocket server for OpenAI Realtime API proxy
const wss = new WebSocket.Server({ 
    server,
    path: '/realtime'
});

let activeConnections = 0;

wss.on('connection', (clientWs, req) => {
    activeConnections++;
    const clientId = `client_${activeConnections}_${Date.now()}`;
    
    console.log(`🔗 ${clientId} connected (total: ${activeConnections})`);
    
    // Connect to OpenAI Realtime API
    const openaiUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`;
    
    let openaiWs;
    try {
        openaiWs = new WebSocket(openaiUrl, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Beta': 'realtime=v1'
            }
        });
    } catch (error) {
        console.error(`❌ ${clientId} OpenAI connection failed:`, error.message);
        clientWs.close(1011, 'OpenAI connection failed');
        return;
    }
    
    // Forward messages from client to OpenAI
    clientWs.on('message', (data) => {
        if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.send(data);
        }
    });
    
    // Forward messages from OpenAI to client
    openaiWs.on('message', (data) => {
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(data);
        }
    });
    
    // Handle OpenAI connection events
    openaiWs.on('open', () => {
        console.log(`✅ ${clientId} OpenAI connection established`);
    });
    
    openaiWs.on('error', (error) => {
        console.error(`❌ ${clientId} OpenAI error:`, error.message);
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close(1011, 'OpenAI connection error');
        }
    });
    
    openaiWs.on('close', (code, reason) => {
        console.log(`🔌 ${clientId} OpenAI connection closed:`, code, reason.toString());
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close(code, reason);
        }
    });
    
    // Handle client disconnection
    clientWs.on('close', () => {
        activeConnections--;
        console.log(`👋 ${clientId} disconnected (total: ${activeConnections})`);
        if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.close();
        }
    });
    
    clientWs.on('error', (error) => {
        console.error(`❌ ${clientId} client error:`, error.message);
        if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.close();
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🌐 Voice Assistant Server running on port ${PORT}`);
    console.log(`📱 Open: http://localhost:${PORT}`);
    console.log(`🧪 Test: http://localhost:${PORT}/stress_test.html`);
    console.log(`📊 Status: http://localhost:${PORT}/status`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}/realtime`);
    console.log(`\n💡 To use: export OPENAI_API_KEY="your-key" && node simple_server.js`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Shutting down server...');
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        process.exit(0);
    });
});
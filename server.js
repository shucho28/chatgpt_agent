const WebSocket = require('ws');
const http = require('http');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-proj-Q92BZoKW8FFt64BEyCdmYHXhdgGUW3IMVaczGcyH2msdCO8wRy8wgTvzva0W8hRFvSjt78rofH' + 'T3BlbkFJ6JC26IgbYCyNKZOCjTIVvNyx8Zx4fAkiGHrPOtxHErFCc1Ue8tdDJjs7klYAGg9zR5EparZu0A';

// Create HTTP server
const server = http.createServer((req, res) => {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>OpenAI Realtime API Proxy</h1>
            <p>WebSocket proxy server running on port ${PORT}</p>
            <p>Connect to: ws://localhost:${PORT}/realtime</p>
        `);
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

// Create WebSocket server
const wss = new WebSocket.Server({ 
    server,
    path: '/realtime'
});

wss.on('connection', (clientWs, req) => {
    console.log('🔗 Client connected to proxy');
    
    // Parse query parameters for model
    const query = url.parse(req.url, true).query;
    const model = query.model || 'gpt-4o-realtime-preview-2024-10-01';
    
    // Connect to OpenAI Realtime API
    const openaiUrl = `wss://api.openai.com/v1/realtime?model=${model}`;
    console.log('🚀 Connecting to OpenAI:', openaiUrl);
    
    const openaiWs = new WebSocket(openaiUrl, {
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1'
        }
    });
    
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
        console.log('✅ Connected to OpenAI Realtime API');
    });
    
    openaiWs.on('error', (error) => {
        console.error('❌ OpenAI WebSocket error:', error);
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close(1000, 'OpenAI connection error');
        }
    });
    
    openaiWs.on('close', (code, reason) => {
        console.log('🔌 OpenAI WebSocket closed:', code, reason.toString());
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close(code, reason);
        }
    });
    
    // Handle client disconnection
    clientWs.on('close', (code, reason) => {
        console.log('👋 Client disconnected:', code, reason.toString());
        if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.close();
        }
    });
    
    clientWs.on('error', (error) => {
        console.error('❌ Client WebSocket error:', error);
        if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.close();
        }
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`🌐 OpenAI Realtime API Proxy running on port ${PORT}`);
    console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/realtime`);
    console.log(`🔧 HTTP interface: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Shutting down proxy server...');
    server.close(() => {
        process.exit(0);
    });
});
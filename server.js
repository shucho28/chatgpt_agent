const WebSocket = require('ws');
const http = require('http');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MAX_CONNECTIONS = process.env.MAX_CONNECTIONS || 10;
const CONNECTION_TIMEOUT = process.env.CONNECTION_TIMEOUT || 30000;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

// Rate limiting and connection tracking
const connectionTracker = new Map();
const rateLimiter = new Map();
let activeConnections = 0;

// Validate API key
if (!OPENAI_API_KEY || !OPENAI_API_KEY.startsWith('sk-')) {
    console.error('❌ Invalid or missing OpenAI API key');
    console.error('💡 Set OPENAI_API_KEY environment variable');
    console.error('💡 Example: export OPENAI_API_KEY="sk-your-key-here"');
    process.exit(1);
}

// Security: Never log the full API key
console.log('🔑 API Key loaded:', OPENAI_API_KEY.substring(0, 10) + '...' + OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4));


// Enhanced API key validation and testing
async function testAPIKey() {
    try {
        console.log('🔍 Testing API key validity...');
        
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'User-Agent': 'OpenAI-Realtime-Proxy/1.0.0'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const realtimeModel = data.data.find(model => model.id.includes('realtime'));
            
            if (realtimeModel) {
                console.log('✅ API key valid and has Realtime API access');
                console.log('📋 Available realtime model:', realtimeModel.id);
            } else {
                console.log('⚠️ API key valid but no Realtime API models found');
                console.log('💡 You may need to request access to OpenAI Realtime API');
                console.log('📋 Available models:', data.data.length);
            }
        } else if (response.status === 401) {
            console.error('❌ API key authentication failed - invalid key');
            console.error('💡 Please check your OPENAI_API_KEY environment variable');
            process.exit(1);
        } else if (response.status === 429) {
            console.error('⚠️ Rate limited during API key test');
            console.log('💡 API key appears valid but hitting rate limits');
        } else {
            console.error('❌ API key test failed:', response.status, response.statusText);
            if (response.status >= 500) {
                console.log('💡 OpenAI service may be experiencing issues');
            }
        }
    } catch (error) {
        console.error('❌ API key test error:', error.message);
        if (error.message.includes('ENOTFOUND')) {
            console.error('💡 Network connectivity issue - check internet connection');
        }
    }
}

// Test API key on startup
testAPIKey();

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

// Rate limiting middleware
function checkRateLimit(clientIP) {
    const now = Date.now();
    const clientKey = clientIP;
    
    if (!rateLimiter.has(clientKey)) {
        rateLimiter.set(clientKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }
    
    const clientData = rateLimiter.get(clientKey);
    
    if (now > clientData.resetTime) {
        rateLimiter.set(clientKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }
    
    if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    
    clientData.count++;
    return true;
}

// Connection cleanup function
function cleanupConnection(clientId) {
    if (connectionTracker.has(clientId)) {
        const connInfo = connectionTracker.get(clientId);
        if (connInfo.timeout) {
            clearTimeout(connInfo.timeout);
        }
        connectionTracker.delete(clientId);
        activeConnections--;
    }
}

wss.on('connection', (clientWs, req) => {
    const clientIP = req.socket.remoteAddress;
    const clientId = `${clientIP}:${Date.now()}:${Math.random()}`;
    
    console.log('🔗 Client connected:', clientId);
    
    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
        console.log('❌ Rate limit exceeded for client:', clientIP);
        clientWs.close(1008, 'Rate limit exceeded');
        return;
    }
    
    // Connection limit check
    if (activeConnections >= MAX_CONNECTIONS) {
        console.log('❌ Connection limit reached:', activeConnections);
        clientWs.close(1013, 'Server overloaded');
        return;
    }
    
    activeConnections++;
    
    // Set connection timeout
    const connectionTimeout = setTimeout(() => {
        console.log('⏰ Connection timeout for client:', clientId);
        clientWs.close(1000, 'Connection timeout');
    }, CONNECTION_TIMEOUT);
    
    connectionTracker.set(clientId, {
        startTime: Date.now(),
        timeout: connectionTimeout,
        ip: clientIP
    });
    
    // Parse query parameters for model
    const query = url.parse(req.url, true).query;
    const model = query.model || 'gpt-4o-realtime-preview-2024-10-01';
    
    // Message queue for handling messages before OpenAI connection is ready
    let messageQueue = [];
    let isSessionReady = false;
    
    // Connect to OpenAI Realtime API with enhanced error handling
    const openaiUrl = `wss://api.openai.com/v1/realtime?model=${model}`;
    console.log('🚀 Connecting to OpenAI:', openaiUrl.replace(OPENAI_API_KEY, '***'));
    
    let openaiWs;
    try {
        openaiWs = new WebSocket(openaiUrl, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Beta': 'realtime=v1',
                'User-Agent': 'OpenAI-Realtime-Proxy/1.0.0'
            }
        });
    } catch (error) {
        console.error('❌ Failed to create OpenAI WebSocket connection:', error.message);
        clientWs.close(1011, 'OpenAI connection failed');
        cleanupConnection(clientId);
        return;
    }
    
    // Forward messages from client to OpenAI
    clientWs.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('📤 Client message:', message.type);
            
            if (message.type === 'session.update') {
                // Always send session.update immediately when OpenAI is connected
                if (openaiWs.readyState === WebSocket.OPEN) {
                    console.log('🔧 Sending session configuration immediately...');
                    openaiWs.send(data);
                } else {
                    console.log('⚠️ OpenAI WebSocket not ready, queueing session.update');
                    messageQueue.push(data);
                }
            } else if (openaiWs.readyState === WebSocket.OPEN && isSessionReady) {
                console.log('📤 Sending message to ready session:', message.type);
                openaiWs.send(data);
            } else {
                console.log('⚠️ Queuing message until session is ready:', message.type);
                messageQueue.push(data);
            }
        } catch (error) {
            console.log('📤 Client binary data:', data.length, 'bytes');
            if (openaiWs.readyState === WebSocket.OPEN && isSessionReady) {
                console.log('📤 Sending binary data to ready session');
                openaiWs.send(data);
            } else {
                console.log('⚠️ Queuing binary data until session is ready');
                messageQueue.push(data);
            }
        }
    });
    
    // Forward messages from OpenAI to client
    openaiWs.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('📥 OpenAI message:', message.type);
            
            // Handle session ready state
            if (message.type === 'session.created') {
                console.log('✅ Session created, setting ready state');
                isSessionReady = true;
                
                // FIRST: Forward session.created to client immediately
                if (clientWs.readyState === WebSocket.OPEN) {
                    console.log('📤 Forwarding session.created to client');
                    clientWs.send(data);
                } else {
                    console.error('❌ Client WebSocket not ready for session.created!');
                }
                
                // THEN: Process queued messages (except session.update which was already sent)
                const nonSessionMessages = messageQueue.filter(msg => {
                    try {
                        const parsed = JSON.parse(msg);
                        return parsed.type !== 'session.update';
                    } catch {
                        return true; // Keep binary messages
                    }
                });
                
                console.log(`📤 Processing ${nonSessionMessages.length} queued messages...`);
                for (const queuedMessage of nonSessionMessages) {
                    if (openaiWs.readyState === WebSocket.OPEN) {
                        openaiWs.send(queuedMessage);
                    }
                }
                
                // Clear the queue
                messageQueue = [];
                return; // Don't forward session.created again below
            }
            
            // Log error messages with full details
            if (message.type === 'error') {
                console.error('❌ OpenAI Error Details:');
                console.error('   Code:', message.error?.code || 'unknown');
                console.error('   Message:', message.error?.message || 'unknown');
                console.error('   Type:', message.error?.type || 'unknown');
                console.error('   Full error:', JSON.stringify(message.error, null, 2));
            }
            
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(data);
            }
        } catch (error) {
            console.log('📥 OpenAI binary data:', data.length, 'bytes');
            if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(data);
            }
        }
    });
    
    // Handle OpenAI connection events
    openaiWs.on('open', () => {
        console.log('✅ Connected to OpenAI Realtime API');
        
        // Send any queued session.update messages immediately
        const sessionUpdates = messageQueue.filter(msg => {
            try {
                const parsed = JSON.parse(msg);
                return parsed.type === 'session.update';
            } catch {
                return false;
            }
        });
        
        if (sessionUpdates.length > 0) {
            console.log(`🔧 Sending ${sessionUpdates.length} queued session.update messages...`);
            for (const sessionUpdate of sessionUpdates) {
                try {
                    const parsed = JSON.parse(sessionUpdate);
                    console.log('🔧 Session config:', JSON.stringify(parsed.session, null, 2));
                } catch (e) {
                    console.log('🔧 Raw session update:', sessionUpdate);
                }
                openaiWs.send(sessionUpdate);
            }
            
            // Remove session.update messages from queue
            messageQueue = messageQueue.filter(msg => {
                try {
                    const parsed = JSON.parse(msg);
                    return parsed.type !== 'session.update';
                } catch {
                    return true; // Keep binary messages
                }
            });
        } else {
            console.log('🔧 No session configuration sent - using OpenAI defaults');
        }
    });
    
    openaiWs.on('error', (error) => {
        console.error('❌ OpenAI WebSocket error:', error.message);
        console.error('❌ Error details:', error);
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close(1000, 'OpenAI connection error');
        }
    });
    
    openaiWs.on('close', (code, reason) => {
        const reasonText = reason.toString();
        console.log('🔌 OpenAI WebSocket closed:', code, reasonText || '(no reason given)');
        
        // Log different close codes
        switch (code) {
            case 1000:
                console.log('ℹ️ Normal closure - might be due to session config or API limits');
                break;
            case 1002:
                console.log('❌ Protocol error - invalid WebSocket message');
                break;
            case 1003:
                console.log('❌ Unsupported data - message format error');
                break;
            case 1008:
                console.log('❌ Policy violation - likely authentication issue');
                break;
            case 1011:
                console.log('❌ Server error - OpenAI internal issue');
                break;
            default:
                console.log('❓ Unknown close code:', code);
        }
        
        if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.close(code, reason);
        }
    });
    
    // Handle client disconnection
    clientWs.on('close', (code, reason) => {
        console.log('👋 Client disconnected:', clientId, code, reason.toString());
        cleanupConnection(clientId);
        if (openaiWs.readyState === WebSocket.OPEN) {
            openaiWs.close();
        }
    });
    
    clientWs.on('error', (error) => {
        console.error('❌ Client WebSocket error:', clientId, error.message);
        cleanupConnection(clientId);
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
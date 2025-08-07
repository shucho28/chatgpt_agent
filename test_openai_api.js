#!/usr/bin/env node

/**
 * Simple test script to check OpenAI Realtime API status independently
 * This will help us determine if the issue is with our code or OpenAI's service
 */

const WebSocket = require('ws');

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('❌ Please set OPENAI_API_KEY environment variable');
    process.exit(1);
}

console.log('🧪 Testing OpenAI Realtime API independently...\n');

// Test 1: Check regular API access
async function testRegularAPI() {
    console.log('1️⃣ Testing regular OpenAI API access...');
    
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'User-Agent': 'OpenAI-Test/1.0.0'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const realtimeModels = data.data.filter(model => 
                model.id.includes('realtime') || model.id.includes('gpt-4o')
            );
            
            console.log('✅ Regular API works');
            console.log(`📊 Found ${realtimeModels.length} realtime-compatible models:`);
            realtimeModels.forEach(model => {
                console.log(`   - ${model.id} (${model.object})`);
            });
            return true;
        } else {
            console.log(`❌ Regular API failed: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Regular API error: ${error.message}`);
        return false;
    }
}

// Test 2: Test Realtime API WebSocket connection
function testRealtimeAPI() {
    return new Promise((resolve) => {
        console.log('\n2️⃣ Testing Realtime API WebSocket connection...');
        
        const url = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
        console.log('🔗 Connecting to:', url.replace(OPENAI_API_KEY, '***'));
        
        const ws = new WebSocket(url, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Beta': 'realtime=v1'
            }
        });
        
        let sessionCreated = false;
        let errorReceived = null;
        
        const timeout = setTimeout(() => {
            console.log('⏰ Connection timeout after 15 seconds');
            ws.close();
            resolve({ success: false, error: 'Timeout' });
        }, 15000);
        
        ws.on('open', () => {
            console.log('✅ WebSocket connection established');
            console.log('⏳ Waiting for session.created...');
        });
        
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                console.log(`📨 Received: ${message.type}`);
                
                if (message.type === 'session.created') {
                    sessionCreated = true;
                    console.log('✅ Session created successfully!');
                    console.log(`📋 Session ID: ${message.session.id}`);
                    console.log(`🎯 Model: ${message.session.model}`);
                    console.log('⏳ Waiting 3 seconds to see if server errors occur...');
                    
                    // Wait a bit to see if we get server errors like in the logs
                    setTimeout(() => {
                        clearTimeout(timeout);
                        ws.close();
                        resolve({ 
                            success: true, 
                            sessionId: message.session.id,
                            noImmediateError: !errorReceived 
                        });
                    }, 3000);
                    
                } else if (message.type === 'error') {
                    errorReceived = message.error;
                    console.log('❌ Server error received:');
                    console.log(`   Type: ${message.error.type}`);
                    console.log(`   Message: ${message.error.message}`);
                    console.log(`   Event ID: ${message.error.event_id || 'N/A'}`);
                    
                    clearTimeout(timeout);
                    ws.close();
                    resolve({ success: false, error: message.error });
                }
            } catch (e) {
                console.log('📦 Received binary/non-JSON data:', data.length, 'bytes');
            }
        });
        
        ws.on('error', (error) => {
            console.log('❌ WebSocket error:', error.message);
            clearTimeout(timeout);
            resolve({ success: false, error: error.message });
        });
        
        ws.on('close', (code, reason) => {
            console.log(`🔌 Connection closed: ${code} ${reason}`);
            clearTimeout(timeout);
            
            if (!sessionCreated && !errorReceived) {
                resolve({ success: false, error: `Connection closed without session (${code})` });
            }
        });
    });
}

// Run tests
async function runTests() {
    console.log('🚀 Starting OpenAI Realtime API independent test\n');
    
    const regularAPIWorks = await testRegularAPI();
    
    if (!regularAPIWorks) {
        console.log('\n❌ Regular API test failed - check your API key');
        return;
    }
    
    const realtimeResult = await testRealtimeAPI();
    
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    console.log(`Regular API: ${regularAPIWorks ? '✅ Working' : '❌ Failed'}`);
    console.log(`Realtime API: ${realtimeResult.success ? '✅ Working' : '❌ Failed'}`);
    
    if (!realtimeResult.success) {
        console.log(`❌ Realtime API Issue: ${realtimeResult.error?.message || realtimeResult.error}`);
        console.log('\n💡 CONCLUSION: The issue is with OpenAI\'s Realtime API service, not our code.');
        console.log('   This matches the reported issues since January 23, 2025.');
        console.log('   Try again later or contact OpenAI support.');
    } else {
        console.log('✅ Realtime API appears to be working');
        if (!realtimeResult.noImmediateError) {
            console.log('⚠️ But server errors occurred during session - API may be unstable');
        }
    }
    
    console.log('\nSession ID for OpenAI support:', realtimeResult.sessionId || 'N/A');
}

// Handle CTRL+C gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Test interrupted by user');
    process.exit(0);
});

runTests().catch(console.error);
# Voice Assistant Setup Instructions

## Quick Fix for Voice Assistant Not Working

The voice assistant requires a WebSocket proxy server to connect to OpenAI's Realtime API. Here's how to get it working:

### Option 1: Run Local Server (Recommended for Testing)

1. **Set your OpenAI API Key:**
   ```bash
   export OPENAI_API_KEY="sk-your-openai-api-key-here"
   ```

2. **Install dependencies:**
   ```bash
   npm install ws
   ```

3. **Run the simple server:**
   ```bash
   node simple_server.js
   ```

4. **Open the voice assistant:**
   - Go to: `http://localhost:8080`
   - Click to activate voice assistant
   - Grant microphone permissions
   - Start speaking!

### Option 2: Deploy to Railway (Production)

1. **Create Railway account:** https://railway.app
2. **Deploy this project to Railway**
3. **Set environment variables:**
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `PORT`: 8080 (Railway will override this)

### Option 3: Deploy to Vercel with Serverless Functions

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`
3. Set environment variable in Vercel dashboard

### Troubleshooting

**Common Issues:**

1. **"Connection failed" or "Server unreachable"**
   - Check if the proxy server is running
   - Verify API key is set correctly
   - Check network/firewall settings

2. **"Microphone access required"**
   - Grant microphone permissions in browser
   - Try refreshing the page
   - Check browser security settings

3. **"OpenAI server error"**
   - Verify your OpenAI API key has Realtime API access
   - Check OpenAI API quotas/limits
   - Try again in a few minutes

4. **WebSocket connection timeout**
   - Check internet connection
   - Try different network (mobile hotspot)
   - Disable VPN/proxy if using

### Testing the Setup

1. Open browser developer tools (F12)
2. Check Console for error messages
3. Monitor Network tab for WebSocket connections
4. Look for successful "session.created" messages

### Current Status

- ✅ Client code is working correctly
- ❌ Railway proxy server is not accessible
- ✅ Local server solution provided
- ✅ Error handling implemented

### Quick Test Commands

```bash
# Check if local server is running
curl http://localhost:8080/status

# Test WebSocket connection (with wscat)
npm install -g wscat
wscat -c ws://localhost:8080/realtime
```

The voice assistant should work perfectly once you have a running proxy server with a valid OpenAI API key.
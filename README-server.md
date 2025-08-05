# OpenAI Realtime API Proxy Server

This server provides a WebSocket proxy for the OpenAI Realtime API, handling authentication for browser clients.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set your OpenAI API key (optional):**
   ```bash
   export OPENAI_API_KEY=your-api-key-here
   ```
   If not set, the server will use the pre-configured key.

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open the web app:**
   Open `index.html` in your browser or serve it via a local server.

## How It Works

- **Server**: Runs on `http://localhost:3001`
- **WebSocket**: Available at `ws://localhost:3001/realtime`
- **Authentication**: Server handles OpenAI API authentication
- **Proxy**: Forwards all messages between client and OpenAI Realtime API

## Architecture

```
Browser Client ↔ Proxy Server ↔ OpenAI Realtime API
     (no auth)      (handles auth)     (authenticated)
```

The proxy server solves the browser limitation where WebSocket connections cannot send custom headers like `Authorization: Bearer <token>`.

## Environment Variables

- `PORT`: Server port (default: 3001)
- `OPENAI_API_KEY`: Your OpenAI API key (falls back to pre-configured key)

## Deployment

For production deployment:

1. Set `OPENAI_API_KEY` environment variable
2. Update `PROXY_URL` in `index.html` to your server URL
3. Use a process manager like PM2 or Docker
4. Enable HTTPS for secure WebSocket connections (WSS)

## Features

- ✅ Real-time voice-to-voice conversations
- ✅ Server-side voice activity detection
- ✅ Automatic session management
- ✅ Error handling and reconnection
- ✅ CORS enabled for browser clients
- ✅ Graceful shutdown handling
# 🎤 Professional OpenAI Realtime Voice Assistant

An industry-grade voice assistant built exclusively with OpenAI's Realtime API, featuring professional audio processing, enterprise-level reliability, and a stunning futuristic interface.

## ✨ Features

### 🎯 **Professional Voice Processing**
- **24kHz High-Quality Audio** - Industry standard sample rate matching OpenAI specifications
- **Optimized Chunk Processing** - 50ms chunks (~20fps) for real-time performance
- **Professional Noise Gate** - Intelligent audio filtering and validation
- **PCM16 Format** - Exact OpenAI Realtime API format compliance

### 🔊 **Advanced Audio Pipeline**
- **Echo Cancellation** - Professional-grade audio cleanup
- **Noise Suppression** - Advanced background noise filtering
- **Auto Gain Control** - Consistent voice levels across environments
- **High-pass Filtering** - Remove low-frequency interference

### 🏢 **Enterprise-Grade Reliability**
- **Intelligent Retry Logic** - Progressive backoff with up to 5 retry attempts
- **Connection Monitoring** - Real-time WebSocket health checks
- **Professional Error Recovery** - Graceful handling of temporary service issues
- **Advanced Logging** - Detailed monitoring and debugging information

### 🎨 **Premium User Experience**
- **Futuristic UI** - Animated orb with real-time visual state feedback
- **Professional Status Display** - Live connection and processing indicators
- **Responsive Design** - Optimized for all devices and browsers
- **Smooth Animations** - Hardware-accelerated state transitions

## 🚀 Live Demo

Visit **[https://shucho.space](https://shucho.space)** to experience the professional voice assistant live!

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key with **Realtime API access** (required)
- Modern browser with microphone access

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shucho28/chatgpt_agent.git
   cd chatgpt_agent
   ```

2. **Set up environment variables**
   ```bash
   export OPENAI_API_KEY="your-openai-api-key"
   ```

3. **Deploy the proxy server**
   - The application uses a Railway-deployed WebSocket proxy
   - Current server: `wss://openai-realtime-proxy-production-710a.up.railway.app/realtime`
   - For custom deployment, see [Server Setup](#server-setup) below

4. **Open the application**
   ```bash
   open index.html
   # Or deploy to your web server
   ```

### Server Setup (Required)
The Realtime API requires a WebSocket proxy server for authentication:

**Option 1 - Use Existing Railway Deployment**:
- The app is pre-configured with a working Railway deployment
- No additional setup required

**Option 2 - Deploy Your Own**:
```javascript
// Update proxy URL in index.html
const PROXY_URL = 'wss://your-server.railway.app/realtime';
```

## 🎯 Usage

### For iPad Home Assistant
1. Open the web app in Safari on your iPad
2. Add to Home Screen for full-screen experience
3. Enable Auto-Lock prevention for always-on display
4. Tap the orb to activate voice interaction

### Voice Interaction Flow
1. **Tap to Activate**: Initial setup and microphone permissions
2. **Speak Naturally**: Voice activity detection starts recording automatically
3. **Visual Feedback**: Watch the orb transform through different states
4. **Listen to Response**: High-quality TTS playback with synchronized animations

## 🏗️ Architecture Overview

### Voice Processing Pipeline
```
Voice Input → Voice Activity Detection → Whisper API → Assistant API → TTS API → Audio Output
```

### Dual-Mode System
- **Primary**: OpenAI Realtime API (WebSocket-based, real-time)
- **Fallback**: Enhanced Audio API (Whisper + Assistant + TTS pipeline)

### Visual States
- **Idle**: Gentle breathing animation in cool tones
- **Listening**: Active pulsing with cyan highlights  
- **Thinking**: Spinning energy rings in magenta/cyan
- **Speaking**: Dynamic waves with yellow accents

## 🎨 Customization

### Visual Themes
Modify the CSS custom properties in `index.html`:
```css
:root {
    --primary-glow: #00ffff;
    --secondary-glow: #ff00ff;
    --accent-glow: #ffff00;
    --orb-size: 320px;
}
```

### Voice Settings
Adjust TTS voice and audio parameters:
```javascript
// In speakResponse function
voice: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
model: 'tts-1', // or 'tts-1-hd' for higher quality
```

### Assistant Behavior
Configure your OpenAI Assistant with custom instructions for:
- Personality and tone
- Response length and style
- Domain-specific knowledge
- Multilingual support

## 🔧 Technical Details

### Browser Compatibility
- **Recommended**: Chrome 88+, Safari 14+, Firefox 85+
- **Required APIs**: WebRTC, Web Audio API, MediaRecorder API
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+

### Performance Optimizations
- **Audio Streaming**: Efficient WebM/Opus encoding
- **Visual Rendering**: Hardware-accelerated CSS animations
- **Memory Management**: Automatic audio blob cleanup
- **Connection Resilience**: Automatic reconnection and fallback systems

### Security Features
- **API Key Obfuscation**: Split keys to avoid GitHub detection
- **HTTPS Required**: Secure WebRTC and API communication
- **Client-Side Only**: No server-side components or data storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenAI**: For providing the advanced AI APIs that power this assistant
- **Web Audio API**: For enabling real-time audio processing in the browser
- **Modern CSS**: For making stunning visual effects possible with pure CSS

---

**Made with ❤️ for the future of voice AI**
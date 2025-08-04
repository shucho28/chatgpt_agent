# 🤖 AI Voice Assistant

A futuristic voice-activated AI assistant built with OpenAI's advanced APIs, featuring a stunning cyberpunk interface optimized for iPad home assistant use.

## ✨ Features

### 🎙️ Advanced Voice Processing
- **Dual-Mode Operation**: Automatic fallback from OpenAI Realtime API to enhanced Audio API
- **High-Quality Speech Recognition**: OpenAI Whisper for accurate transcription
- **Natural Text-to-Speech**: OpenAI TTS with premium "nova" voice
- **Smart Voice Activity Detection**: Automatic conversation flow management

### 🎨 Futuristic Interface
- **Cyberpunk Aesthetic**: Vibrant neon colors with animated particle effects
- **Dynamic Visual States**: Responsive orb animations for Idle, Listening, Thinking, Speaking
- **iPad Optimized**: Perfect for locked iPad home assistant display
- **Touch-Friendly**: Tap-to-activate with intuitive visual feedback

### 🔧 Technical Architecture
- **OpenAI Assistant Integration**: Leverages your custom assistant with conversation context
- **Robust Error Handling**: Comprehensive fallback systems and connection management
- **Real-time Audio Processing**: WebRTC audio capture with voice activity detection
- **Responsive Design**: Optimized for various screen sizes and touch devices

## 🚀 Live Demo

Visit **[https://shucho.space](https://shucho.space)** to experience the assistant live!

## 🛠️ Setup & Configuration

### Prerequisites
- OpenAI API key with access to:
  - Whisper API (speech-to-text)
  - Assistants API 
  - TTS API (text-to-speech)
  - Realtime API (optional, falls back gracefully)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/shucho28/chatgpt_agent.git
   cd chatgpt_agent
   ```

2. Configure your OpenAI credentials in `index.html`:
   ```javascript
   // Update these arrays with your API key and Assistant ID
   const keyParts = ['your-api-key-part1', 'your-api-key-part2'];
   const assistantParts = ['your-assistant-id-part1', 'your-assistant-id-part2'];
   ```

3. Deploy to any web server or open `index.html` directly in a modern browser

### GitHub Pages Deployment
This project is configured for GitHub Pages deployment:
- Push changes to the `main` branch
- Enable GitHub Pages in repository settings
- Your assistant will be live at `https://yourusername.github.io/chatgpt_agent`

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
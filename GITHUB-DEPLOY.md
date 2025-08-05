# Deploy on GitHub (Free Options)

## Option 1: GitHub Codespaces (Recommended)

**This is the simplest way to deploy on GitHub infrastructure:**

1. **Go to your GitHub repo**: `https://github.com/shucho28/chatgpt_agent`

2. **Click the green "Code" button** → **"Codespaces"** → **"Create codespace on main"**

3. **Wait for setup** (auto-installs and starts the server)

4. **Get your public URL**:
   - Look for "Port 3001" notification
   - Click "Make Public" 
   - Copy the URL (looks like: `https://scaling-enigma-abcd1234-3001.app.github.dev`)

5. **Update client code**:
   - Replace line 332 in `index.html`:
   ```javascript
   return 'wss://your-codespace-url.app.github.dev/realtime';
   ```

6. **Set your API key**:
   - In Codespace terminal: `export OPENAI_API_KEY=your-actual-key`
   - Restart: `npm start`

7. **Push changes**:
   ```bash
   git add .
   git commit -m "Update proxy URL for GitHub Codespace"
   git push
   ```

**Result**: shucho.space works with GitHub-hosted server! 🎉

## Option 2: One-Click Railway Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/XXXXXX)

1. Click the button above
2. Connect your GitHub account
3. Set `OPENAI_API_KEY` environment variable
4. Get the deployed URL and update `index.html`

## Option 3: GitHub Actions + Free Hosting

The repo includes GitHub Actions that auto-deploy to Railway when you push code.

**Setup**:
1. Go to repo Settings → Secrets and Variables → Actions
2. Add secrets:
   - `RAILWAY_TOKEN`: Get from Railway dashboard
   - `OPENAI_API_KEY`: Your OpenAI API key
3. Push code → auto-deploys!

## Current Status

- ✅ **GitHub Pages**: Serves the client (shucho.space)
- ⏳ **Server**: Needs deployment (use Codespaces for instant setup)

**Codespaces is the easiest** - it's literally GitHub's own infrastructure and takes 30 seconds to set up!
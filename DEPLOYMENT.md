# Deployment Guide for OpenAI Realtime API Voice Assistant

To see your voice assistant live on **shucho.space**, you need to deploy the proxy server to a cloud service.

## Quick Deployment Options

### Option 1: Vercel (Recommended - Free)

1. **Create Vercel account**: [vercel.com](https://vercel.com)

2. **Deploy the server**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy (will ask for login)
   vercel --prod
   ```

3. **Set environment variable**:
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add: `OPENAI_API_KEY` = `your-actual-api-key`
   - Redeploy: `vercel --prod`

4. **Update client code**:
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Update line 332 in `index.html`:
   ```javascript
   return 'wss://your-app.vercel.app/realtime';
   ```

5. **Push to GitHub Pages**:
   ```bash
   git add .
   git commit -m "Update proxy URL for production"
   git push
   ```

### Option 2: Railway (Alternative - Free Tier)

1. **Create Railway account**: [railway.app](https://railway.app)
2. **Connect GitHub repo** and deploy
3. **Add environment variable**: `OPENAI_API_KEY`
4. **Update proxy URL** in `index.html` with your Railway URL

### Option 3: Render (Alternative - Free Tier)

1. **Create Render account**: [render.com](https://render.com)
2. **Create Web Service** from GitHub repo
3. **Set environment variable**: `OPENAI_API_KEY`
4. **Update proxy URL** in `index.html` with your Render URL

## Current Status

- ✅ **Local**: Works with `npm start` + `index.html`
- ⏳ **Production**: Needs server deployment + URL update

## After Deployment

1. Your proxy server will be live at `https://your-deployed-url`
2. Update the proxy URL in `index.html`
3. Push to GitHub - automatically deploys to shucho.space
4. Voice assistant works globally! 🌍

## Security Notes

- Never commit your real API key to GitHub
- Use environment variables on the deployed server
- The current obfuscated key in the code is safe for GitHub

## Architecture

```
shucho.space → Your Deployed Server → OpenAI Realtime API
   (client)        (proxy + auth)         (voice AI)
```

Would you like me to help you deploy to Vercel? It's the fastest option!
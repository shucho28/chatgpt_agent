# 🚀 Deployment Guide

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "New Project"**
3. **Import your `chatgpt_agent` repository**
4. **Configure the project:**
   - Framework Preset: **Other**
   - Root Directory: **/** (leave default)
   - Build Command: **`npm install`** (leave default)
   - Output Directory: **/** (leave default)
   - Install Command: **`npm install`** (leave default)

5. **Add Environment Variable:**
   - Key: `OPENAI_API_KEY`
   - Value: `[Your OpenAI API key from server.js or environment]`

6. **Click "Deploy"**

Your server will be deployed to a URL like: `https://your-project-name.vercel.app`

## Option 2: Deploy via CLI

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy to production:**
   ```bash
   vercel --prod
   ```

3. **Set environment variable:**
   ```bash
   vercel env add OPENAI_API_KEY
   ```

## After Deployment

Once deployed, you'll get a URL like `https://chatgpt-agent-xyz.vercel.app`. 

The app will automatically use this URL when running on shucho.space!

## Testing

1. Visit your deployed URL to see: "OpenAI Realtime API Proxy running..."
2. Test WebSocket at: `wss://your-vercel-url.vercel.app/realtime`
3. Visit shucho.space - it should auto-connect!

## Troubleshooting

- ✅ Make sure `OPENAI_API_KEY` environment variable is set
- ✅ Check that `vercel.json` is properly configured
- ✅ Verify the server starts without errors in Vercel logs
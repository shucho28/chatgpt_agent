#!/bin/bash

echo "🚀 OpenAI Realtime API Voice Assistant Deployment"
echo "================================================"

# Check if we're in a Codespace
if [ -n "$CODESPACE_NAME" ]; then
    echo "✅ Running in GitHub Codespace: $CODESPACE_NAME"
    
    # Start the server in background
    echo "🔧 Starting proxy server..."
    npm start &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 3
    
    # Get the Codespace URL
    CODESPACE_URL="https://${CODESPACE_NAME}-3001.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    echo "🌐 Server URL: $CODESPACE_URL"
    
    # Update the client code
    echo "📝 Updating client configuration..."
    sed -i "s|REPLACE-WITH-YOUR-CODESPACE-URL|${CODESPACE_NAME}-3001.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}|g" index.html
    
    # Commit and push
    echo "📤 Pushing to GitHub Pages..."
    git add index.html
    git commit -m "🚀 Auto-deploy: Update proxy URL to Codespace ($CODESPACE_URL)"
    git push
    
    echo "✅ Deployment complete!"
    echo "🎤 Voice assistant is now live at: https://shucho.space"
    echo "🔧 Server running at: $CODESPACE_URL"
    echo ""
    echo "⚠️  Keep this Codespace running for the voice assistant to work"
    echo "💡 The server will auto-sleep after 30 minutes of inactivity"
    
else
    echo "❌ This script should be run in a GitHub Codespace"
    echo "💡 Go to: https://github.com/shucho28/chatgpt_agent"
    echo "   Click: Code → Codespaces → Create codespace on main"
    echo "   Then run: ./deploy.sh"
fi
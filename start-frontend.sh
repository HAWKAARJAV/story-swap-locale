#!/bin/bash
echo "🎨 Starting Story Swap Frontend..."
cd "$(dirname "$0")/frontend/vite-frontend"
echo "📁 Working directory: $(pwd)"
echo "⚡ Starting Vite development server..."
echo ""
echo "🌐 Frontend will be available at:"
echo "   http://localhost:8080 (primary)"
echo "   http://localhost:8081 (if 8080 is busy)"
echo ""
npm run dev
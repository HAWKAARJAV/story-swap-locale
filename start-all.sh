#!/bin/bash
echo "🚀 Starting Complete Story Swap Application..."
echo "============================================="
echo ""

PROJECT_DIR="$(dirname "$0")"
cd "$PROJECT_DIR"

# Check if MongoDB is running
echo "🍃 Checking MongoDB status..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB not running. Starting MongoDB..."
    if command -v brew &> /dev/null; then
        brew services start mongodb-community@7.0 2>/dev/null || brew services start mongodb/brew/mongodb-community 2>/dev/null
        sleep 3
        if pgrep -x "mongod" > /dev/null; then
            echo "✅ MongoDB started successfully"
        else
            echo "⚠️  Could not start MongoDB automatically. Please start it manually:"
            echo "   brew services start mongodb-community"
            exit 1
        fi
    else
        echo "❌ Please install and start MongoDB manually"
        exit 1
    fi
else
    echo "✅ MongoDB is already running"
fi

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend server stopped"
    fi
    echo "👋 Goodbye!"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start backend in background
echo ""
echo "🚀 Starting Backend Server..."
cd backend
node server.js &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID) on http://localhost:3001"

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Check if backend is responding
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is responding"
else
    echo "⚠️  Backend might still be starting..."
fi

# Start frontend
echo ""
echo "🎨 Starting Frontend Server..."
echo "🌐 Frontend will be available at:"
echo "   http://localhost:8080 (primary)"
echo "   http://localhost:8081 (if 8080 is busy)"
echo ""
echo "🔐 Demo Login Credentials:"
echo "   Admin: admin@example.com / test1234"
echo "   User:  rita@example.com / test1234"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=================================="

cd ../frontend/vite-frontend
npm run dev

# This will run when npm run dev exits
cleanup
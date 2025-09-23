#!/bin/bash
echo "🚀 Starting Story Swap Backend..."
cd "$(dirname "$0")/backend"
echo "📁 Working directory: $(pwd)"
echo "🍃 Connecting to MongoDB..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB not detected. Starting MongoDB..."
    if command -v brew &> /dev/null; then
        brew services start mongodb-community@7.0 2>/dev/null || brew services start mongodb/brew/mongodb-community 2>/dev/null
        sleep 3
        if pgrep -x "mongod" > /dev/null; then
            echo "✅ MongoDB started successfully"
        else
            echo "⚠️  Please start MongoDB manually: brew services start mongodb-community"
        fi
    else
        echo "⚠️  Please start MongoDB manually"
    fi
fi

# Start the backend server
echo "🚀 Starting backend server on port 3001..."
node server.js
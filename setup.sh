#!/bin/bash

# Story Swap Complete Setup Script
# This script sets up the entire project from scratch

echo "🚀 Setting up Story Swap Project..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    print_error "Please run this script from the story-swap-locale root directory"
    exit 1
fi

print_info "Setting up Story Swap in: $(pwd)"

# 1. Install Backend Dependencies
echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_status "Backend dependencies installed"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
else
    print_error "Backend package.json not found"
    exit 1
fi

# 2. Install Database Dependencies
echo ""
echo "🗄️  Setting up Database Dependencies..."
cd ../database
if [ -f "package.json" ]; then
    npm install
    print_status "Database dependencies installed"
else
    print_warning "Database package.json not found, creating minimal setup"
    npm init -y > /dev/null 2>&1
    npm install mongoose > /dev/null 2>&1
fi

# 3. Install Frontend Dependencies
echo ""
echo "🎨 Installing Frontend Dependencies..."
cd ../frontend/vite-frontend
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
else
    print_error "Frontend package.json not found"
    exit 1
fi

# 4. Setup Environment Files
echo ""
echo "⚙️  Setting up Environment Configuration..."
cd ../..

# Ensure .env files exist
if [ ! -f "backend/.env" ]; then
    print_warning "Creating backend .env file"
    cp backend/.env.example backend/.env 2>/dev/null || touch backend/.env
fi

if [ ! -f "frontend/vite-frontend/.env" ]; then
    print_warning "Creating frontend .env file"
    cat > frontend/vite-frontend/.env << EOF
# MapTiler Configuration (Primary Map Provider)
VITE_MAPTILER_API_KEY=NSO8JuqWXOqh8UZs5tpY

# Google Maps Configuration (Fallback)
# VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# API Configuration
VITE_API_URL=http://localhost:3001

# App Configuration
VITE_APP_NAME=Story Swap
VITE_APP_VERSION=1.0.0
EOF
fi

print_status "Environment files configured"

# 5. Check MongoDB
echo ""
echo "🍃 Checking MongoDB..."
if command -v mongod &> /dev/null; then
    if pgrep -x "mongod" > /dev/null; then
        print_status "MongoDB is running"
    else
        print_warning "Starting MongoDB..."
        if command -v brew &> /dev/null; then
            brew services start mongodb-community@7.0 2>/dev/null || brew services start mongodb/brew/mongodb-community 2>/dev/null
            sleep 3
            if pgrep -x "mongod" > /dev/null; then
                print_status "MongoDB started successfully"
            else
                print_warning "Please start MongoDB manually: brew services start mongodb-community"
            fi
        else
            print_warning "Please start MongoDB manually"
        fi
    fi
else
    print_warning "MongoDB not found. Please install MongoDB"
fi

# 6. Create startup scripts
echo ""
echo "📜 Creating startup scripts..."

# Backend startup script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Story Swap Backend..."
cd backend
echo "📁 Working directory: $(pwd)"
echo "🍃 Connecting to MongoDB..."
node server.js
EOF

# Frontend startup script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🎨 Starting Story Swap Frontend..."
cd frontend/vite-frontend
echo "📁 Working directory: $(pwd)"
echo "⚡ Starting Vite development server..."
npm run dev
EOF

# Complete startup script
cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Complete Story Swap Application..."
echo "============================================="

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "🍃 Starting MongoDB..."
    if command -v brew &> /dev/null; then
        brew services start mongodb-community@7.0 2>/dev/null || brew services start mongodb/brew/mongodb-community 2>/dev/null
        sleep 3
    fi
fi

# Start backend in background
echo "🚀 Starting Backend Server..."
cd backend && node server.js &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend Server..."
cd ../frontend/vite-frontend && npm run dev

# Cleanup function
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM
EOF

# Make scripts executable
chmod +x start-backend.sh start-frontend.sh start-all.sh

print_status "Startup scripts created"

# 7. Setup complete
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "   1. To start everything: ./start-all.sh"
echo "   2. To start backend only: ./start-backend.sh"
echo "   3. To start frontend only: ./start-frontend.sh"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:8080 or http://localhost:8081"
echo "   Backend:  http://localhost:3001"
echo "   API Docs: http://localhost:3001/api/docs"
echo ""
echo "🔐 Demo Credentials:"
echo "   Admin: admin@example.com / test1234"
echo "   User:  rita@example.com / test1234"
echo ""
print_status "Story Swap is ready to use!"
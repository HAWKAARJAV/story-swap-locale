#!/bin/bash

# Story Swap - Reliable Startup Script
# This script ensures all services start correctly without CORS issues

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -i :$port > /dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill processes on specific ports
cleanup_ports() {
    log_info "Cleaning up any existing processes..."
    
    # Kill processes on common ports
    for port in 3001 8080 8081; do
        if check_port $port; then
            log_warning "Killing existing process on port $port"
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
            sleep 1
        fi
    done
}

# Function to get network IP
get_network_ip() {
    # Try different methods to get network IP
    local ip=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | head -1 | awk '{print $2}')
    if [[ -z "$ip" ]]; then
        ip=$(hostname -I 2>/dev/null | awk '{print $1}' || echo "")
    fi
    echo "$ip"
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    log_info "Waiting for $name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            log_success "$name is ready!"
            return 0
        fi
        
        sleep 1
        attempt=$((attempt + 1))
        
        if [ $((attempt % 5)) -eq 0 ]; then
            log_info "Still waiting for $name... (attempt $attempt/$max_attempts)"
        fi
    done
    
    log_error "$name failed to start within $max_attempts seconds"
    return 1
}

# Main execution
main() {
    log_info "🚀 Starting Story Swap Application..."
    
    # Get current directory
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$SCRIPT_DIR"
    
    # Get network IP
    NETWORK_IP=$(get_network_ip)
    if [[ -n "$NETWORK_IP" ]]; then
        log_info "Network IP detected: $NETWORK_IP"
    else
        log_warning "Could not detect network IP, using localhost only"
    fi
    
    # Cleanup existing processes
    cleanup_ports
    
    # Start MongoDB if not running
    log_info "Checking MongoDB..."
    if ! pgrep -x "mongod" > /dev/null; then
        log_warning "MongoDB not detected. Attempting to start..."
        if command -v brew &> /dev/null; then
            brew services start mongodb-community@7.0 2>/dev/null || brew services start mongodb/brew/mongodb-community 2>/dev/null || true
            sleep 3
        fi
    fi
    
    # Start Database Service
    log_info "Starting Database Service..."
    cd "$SCRIPT_DIR/database"
    nohup npm start > ../logs/database.log 2>&1 &
    DATABASE_PID=$!
    log_success "Database service started (PID: $DATABASE_PID)"
    
    # Start Backend
    log_info "Starting Backend API..."
    cd "$SCRIPT_DIR"
    nohup ./start-backend.sh > logs/backend.log 2>&1 &
    BACKEND_PID=$!
    log_success "Backend started (PID: $BACKEND_PID)"
    
    # Wait for backend to be ready
    wait_for_service "http://localhost:3001/health" "Backend API"
    
    # Start Frontend
    log_info "Starting Frontend..."
    nohup ./start-frontend.sh > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    log_success "Frontend started (PID: $FRONTEND_PID)"
    
    # Wait for frontend to be ready
    sleep 3
    
    # Display access information
    echo ""
    log_success "🎉 Story Swap Application Started Successfully!"
    echo ""
    log_info "📱 Access URLs:"
    echo "   Local:   http://localhost:8080"
    if [[ -n "$NETWORK_IP" ]]; then
        echo "   Network: http://$NETWORK_IP:8080"
    fi
    echo ""
    log_info "🔧 API Endpoints:"
    echo "   Local:   http://localhost:3001/api/v1"
    if [[ -n "$NETWORK_IP" ]]; then
        echo "   Network: http://$NETWORK_IP:3001/api/v1"
    fi
    echo "   Docs:    http://localhost:3001/api/docs"
    echo ""
    log_info "📊 Process IDs (for manual cleanup if needed):"
    echo "   Backend PID:  $BACKEND_PID"
    echo "   Frontend PID: $FRONTEND_PID"
    echo "   Database PID: $DATABASE_PID"
    echo ""
    log_info "📝 Logs are available in:"
    echo "   Backend:  logs/backend.log"
    echo "   Frontend: logs/frontend.log"
    echo "   Database: logs/database.log"
    echo ""
    log_warning "To stop all services, run: ./stop-all.sh"
}

# Create logs directory if it doesn't exist
mkdir -p logs

# Run main function
main "$@"
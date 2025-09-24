#!/bin/bash

# Story Swap - Stop All Services Script

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to kill processes on specific ports
kill_port_processes() {
    local port=$1
    local service_name=$2
    
    if lsof -i :$port > /dev/null 2>&1; then
        log_info "Stopping $service_name (port $port)..."
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
        
        if ! lsof -i :$port > /dev/null 2>&1; then
            log_success "$service_name stopped"
        else
            log_warning "$service_name may still be running"
        fi
    else
        log_info "$service_name not running (port $port)"
    fi
}

log_info "🛑 Stopping Story Swap Services..."

# Stop services by port
kill_port_processes 8080 "Frontend"
kill_port_processes 8081 "Frontend (alternate)"
kill_port_processes 3001 "Backend API"

# Kill any remaining node processes related to the project
log_info "Cleaning up any remaining Node.js processes..."
pkill -f "vite.*story-swap" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true

log_success "🏁 All Story Swap services stopped"
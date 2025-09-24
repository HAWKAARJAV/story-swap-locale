# Story Swap - Reliable Startup Guide

## 🚀 Quick Start (Recommended)

### One-Command Startup
```bash
./start-all-reliable.sh
```

This script will:
- ✅ Clean up any existing processes
- ✅ Start MongoDB if needed
- ✅ Start all services with proper network configuration
- ✅ Validate that everything is working
- ✅ Display access URLs for both localhost and network access

### Stop All Services
```bash
./stop-all.sh
```

## 🔧 Manual Startup (Alternative)

If you prefer to start services individually:

1. **Backend:**
   ```bash
   ./start-backend.sh
   ```

2. **Frontend:**
   ```bash
   ./start-frontend.sh
   ```

3. **Database:**
   ```bash
   cd database && npm start
   ```

## 🌐 Access URLs

After starting, your app will be available at:

- **Local Access:** http://localhost:8080
- **Network Access:** http://YOUR_IP:8080 (accessible from other devices)

API endpoints:
- **Local:** http://localhost:3001/api/v1
- **Network:** http://YOUR_IP:3001/api/v1
- **Documentation:** http://localhost:3001/api/docs

## 🛠️ Configuration Features

### Smart CORS Handling
- ✅ Automatically supports localhost access
- ✅ Automatically supports network IP access
- ✅ No manual CORS configuration needed

### Smart API URL Detection
- ✅ Frontend automatically detects if accessed via localhost or network IP
- ✅ Routes API calls to the correct backend URL
- ✅ No manual configuration needed

### Robust Startup
- ✅ Cleans up existing processes before starting
- ✅ Validates services are running before proceeding
- ✅ Provides clear status messages
- ✅ Logs all output for debugging

## 🐛 Troubleshooting

### If services fail to start:

1. **Check MongoDB:**
   ```bash
   brew services start mongodb-community@7.0
   ```

2. **Clean up manually:**
   ```bash
   ./stop-all.sh
   # Wait 5 seconds
   ./start-all-reliable.sh
   ```

3. **Check logs:**
   ```bash
   tail -f logs/backend.log
   tail -f logs/frontend.log
   tail -f logs/database.log
   ```

### Common Issues:

- **Port conflicts:** The scripts automatically handle port conflicts
- **CORS errors:** Should not occur with the new configuration
- **Network access issues:** Backend now binds to all interfaces (0.0.0.0)

## 📝 What Was Fixed

### Previous Issues:
- ❌ CORS errors when accessing via network IP
- ❌ Frontend hardcoded to localhost API
- ❌ Manual port cleanup needed
- ❌ No validation of service startup

### Current Solution:
- ✅ Dynamic CORS configuration supports any network IP
- ✅ Smart API URL detection based on access method
- ✅ Automatic port cleanup and validation
- ✅ Comprehensive startup validation and logging
- ✅ Backend binds to all network interfaces
- ✅ Robust error handling and recovery

## 🎯 Recommended Workflow

### Daily Development:
```bash
# Start everything
./start-all-reliable.sh

# Work on your app...

# Stop when done
./stop-all.sh
```

### Network Testing:
1. Start with `./start-all-reliable.sh`
2. Note the network IP shown in the output
3. Access from any device: `http://NETWORK_IP:8080`
4. Everything will work automatically!

This setup ensures your Story Swap application will start reliably every time without CORS or configuration issues! 🎉
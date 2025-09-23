# Story Swap - Location-Based Storytelling Platform

A modern, full-stack application for sharing and discovering location-based stories with enhanced MapTiler integration, interactive maps, and beautiful UI.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (v7.0+ recommended)
- npm or yarn

### One-Command Setup
```bash
./setup.sh
```

### Start Application
```bash
# Start both frontend and backend
./start-all.sh

# Or start individually
./start-backend.sh    # Backend only
./start-frontend.sh   # Frontend only
```

## 🌟 Features

### 🗺️ Enhanced Map Integration
- **MapTiler Integration** with API key `NSO8JuqWXOqh8UZs5tpY`
- **Interactive Map Toggle** in Explore page
- **Story Location Markers** with clickable popups
- **Auto-centering** and smart zoom calculation
- **Professional Styling** with MapTiler Streets

### 🖼️ Enhanced UI/UX
- **Rotating Story Images** with error fallbacks
- **Enhanced Story Cards** with hover effects
- **Better Engagement Display** (likes, views, comments)
- **Professional Design** with gradients and animations
- **Responsive Layout** for all devices

### 🔐 Authentication
- **Demo Credentials** for easy testing
- **One-click Login** buttons
- **Role-based Access** (Admin/User)

### 📱 Pages & Features
- **🏠 Home** - Hero section with call-to-action
- **🔍 Explore** - Browse stories with interactive map
- **🗺️ Map View** - Full-screen map experience
- **📝 My Stories** - Story management dashboard
- **✏️ Edit Story** - Rich story editing interface
- **➕ Submit Story** - Create new stories
- **👤 Profile** - User profile management

## 🛠️ Project Structure

```
story-swap-locale/
├── 📂 backend/              # Express.js API server
│   ├── controllers/         # Route controllers
│   ├── routes/             # API routes
│   ├── middleware/         # Auth & error handling
│   ├── utils/              # Utilities
│   └── server.js           # Main server file
├── 📂 frontend/vite-frontend/  # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Frontend utilities
│   │   ├── lib/            # API & utilities
│   │   └── config/         # Environment config
│   └── public/             # Static assets
├── 📂 database/            # Database models & scripts
│   ├── models/             # Mongoose models
│   └── scripts/            # Seed scripts
├── 📂 docs/                # Documentation
├── setup.sh               # Complete setup script
├── start-all.sh           # Start both servers
├── start-backend.sh       # Start backend only
└── start-frontend.sh      # Start frontend only
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```bash
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/hyperlocal-story-swap
JWT_SECRET=your-jwt-secret
```

**Frontend (.env)**
```bash
VITE_MAPTILER_API_KEY=NSO8JuqWXOqh8UZs5tpY
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=Story Swap
```

### Database Setup
The application uses MongoDB. The setup script will:
1. Start MongoDB automatically (if using Homebrew)
2. Create the database on first connection
3. Seed with demo data using admin credentials

## 🎯 Demo Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `test1234`

**User Account:**
- Email: `rita@example.com`
- Password: `test1234`

**Additional User:**
- Email: `sam@example.com`
- Password: `test1234`

## 🌐 Access URLs

After starting the application:

- **Frontend:** http://localhost:8080 or http://localhost:8081
- **Backend API:** http://localhost:3001
- **API Documentation:** http://localhost:3001/api/docs

## 📋 Manual Setup (Alternative)

If you prefer manual setup:

### 1. Install Dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend/vite-frontend && npm install

# Database (if needed)
cd database && npm install
```

### 2. Start MongoDB
```bash
# Using Homebrew
brew services start mongodb-community@7.0

# Or manually
mongod --config /usr/local/etc/mongod.conf
```

### 3. Start Backend
```bash
cd backend && node server.js
```

### 4. Start Frontend
```bash
cd frontend/vite-frontend && npm run dev
```

## 🗺️ MapTiler Setup

The application comes pre-configured with MapTiler API key. To use your own:

1. Get API key from [MapTiler Cloud](https://cloud.maptiler.com/)
2. Update `VITE_MAPTILER_API_KEY` in `frontend/vite-frontend/.env`
3. Restart frontend server

See `docs/MAPTILER_SETUP.md` for detailed instructions.

## 🚫 Troubleshooting

### Common Issues

**MongoDB Connection Failed:**
```bash
brew services start mongodb-community@7.0
```

**Port Already in Use:**
- Frontend will automatically try port 8081 if 8080 is busy
- For backend, stop other services using port 3001

**Missing Dependencies:**
```bash
./setup.sh  # Re-run setup script
```

**Map Not Loading:**
- Check console for MapTiler API errors
- Verify `VITE_MAPTILER_API_KEY` in `.env`
- Restart frontend after env changes

### Reset Database
```bash
cd backend && node scripts/seedData.js
```

## 🤝 Development

### Key Technologies
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Maps:** MapTiler SDK, Google Maps (fallback)
- **Authentication:** JWT, bcrypt

### Development Workflow
1. Start backend: `./start-backend.sh`
2. Start frontend: `./start-frontend.sh`
3. Access frontend at http://localhost:8080
4. API available at http://localhost:3001

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

If you encounter issues:
1. Check this README
2. Review console errors
3. Ensure MongoDB is running
4. Verify environment variables
5. Re-run `./setup.sh`

---

**🎉 Enjoy using Story Swap!**

For detailed API documentation, visit http://localhost:3001/api/docs when the backend is running.
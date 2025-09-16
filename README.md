# 🗺️ Hyperlocal Story Swap

> **A location-based storytelling platform where users share and discover local stories through an innovative swap mechanism.**

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Project Overview

Hyperlocal Story Swap is a revolutionary social platform that combines:
- **📍 Location-based storytelling** - Users create geo-tagged stories tied to specific places
- **🔄 Swap-to-unlock mechanism** - Users must share their own story to unlock others' stories
- **🗺️ Interactive map exploration** - Discover stories through an immersive map interface
- **🏆 Gamification** - Badges, trails, and community challenges
- **🌍 Cultural preservation** - Capture and preserve local folklore and memories

### Perfect For
- **National-level competitions** (Hackathons, Innovation challenges)
- **Tourism boards** seeking authentic local content
- **Cultural preservation** initiatives
- **Community engagement** platforms
- **Educational institutions** studying local history

## 🎯 Key Features

### Core Mechanics
- **Story Creation**: Text, audio, photo, video, and mixed-media stories
- **Swap System**: Trade stories to unlock content from others
- **Map Exploration**: Interactive map with story clustering and location-based discovery
- **Smart Moderation**: AI-powered content filtering with human oversight
- **Trails & Tours**: Curated walking tours through story collections

### Technical Highlights
- **Full-stack architecture** with REST API and modern frontend
- **Real-time features** with WebSocket support
- **Geographic indexing** with MongoDB geospatial queries
- **Scalable media handling** with cloud storage integration
- **Comprehensive authentication** with JWT and OAuth
- **Admin dashboard** for content moderation and analytics

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v6 or higher)
- Git

### Development Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd story-swap-local

# Install backend dependencies
cd backend && npm install

# Start MongoDB (if running locally)
# mongod

# Copy environment file
cp .env.example .env

# Start the backend server
npm run dev
```

The backend server will be running at `http://localhost:5000`

### Frontend (Lovable Integration)

```bash
# Install frontend dependencies (in project root)
npm install

# Start frontend development server
npm run dev
```

### API Documentation

Once the backend server is running, visit:
- **Swagger UI**: http://localhost:5000/api/docs
- **JSON Spec**: http://localhost:5000/api/docs.json

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database with geospatial support
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File upload handling
- **Sharp** - Image processing

### Frontend (Lovable Integration)
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn-ui** - Component library
- **Vite** - Build tool

### External Services
- **Mapbox/Google Maps** - Interactive maps
- **AWS S3** - File storage
- **NodeMailer** - Email notifications
- **Redis** - Caching (optional)

## 📚 Project Structure

```
story-swap-local/
├── backend/                 # Node.js Express API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # Express routes
│   ├── utils/              # Helper functions
│   └── server.js           # Entry point
├── src/                    # Frontend React app (Lovable)
│   ├── components/         # React components
│   ├── pages/              # Page components
│   └── utils/              # Frontend utilities
├── public/                 # Static assets
└── README.md               # This file
```

## 🌐 Core API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh access token

### Stories
- `GET /api/v1/stories` - List stories (with location filtering)
- `POST /api/v1/stories` - Create new story
- `GET /api/v1/stories/:id` - Get story details
- `POST /api/v1/stories/:id/swap` - Request story unlock

### Swaps (Core Feature)
- `POST /api/v1/swaps/:storyId/request-unlock` - Initiate swap
- `GET /api/v1/swaps/user/me` - User's swap history

## 🎮 Demo Data

### Test Accounts
```
Admin Account:
- Email: admin@example.com
- Password: test1234

Demo Users:
- rita@example.com / test1234 (Delhi stories)
- sam@example.com / test1234 (Chennai stories)
```

### Sample Stories
The project includes seed data for 3 Indian cities:
- **Delhi**: Tea stall heritage, India Gate memories
- **Chennai**: Boat race traditions, Marina Beach stories
- **Jaipur**: Poetry walls, cultural art

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode

# Frontend tests (Lovable)
npm test
```

## 🌐 Deployment

### Backend Deployment Options
- **Railway** (Recommended)
- **Heroku**
- **DigitalOcean App Platform**
- **AWS EC2**

### Frontend Deployment (Lovable)
Simply open [Lovable](https://lovable.dev/projects/a5b69a92-36ac-43d8-8867-2041de8b406e) and click Share → Publish

### Database
- **MongoDB Atlas** (Recommended for production)
- Self-hosted MongoDB

## 🏆 National Competition Ready

This project is specifically designed for:
- **Smart India Hackathon**
- **National Innovation Challenges**
- **Tourism Technology Competitions**
- **Cultural Preservation Awards**

### Unique Selling Points
1. **Novel swap mechanic** - First platform to use story-for-story exchange
2. **Cultural preservation focus** - Capturing disappearing local knowledge
3. **Gamification elements** - Making cultural exploration engaging
4. **Accessibility compliance** - WCAG 2.1 AA standards
5. **Scalable architecture** - Ready for national deployment

## 🤝 Contributing

### Using Lovable
Simply visit the [Lovable Project](https://lovable.dev/projects/a5b69a92-36ac-43d8-8867-2041de8b406e) and start prompting for frontend changes.

### Local Development
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Documentation**: Check the `/docs` folder

---

**Built with ❤️ for preserving local stories and connecting communities**

*Ready to revolutionize how we discover and share the stories that make our cities unique.*

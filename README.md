# 🗺️ Hyperlocal Story Swap<<<<<<< HEAD

# 🗺️ Hyperlocal Story Swap

> **A location-based storytelling platform where users share and discover local stories through an innovative swap mechanism.**

> **A location-based storytelling platform where users share and discover local stories through an innovative swap mechanism.**

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green.svg)](https://nodejs.org/)

[![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-green.svg)](https://www.mongodb.com/)[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)[![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-green.svg)](https://www.mongodb.com/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Project Overview

## 🌟 Project Overview

Hyperlocal Story Swap is a revolutionary social platform that combines:

- **📍 Location-based storytelling** - Users create geo-tagged stories tied to specific placesHyperlocal Story Swap is a revolutionary social platform that combines:

- **🔄 Swap-to-unlock mechanism** - Users must share their own story to unlock others' stories- **📍 Location-based storytelling** - Users create geo-tagged stories tied to specific places

- **🗺️ Interactive map exploration** - Discover stories through an immersive map interface- **🔄 Swap-to-unlock mechanism** - Users must share their own story to unlock others' stories

- **🏆 Gamification** - Badges, trails, and community challenges- **🗺️ Interactive map exploration** - Discover stories through an immersive map interface

- **🌍 Cultural preservation** - Capture and preserve local folklore and memories- **🏆 Gamification** - Badges, trails, and community challenges

- **🌍 Cultural preservation** - Capture and preserve local folklore and memories

### Perfect For

- **National-level competitions** (Hackathons, Innovation challenges)### Perfect For

- **Tourism boards** seeking authentic local content- **National-level competitions** (Hackathons, Innovation challenges)

- **Cultural preservation** initiatives- **Tourism boards** seeking authentic local content

- **Community engagement** platforms- **Cultural preservation** initiatives

- **Educational institutions** studying local history- **Community engagement** platforms

- **Educational institutions** studying local history

## 🎯 Key Features

## 🎯 Key Features

### Core Mechanics

- **Story Creation**: Text, audio, photo, video, and mixed-media stories### Core Mechanics

- **Swap System**: Trade stories to unlock content from others- **Story Creation**: Text, audio, photo, video, and mixed-media stories

- **Map Exploration**: Interactive map with story clustering and location-based discovery- **Swap System**: Trade stories to unlock content from others

- **Smart Moderation**: AI-powered content filtering with human oversight- **Map Exploration**: Interactive map with story clustering and location-based discovery

- **Trails & Tours**: Curated walking tours through story collections- **Smart Moderation**: AI-powered content filtering with human oversight

- **Trails & Tours**: Curated walking tours through story collections

### Technical Highlights

- **Full-stack architecture** with REST API and modern frontend### Technical Highlights

- **Real-time features** with WebSocket support- **Full-stack architecture** with REST API and modern frontend

- **Geographic indexing** with MongoDB geospatial queries- **Real-time features** with WebSocket support

- **Scalable media handling** with cloud storage integration- **Geographic indexing** with MongoDB geospatial queries

- **Comprehensive authentication** with JWT and OAuth- **Scalable media handling** with cloud storage integration

- **Admin dashboard** for content moderation and analytics- **Comprehensive authentication** with JWT and OAuth

- **Admin dashboard** for content moderation and analytics

## 🚀 Quick Start

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)### Prerequisites

- MongoDB (v6 or higher)- Node.js (v16 or higher)

- Git- MongoDB (v6 or higher)

- Git

### Development Setup

### Development Setup

```bash

# Clone the repository```bash

git clone https://github.com/HAWKAARJAV/story-swap-locale.git# Clone the repository

cd story-swap-localgit clone <YOUR_GIT_URL>

cd story-swap-local

# Backend Setup

cd backend && npm install# Install backend dependencies

cp .env.example .envcd backend && npm install

npm run dev

# Start MongoDB (if running locally)

# Frontend Setup (Vite)# mongod

cd ../frontend/vite-frontend && npm install

npm run dev# Copy environment file

cp .env.example .env

# Frontend Setup (Next.js)

cd ../frontend && npm install# Start the backend server

npm run devnpm run dev

```

# Database Setup

cd ../database && npm installThe backend server will be running at `http://localhost:5000`

npm run seed

```### Frontend (Lovable Integration)



### API Documentation```bash

# Install frontend dependencies (in project root)

Once the backend server is running, visit:npm install

- **Swagger UI**: http://localhost:5000/api/docs

- **JSON Spec**: http://localhost:5000/api/docs.json# Start frontend development server

npm run dev

## 🛠️ Technology Stack```



### Backend### API Documentation

- **Node.js** - JavaScript runtime

- **Express.js** - Web frameworkOnce the backend server is running, visit:

- **MongoDB** - Database with geospatial support- **Swagger UI**: http://localhost:5000/api/docs

- **Mongoose** - MongoDB ODM- **JSON Spec**: http://localhost:5000/api/docs.json

- **JWT** - Authentication

- **Multer** - File upload handling## 🛠️ Technology Stack



### Frontend### Backend

- **React** - UI framework (Both Next.js and Vite versions)- **Node.js** - JavaScript runtime

- **TypeScript** - Type safety- **Express.js** - Web framework

- **Tailwind CSS** - Styling- **MongoDB** - Database with geospatial support

- **shadcn-ui** - Component library- **Mongoose** - MongoDB ODM

- **Next.js** - Full-stack React framework- **JWT** - Authentication

- **Vite** - Fast build tool- **Multer** - File upload handling

- **Sharp** - Image processing

## 📚 Reorganized Project Structure

### Frontend (Lovable Integration)

```- **React** - UI framework

story-swap-local/- **TypeScript** - Type safety

├── backend/                 # Express.js API server- **Tailwind CSS** - Styling

│   ├── config/             # Server configurations- **shadcn-ui** - Component library

│   ├── controllers/        # Request handlers- **Vite** - Build tool

│   ├── middleware/         # Express middleware

│   ├── routes/             # API route definitions### External Services

│   ├── services/           # Business logic services- **Mapbox/Google Maps** - Interactive maps

│   ├── utils/              # Utility functions- **AWS S3** - File storage

│   └── server.js           # Main server file- **NodeMailer** - Email notifications

├── database/               # Database layer (MongoDB/Mongoose)- **Redis** - Caching (optional)

│   ├── models/             # Mongoose data models

│   ├── scripts/            # Database migration scripts## 📚 Project Structure

│   ├── seedDatabase.js     # Database seeding script

│   ├── verifyData.js       # Data verification script```

│   └── database.js         # Database connection configurationstory-swap-local/

├── frontend/               # Frontend applications├── backend/                 # Node.js Express API

│   ├── (Next.js app)/      # Next.js frontend│   ├── config/             # Configuration files

│   └── vite-frontend/      # Vite/React frontend│   ├── controllers/        # Route controllers

│       ├── src/            # React components and pages│   ├── middleware/         # Custom middleware

│       ├── public/         # Static assets│   ├── models/             # MongoDB models

│       ├── index.html      # Main HTML template│   ├── routes/             # Express routes

│       ├── vite.config.ts  # Vite configuration│   ├── utils/              # Helper functions

│       └── package.json    # Frontend dependencies│   └── server.js           # Entry point

└── docs/                   # Project documentation├── src/                    # Frontend React app (Lovable)

```│   ├── components/         # React components

│   ├── pages/              # Page components

## 🌐 Core API Endpoints│   └── utils/              # Frontend utilities

├── public/                 # Static assets

### Authentication└── README.md               # This file

- `POST /api/v1/auth/register` - Create new account```

- `POST /api/v1/auth/login` - User login

- `GET /api/v1/auth/me` - Get current user## 🌐 Core API Endpoints

- `POST /api/v1/auth/refresh` - Refresh access token

### Authentication

### Stories- `POST /api/v1/auth/register` - Create new account

- `GET /api/v1/stories` - List stories (with location filtering)- `POST /api/v1/auth/login` - User login

- `POST /api/v1/stories` - Create new story- `GET /api/v1/auth/me` - Get current user

- `GET /api/v1/stories/:id` - Get story details- `POST /api/v1/auth/refresh` - Refresh access token

- `POST /api/v1/stories/:id/swap` - Request story unlock

### Stories

### Swaps (Core Feature)- `GET /api/v1/stories` - List stories (with location filtering)

- `POST /api/v1/swaps/:storyId/request-unlock` - Initiate swap- `POST /api/v1/stories` - Create new story

- `GET /api/v1/swaps/user/me` - User's swap history- `GET /api/v1/stories/:id` - Get story details

- `POST /api/v1/stories/:id/swap` - Request story unlock

## 🎮 Demo Data

### Swaps (Core Feature)

### Test Accounts- `POST /api/v1/swaps/:storyId/request-unlock` - Initiate swap

```- `GET /api/v1/swaps/user/me` - User's swap history

Admin Account:

- Email: admin@example.com## 🎮 Demo Data

- Password: test1234

### Test Accounts

Demo Users:```

- rita@example.com / test1234 (Delhi stories)Admin Account:

- sam@example.com / test1234 (Chennai stories)- Email: admin@example.com

```- Password: test1234



### Sample StoriesDemo Users:

The project includes seed data for 3 Indian cities:- rita@example.com / test1234 (Delhi stories)

- **Delhi**: Tea stall heritage, India Gate memories- sam@example.com / test1234 (Chennai stories)

- **Chennai**: Boat race traditions, Marina Beach stories```

- **Jaipur**: Poetry walls, cultural art

### Sample Stories

## 🧪 TestingThe project includes seed data for 3 Indian cities:

- **Delhi**: Tea stall heritage, India Gate memories

```bash- **Chennai**: Boat race traditions, Marina Beach stories

# Backend tests- **Jaipur**: Poetry walls, cultural art

cd backend && npm test

## 🧪 Testing

# Frontend tests (Vite)

cd frontend/vite-frontend && npm test```bash

# Backend tests

# Frontend tests (Next.js)cd backend

cd frontend && npm testnpm test                    # Run all tests

```npm run test:watch         # Watch mode



## 🌐 Deployment# Frontend tests (Lovable)

npm test

### Running the Applications```



#### Backend API Server## 🌐 Deployment

```bash

cd backend### Backend Deployment Options

npm install- **Railway** (Recommended)

npm start- **Heroku**

```- **DigitalOcean App Platform**

- **AWS EC2**

#### Database Operations

```bash### Frontend Deployment (Lovable)

cd databaseSimply open [Lovable](https://lovable.dev/projects/a5b69a92-36ac-43d8-8867-2041de8b406e) and click Share → Publish

npm install

npm run seed    # Seed the database### Database

npm run verify  # Verify data integrity- **MongoDB Atlas** (Recommended for production)

```- Self-hosted MongoDB



#### Vite Frontend## 🏆 National Competition Ready

```bash

cd frontend/vite-frontendThis project is specifically designed for:

npm install- **Smart India Hackathon**

npm run dev- **National Innovation Challenges**

```- **Tourism Technology Competitions**

- **Cultural Preservation Awards**

#### Next.js Frontend

```bash### Unique Selling Points

cd frontend1. **Novel swap mechanic** - First platform to use story-for-story exchange

npm install2. **Cultural preservation focus** - Capturing disappearing local knowledge

npm run dev3. **Gamification elements** - Making cultural exploration engaging

```4. **Accessibility compliance** - WCAG 2.1 AA standards

5. **Scalable architecture** - Ready for national deployment

## 🏆 National Competition Ready

## 🤝 Contributing

This project is specifically designed for:

- **Smart India Hackathon**### Using Lovable

- **National Innovation Challenges**Simply visit the [Lovable Project](https://lovable.dev/projects/a5b69a92-36ac-43d8-8867-2041de8b406e) and start prompting for frontend changes.

- **Tourism Technology Competitions**

- **Cultural Preservation Awards**### Local Development

1. Fork the repository

### Unique Selling Points2. Create a feature branch

1. **Novel swap mechanic** - First platform to use story-for-story exchange3. Make your changes

2. **Cultural preservation focus** - Capturing disappearing local knowledge4. Add tests for new functionality

3. **Gamification elements** - Making cultural exploration engaging5. Submit a pull request

4. **Accessibility compliance** - WCAG 2.1 AA standards

5. **Scalable architecture** - Ready for national deployment## 📄 License



## 🤝 ContributingThis project is licensed under the MIT License.



1. Fork the repository## 🆘 Support

2. Create a feature branch

3. Make your changes- **Issues**: GitHub Issues

4. Add tests for new functionality- **Discussions**: GitHub Discussions

5. Submit a pull request- **Documentation**: Check the `/docs` folder



## 📄 License---



This project is licensed under the MIT License.**Built with ❤️ for preserving local stories and connecting communities**



## 🆘 Support*Ready to revolutionize how we discover and share the stories that make our cities unique.*

```

- **Issues**: GitHub Issues

- **Discussions**: GitHub Discussions**Edit a file directly in GitHub**

- **Documentation**: Check the `PROJECT_STRUCTURE.md` file

- Navigate to the desired file(s).

---- Click the "Edit" button (pencil icon) at the top right of the file view.

- Make your changes and commit the changes.

**Built with ❤️ for preserving local stories and connecting communities**

**Use GitHub Codespaces**

*Ready to revolutionize how we discover and share the stories that make our cities unique.*
- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a5b69a92-36ac-43d8-8867-2041de8b406e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
>>>>>>> ef2fea20f35be1fda615da9e83a6fe1f265a6518

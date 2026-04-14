# LocaleLens

<div align="center">

**A location-aware travel storytelling platform for discovering authentic stories, planning trips, and exploring places through community narratives.**

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=white)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](./backend)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](./backend/models)
[![Maps](https://img.shields.io/badge/Maps-MapTiler-1F6FEB?style=for-the-badge)](./docs/MAPTILER_SETUP.md)
[![API Docs](https://img.shields.io/badge/API-Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](./backend/config/swagger.js)

</div>

---

## Overview

LocaleLens is a full-stack travel platform where users can:

- publish location-linked travel stories
- browse stories in a discovery feed
- explore stories on an interactive map
- like, manage, and update their own submissions
- generate mood-based trip ideas with the AI travel planner
- analyze story emotion to drive travel suggestions
- unlock content through a story swap mechanism
- access admin analytics and moderation-oriented tooling

The repository currently contains both `LocaleLens` and older `Tourogram` naming in parts of the codebase and docs. This README documents the current implementation as it exists in the repo today.

## Why It Exists

Most travel content is either generic, over-produced, or detached from place. LocaleLens is built around a different model:

- stories are tied to real locations
- discovery is map-aware, not just feed-based
- community value comes from local context and firsthand experience
- planning features try to turn reading into action

## Core Functionality

### Storytelling and discovery

- Create travel stories with title, text, tags, and optional image media
- Associate each story with a place and address metadata
- Browse published stories with search and tag filters
- View story cards with engagement metrics and media previews
- Open a map view of story locations and inspect markers visually

### User experience

- Register and log in from the frontend
- Persist session state in the client
- Manage profile-related story activity through protected routes
- Edit or delete your own stories
- View personal story collections via `My Stories`

### AI-assisted travel planning

- Generate trip plans from mood and travel intent
- Save generated plans to user state and backend storage
- Share plans through native share or clipboard fallback
- Use AgentX chat as a conversational planning assistant
- Run lightweight emotion analysis on story text for suggestion generation

### Platform mechanics

- Swap-based story unlock API
- Trending story retrieval
- Analytics-oriented story scoring and engagement tracking
- Admin endpoints for analytics, user management, and moderation queues
- Swagger/OpenAPI documentation for the backend API

## Product Flow

```text
Read stories -> Explore on map -> Sign in -> Share your own story
       |                                   |
       v                                   v
 Discover places                    Generate trip plans
       |                                   |
       v                                   v
 Unlock deeper content via swaps    Save or share itineraries
```

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 18 + TypeScript + Vite | SPA, routing, fast local development |
| UI | Tailwind CSS + Radix UI + Lucide | Design system primitives and styling |
| Data fetching | TanStack React Query | Client-side request orchestration |
| Forms | React Hook Form + Zod | Form handling and validation utilities |
| Maps | MapTiler SDK, Google Maps wrapper utilities | Geospatial visualization |
| Motion | Framer Motion | UI transitions and interaction polish |
| Backend | Node.js + Express | REST API and app server |
| Database | MongoDB + Mongoose | Users, stories, tags, locations, trip plans, swaps |
| Auth | JWT + Passport + bcrypt/bcryptjs | Authentication and password handling |
| Security | Helmet, CORS, rate-limit, slow-down | Basic API hardening |
| API docs | Swagger JSDoc + Swagger UI | Interactive API reference |
| Media/processing | Multer, Sharp, FFmpeg | Upload and media-processing support |
| Testing | Jest + Supertest | Backend route and API testing |

## Architecture

### Frontend

The frontend lives in [`frontend`](./frontend) and is a Vite-based React app with protected routing and a component-driven UI layer.

Notable frontend areas:

- [`frontend/src/App.tsx`](./frontend/src/App.tsx) sets up routing, providers, and protected pages
- [`frontend/src/lib/api.ts`](./frontend/src/lib/api.ts) centralizes API access and smart API base URL detection
- [`frontend/src/contexts/AuthContext.tsx`](./frontend/src/contexts/AuthContext.tsx) manages client auth/session state and planner context
- [`frontend/src/pages`](./frontend/src/pages) contains user-facing screens such as `Explore`, `SubmitStory`, `MapView`, and `TravelPlanner`

### Backend

The backend lives in [`backend`](./backend) and exposes a versioned REST API under `/api/v1`.

Notable backend areas:

- [`backend/server.js`](./backend/server.js) initializes middleware, security, docs, health checks, and route mounting
- [`backend/routes`](./backend/routes) defines route modules for auth, stories, travel, swaps, admin, media, moderation, and AgentX
- [`backend/models`](./backend/models) defines MongoDB models such as `User`, `Story`, `TripPlan`, `Location`, `Tag`, and `Swap`
- [`backend/config/swagger.js`](./backend/config/swagger.js) generates OpenAPI docs

## Repository Structure

```text
LocaleLens/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── server.js
│   └── package.json
├── docs/
└── README.md
```

## Key Routes and Screens

### Frontend pages

| Route | Purpose |
| --- | --- |
| `/` | Landing/index page |
| `/login` | Login screen |
| `/register` | Registration screen |
| `/explore` | Story discovery feed with filters and map toggle |
| `/submit` | Story creation flow |
| `/my-stories` | User story management |
| `/edit-story/:storyId` | Story editing |
| `/map` | Dedicated map-based exploration |
| `/plan` | AI travel planner |
| `/profile` | User profile |

### Backend endpoints

| Endpoint group | Purpose |
| --- | --- |
| `/api/v1/auth` | Authentication |
| `/api/v1/users` | User profile and account operations |
| `/api/v1/stories` | Story CRUD, likes, trending |
| `/api/v1/swaps` | Story unlock / swap flows |
| `/api/v1/travel` | Trip planning and emotion analysis |
| `/api/v1/media` | Media upload related routes |
| `/api/v1/admin` | Analytics, moderation, user management |
| `/api/v1/agentx` | Conversational trip assistant stub |
| `/health` | Server health check |
| `/api/docs` | Swagger UI |

## Data Model Highlights

### Story

Stories include:

- rich content types: `text`, `audio`, `photo`, `video`, `mixed`
- media metadata
- location reference
- tags
- visibility and publication state
- swap requirements and lock state
- moderation flags
- engagement counters
- popularity and trending analytics

### User

Users include:

- authentication credentials
- profile metadata
- role-based access: `user`, `moderator`, `admin`
- notification/privacy preferences
- story and engagement stats
- ban and activity flags

### TripPlan

Trip plans include:

- destination
- itinerary array
- vibe and quote
- duration and season
- emotional tone
- saved planning context
- generation source and status

## Local Development

### Prerequisites

- Node.js 18+
- npm
- MongoDB instance or MongoDB Atlas connection
- MapTiler API key for map features

### 1. Install dependencies

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 2. Configure environment variables

Create a frontend `.env` in `frontend/`:

```bash
VITE_API_URL=http://localhost:3001
VITE_MAPTILER_API_KEY=your_maptiler_key
VITE_AGENTX_KEY=optional_agentx_key
VITE_APP_NAME=LocaleLens
VITE_APP_VERSION=1.0.0
```

Create a backend `.env` in `backend/`:

```bash
NODE_ENV=development
PORT=3001
HOST=0.0.0.0
API_VERSION=v1
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_real_secret
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Run the apps

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Default local URLs:

- frontend: `http://localhost:8080`
- backend: `http://localhost:3001`
- API docs: `http://localhost:3001/api/docs`

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run build:dev
npm run lint
npm run preview
npm run health
```

### Backend

```bash
npm run start
npm run dev
npm run test
npm run test:watch
npm run docs
```

## Testing

Backend tests are set up with Jest and Supertest. Current tests include travel-planner and emotion-analysis coverage.

Run:

```bash
cd backend
npm test
```

## Notable Implementation Details

### Smart API base URL handling

The frontend API client auto-selects the API host based on the current hostname. It supports:

- localhost development
- local network IP access
- deployed frontend fallback to a hosted backend URL

### Security middleware

The backend includes:

- Helmet
- compression
- global CORS handling
- rate limiting
- slow-down middleware
- centralized error handling

### Swagger documentation

The API documentation is generated directly from route annotations and schema definitions, which makes it easier to inspect story, auth, swap, and admin endpoints during development.

## Known Repository Notes

- The codebase currently mixes `LocaleLens` and `Tourogram` naming.
- Some older docs reference startup scripts that are not present in this repository snapshot.
- Frontend auth currently includes client-side demo session behavior in `AuthContext`, while the backend also exposes JWT-based auth routes.
- Some AI features are stubbed or demo-driven rather than backed by a production inference pipeline.

## Project Value

LocaleLens is interesting because it combines several patterns in one product:

- location-first content discovery
- creator-style storytelling
- gated community exchange via swaps
- AI-assisted travel planning
- operational admin visibility through analytics and moderation routes

That makes it more than a simple travel blog or map viewer. It is structured as a community product with exploration, contribution, planning, and platform controls built into the same stack.

## Documentation References

- [`docs/MAPTILER_SETUP.md`](./docs/MAPTILER_SETUP.md)
- [`docs/STARTUP-GUIDE.md`](./docs/STARTUP-GUIDE.md)
- [`RENDER_DEPLOYMENT.md`](./RENDER_DEPLOYMENT.md)
- [`CORS_DEPLOYMENT_URGENT.md`](./CORS_DEPLOYMENT_URGENT.md)

## License

MIT

# Story Swap - Reorganized Project Structure

This project has been reorganized to better separate concerns and improve maintainability.

## Project Structure

```
story-swap-local/
├── backend/                 # Express.js API server
│   ├── config/             # Server configurations
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
├── database/               # Database layer (MongoDB/Mongoose)
│   ├── models/             # Mongoose data models
│   ├── scripts/            # Database migration scripts
│   ├── seedDatabase.js     # Database seeding script
│   ├── verifyData.js       # Data verification script
│   └── database.js         # Database connection configuration
├── frontend/               # Frontend applications
│   ├── (Next.js app)/      # Existing Next.js frontend
│   └── vite-frontend/      # Vite/React frontend
│       ├── src/            # React components and pages
│       ├── public/         # Static assets
│       ├── index.html      # Main HTML template
│       ├── vite.config.ts  # Vite configuration
│       └── package.json    # Frontend dependencies
└── docs/                   # Project documentation
```

## Key Changes Made

1. **Frontend Consolidation**: All Vite/React frontend files moved to `frontend/vite-frontend/`
2. **Database Separation**: Created dedicated `database/` folder for all database-related files
3. **Import Path Updates**: Updated all import paths to reflect the new structure
4. **Configuration Updates**: Updated all configuration files for the new structure

## Running the Applications

### Backend API Server
```bash
cd backend
npm install
npm start
```

### Database Operations
```bash
cd database
npm install
npm run seed    # Seed the database
npm run verify  # Verify data integrity
```

### Vite Frontend
```bash
cd frontend/vite-frontend
npm install
npm run dev
```

### Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```

## Development Notes

- The backend now references database models from `../../database/models/`
- Database configuration is centralized in the `database/` folder
- Both frontend applications are organized under the `frontend/` directory
- All original functionality has been preserved with updated import paths
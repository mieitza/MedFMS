# MedFMS - Fleet Management System

A comprehensive vehicle fleet management system built with SvelteKit frontend and Node.js/Express backend.

## Technology Stack

### Backend
- **Framework**: Node.js with Express
- **Database**: SQLite with Drizzle ORM
- **Authentication**: JWT with PIN-based login
- **Language**: TypeScript

### Frontend
- **Framework**: SvelteKit
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MedFMS
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Seed the database (optional):
```bash
npm run db:seed
```

### Development

Start both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Backend API server on http://localhost:3000
- Frontend development server on http://localhost:5173

### Individual Services

Run backend only:
```bash
npm run dev:backend
```

Run frontend only:
```bash
npm run dev:frontend
```

### Building for Production

Build both applications:
```bash
npm run build
```

Start production server:
```bash
npm run start
```

## Project Structure

```
MedFMS/
├── app/
│   ├── backend/              # Express.js backend
│   │   ├── src/
│   │   │   ├── db/           # Database schema and migrations
│   │   │   ├── routes/       # API routes
│   │   │   ├── middleware/   # Express middleware
│   │   │   └── utils/        # Utility functions
│   │   └── package.json
│   └── frontend/             # SvelteKit frontend
│       ├── src/
│       │   ├── routes/       # SvelteKit pages
│       │   └── lib/          # Shared components and utilities
│       └── package.json
├── .env.example              # Environment variables template
├── package.json              # Root package.json with workspaces
└── README.md
```

## Features

### Core Modules

- **Authentication**: PIN-based authentication with JWT
- **Vehicle Management**: Complete vehicle lifecycle management
- **Driver Management**: Driver information and license tracking
- **Fuel Management**: Fuel consumption and cost tracking
- **Material Management**: Inventory and warehouse management
- **Service Management**: Maintenance scheduling and tracking

### API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/vehicles` - List vehicles
- `GET /api/drivers` - List drivers
- `GET /api/fuel/transactions` - Fuel transactions
- `GET /api/materials` - Material inventory

## Default Login

After seeding the database, you can login with:
- **Username**: admin
- **PIN**: 1234

## Scripts

### Root Level
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both applications
- `npm run start` - Start production server
- `npm run lint` - Lint all workspaces
- `npm run format` - Format code with Prettier
- `npm run clean` - Clean build artifacts
- `npm run reset` - Full reset and reinstall

### Database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:status` - Check migration status

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `NODE_ENV` - Environment (development/production)
- `SERVER_PORT` - Backend server port (default: 3000)
- `DATABASE_PATH` - SQLite database file path
- `JWT_SECRET` - JWT signing secret

## License

All rights reserved.
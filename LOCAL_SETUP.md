# 🏠 Local Development Setup

This guide will help you set up the Sweet Shop Manager project for local development.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PNPM** (v8 or higher) - Install with: `npm install -g pnpm`
- **PostgreSQL** (v13 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/ManojSaroj/Sweet-Shop-Manager-.git
cd Sweet-Shop-Manager-

# Install all dependencies (root, API, Web, and Shared packages)
pnpm install

# Build shared package first
pnpm --filter shared build
```

### 2. Database Setup

```bash
# Start PostgreSQL service (macOS with Homebrew)
brew services start postgresql

# Or start PostgreSQL service (Ubuntu/Debian)
sudo service postgresql start

# Create database
createdb sweetshop_dev

# Or using psql
psql -U postgres -c "CREATE DATABASE sweetshop_dev;"
```

### 3. Environment Configuration

#### Backend Environment (apps/api/.env)
```bash
# Copy example environment file
cp apps/api/env.example apps/api/.env

# Edit the .env file with your database credentials
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sweetshop_dev?schema=public"
# JWT_ACCESS_SECRET="your-super-secret-access-key-change-in-production"
# JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"
# PORT=4000
# NODE_ENV=development
```

#### Frontend Environment (apps/web/.env)
```bash
# Copy example environment file
cp apps/web/env.example apps/web/.env

# Edit the .env file
# VITE_API_URL=http://localhost:4000
```

### 4. Database Migration and Seeding

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Seed the database with sample data
pnpm prisma:seed

# Return to root directory
cd ../..
```

### 5. Start Development Servers

#### Option A: Start All Services (Recommended)
```bash
# Start all services concurrently
pnpm dev
```

#### Option B: Start Services Separately
```bash
# Terminal 1: Start Backend API
cd apps/api
pnpm dev

# Terminal 2: Start Frontend Web
cd apps/web
pnpm dev
```

## 🔧 Development Commands

### Root Level Commands
```bash
# Install dependencies
pnpm install

# Start all services
pnpm dev

# Build all packages
pnpm build

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean
```

### Backend API Commands (apps/api)
```bash
cd apps/api

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Database operations
pnpm prisma:generate    # Generate Prisma client
pnpm prisma:migrate     # Run migrations
pnpm prisma:reset       # Reset database
pnpm prisma:seed        # Seed database
pnpm seed               # Full seed process
```

### Frontend Web Commands (apps/web)
```bash
cd apps/web

# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Lint code
pnpm lint
```

### Shared Package Commands (packages/shared)
```bash
cd packages/shared

# Build package
pnpm build

# Watch mode
pnpm dev
```

## 🗄️ Database Management

### Reset Database
```bash
cd apps/api
pnpm prisma:reset
```

### View Database in Prisma Studio
```bash
cd apps/api
pnpm prisma studio
```

### Manual Database Operations
```bash
# Connect to database
psql -U postgres -d sweetshop_dev

# List tables
\dt

# View users table
SELECT * FROM users;

# View sweets table
SELECT * FROM sweets;

# Exit psql
\q
```

## 🧪 Testing

### Run All Tests
```bash
# From root directory
pnpm test
```

### Backend Testing
```bash
cd apps/api

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test --coverage
```

### Frontend Testing
```bash
cd apps/web

# Unit tests
pnpm test

# Test with UI
pnpm test:ui

# Test coverage
pnpm test --coverage
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql

# Check database exists
psql -U postgres -l | grep sweetshop_dev
```

#### 2. Port Already in Use
```bash
# Kill process on port 4000 (API)
lsof -ti:4000 | xargs kill -9

# Kill process on port 5173 (Web)
lsof -ti:5173 | xargs kill -9
```

#### 3. PNPM Issues
```bash
# Clear PNPM cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

#### 4. Prisma Issues
```bash
cd apps/api

# Regenerate Prisma client
pnpm prisma:generate

# Reset database
pnpm prisma:reset

# Run migrations
pnpm prisma:migrate
```

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sweetshop_dev?schema=public"

# JWT Secrets (change in production)
JWT_ACCESS_SECRET="your-super-secret-access-key-change-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-in-production"

# Server
PORT=4000
NODE_ENV=development
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:4000
```

## 📱 Access Points

Once everything is running:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api/docs
- **Database Studio**: http://localhost:5555 (after running `pnpm prisma studio`)

## 🔐 Demo Credentials

The seeded database includes demo users:

- **Regular User**: `user@example.com` / `password123`
- **Admin User**: `admin@example.com` / `admin123`

## 📁 Project Structure

```
Sweet-Shop-Manager-/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   ├── prisma/
│   │   └── package.json
│   └── web/                 # React Frontend
│       ├── src/
│       └── package.json
├── packages/
│   └── shared/              # Shared Types & Schemas
│       ├── src/
│       └── package.json
├── package.json             # Root package.json
└── pnpm-workspace.yaml      # PNPM workspace config
```

## 🚀 Next Steps

1. **Explore the API**: Visit http://localhost:4000/api/docs
2. **Test the Frontend**: Visit http://localhost:5173
3. **Run Tests**: Execute `pnpm test` to verify everything works
4. **Make Changes**: Start developing your features!

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PNPM Documentation](https://pnpm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Happy Coding! 🎉**


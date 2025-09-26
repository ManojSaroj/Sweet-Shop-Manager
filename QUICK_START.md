# ⚡ Quick Start Guide

Get the Sweet Shop Manager running locally in under 5 minutes!

## 🚀 One-Command Setup

```bash
# Clone and setup everything automatically
git clone https://github.com/ManojSaroj/Sweet-Shop-Manager-.git
cd Sweet-Shop-Manager-
./setup-local.sh
```

## 📋 Prerequisites (One-time setup)

Before running the setup script, ensure you have:

1. **Node.js** (v18+): [Download](https://nodejs.org/)
2. **PNPM**: `npm install -g pnpm`
3. **PostgreSQL** (v13+): [Download](https://www.postgresql.org/download/)

## 🔧 Manual Setup (Alternative)

If you prefer manual setup:

```bash
# 1. Install dependencies
pnpm install

# 2. Build shared package
pnpm --filter shared build

# 3. Setup environment files
cp apps/api/env.example apps/api/.env
cp apps/web/env.example apps/web/.env

# 4. Start PostgreSQL and create database
createdb sweetshop_dev

# 5. Setup database schema
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
cd ../..

# 6. Start development servers
pnpm dev
```

## 🎯 Access Points

Once running:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs

## 🔐 Demo Login

- **User**: `user@example.com` / `password123`
- **Admin**: `admin@example.com` / `admin123`

## 📚 Full Documentation

For detailed setup instructions, troubleshooting, and development commands, see [LOCAL_SETUP.md](./LOCAL_SETUP.md).

---

**That's it! You're ready to start developing! 🎉**


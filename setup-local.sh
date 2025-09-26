#!/bin/bash

# Sweet Shop Manager - Local Setup Script
# This script automates the local development setup process

set -e  # Exit on any error

echo "🏪 Sweet Shop Manager - Local Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v18 or higher."
        exit 1
    fi
    
    # Check PNPM
    if ! command -v pnpm &> /dev/null; then
        print_warning "PNPM is not installed. Installing PNPM..."
        npm install -g pnpm
    fi
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL is not installed. Please install PostgreSQL v13 or higher."
        exit 1
    fi
    
    print_success "All prerequisites are installed!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    pnpm install
    print_success "Dependencies installed successfully!"
}

# Build shared package
build_shared() {
    print_status "Building shared package..."
    pnpm --filter shared build
    print_success "Shared package built successfully!"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "apps/api/.env" ]; then
        cp apps/api/env.example apps/api/.env
        print_success "Created apps/api/.env from example"
    else
        print_warning "apps/api/.env already exists, skipping..."
    fi
    
    # Frontend environment
    if [ ! -f "apps/web/.env" ]; then
        cp apps/web/env.example apps/web/.env
        print_success "Created apps/web/.env from example"
    else
        print_warning "apps/web/.env already exists, skipping..."
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL is running
    if ! pg_isready -q; then
        print_warning "PostgreSQL is not running. Please start PostgreSQL and run this script again."
        print_status "To start PostgreSQL:"
        print_status "  macOS: brew services start postgresql"
        print_status "  Ubuntu/Debian: sudo service postgresql start"
        exit 1
    fi
    
    # Create database if it doesn't exist
    if ! psql -lqt | cut -d \| -f 1 | grep -qw sweetshop_dev; then
        print_status "Creating database 'sweetshop_dev'..."
        createdb sweetshop_dev
        print_success "Database created successfully!"
    else
        print_warning "Database 'sweetshop_dev' already exists, skipping..."
    fi
}

# Run database migrations and seeding
setup_database_schema() {
    print_status "Setting up database schema..."
    
    cd apps/api
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    pnpm prisma:generate
    
    # Run migrations
    print_status "Running database migrations..."
    pnpm prisma:migrate
    
    # Seed database
    print_status "Seeding database with sample data..."
    pnpm prisma:seed
    
    cd ../..
    print_success "Database schema setup completed!"
}

# Main setup function
main() {
    echo
    print_status "Starting local setup process..."
    echo
    
    check_prerequisites
    install_dependencies
    build_shared
    setup_environment
    setup_database
    setup_database_schema
    
    echo
    print_success "🎉 Local setup completed successfully!"
    echo
    print_status "Next steps:"
    print_status "1. Start the development servers: pnpm dev"
    print_status "2. Open http://localhost:5173 for the frontend"
    print_status "3. Open http://localhost:4000/api/docs for API documentation"
    print_status "4. Use demo credentials: user@example.com / password123"
    echo
    print_status "Happy coding! 🚀"
}

# Run main function
main "$@"

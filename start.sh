#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[i]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to kill process on port
kill_port() {
    if port_in_use $1; then
        print_info "Port $1 is in use. Killing process..."
        lsof -ti:$1 | xargs kill -9 2>/dev/null
        sleep 1
    fi
}

# Main script
echo "🚀 Starting YouTube Sponsorship Workflow Application"
echo "=================================================="

# Check prerequisites
print_info "Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js and npm are installed"

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

# Kill processes on required ports
print_info "Checking ports..."
kill_port 3000
kill_port 3001

# Setup frontend
print_info "Setting up frontend..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        print_status "Created .env.local from example"
    else
        echo 'NEXT_PUBLIC_API_URL="http://localhost:3001"' > .env.local
        print_status "Created .env.local with default values"
    fi
else
    print_status ".env.local already exists"
fi

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    print_status "Frontend dependencies installed"
else
    print_status "Frontend dependencies already installed"
fi

# Setup backend
cd backend || exit 1

print_info "Setting up backend..."

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status "Created backend .env from example"
    else
        cat > .env << EOL
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-here-change-in-production"
FRONTEND_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"
ENCRYPTION_KEY="your-encryption-key-here-change-in-production"
EOL
        print_status "Created backend .env with default values"
    fi
else
    print_status "Backend .env already exists"
fi

# Install backend dependencies
if [ ! -d "node_modules" ]; then
    print_info "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    print_status "Backend dependencies installed"
else
    print_status "Backend dependencies already installed"
fi

# Generate Prisma client
print_info "Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    print_error "Failed to generate Prisma client"
    exit 1
fi
print_status "Prisma client generated"

# Run database migrations
print_info "Running database migrations..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    print_error "Failed to run database migrations"
    exit 1
fi
print_status "Database migrations completed"

# Seed the database
print_info "Seeding database with demo user..."
npx prisma db seed
if [ $? -ne 0 ]; then
    print_error "Failed to seed database"
    exit 1
fi
print_status "Database seeded successfully"

# Go back to root directory
cd ..

# Function to cleanup on exit
cleanup() {
    print_info "Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start backend
print_info "Starting backend server..."
cd backend
npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
print_info "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        print_status "Backend is running on http://localhost:3001"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Backend failed to start. Check backend.log for details"
        exit 1
    fi
    sleep 1
done

# Start frontend
print_info "Starting frontend server..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
print_info "Waiting for frontend to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_status "Frontend is running on http://localhost:3000"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Frontend failed to start. Check frontend.log for details"
        exit 1
    fi
    sleep 1
done

echo ""
echo "=================================================="
print_status "Application started successfully! 🎉"
echo ""
echo "📌 Access the application at: http://localhost:3000"
echo "📌 Backend API running at: http://localhost:3001"
echo ""
echo "🔐 Login credentials:"
echo "   Email: demo@example.com"
echo "   Password: demo123"
echo ""
echo "📝 Logs:"
echo "   Frontend: ./frontend.log"
echo "   Backend: ./backend.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=================================================="

# Keep the script running
wait
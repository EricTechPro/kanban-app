@echo off
setlocal enabledelayedexpansion

:: Colors are limited in Windows batch, so we'll use simple text
echo ========================================
echo Starting YouTube Sponsorship Workflow Application
echo ========================================

:: Check prerequisites
echo [i] Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [X] npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo [OK] Node.js and npm are installed

:: Check Node version
for /f "tokens=2 delims=v" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=1 delims=." %%i in ("%NODE_VERSION%") do set NODE_MAJOR=%%i
if %NODE_MAJOR% lss 18 (
    echo [X] Node.js version must be 18 or higher. Current version: %NODE_VERSION%
    pause
    exit /b 1
)

:: Kill processes on required ports
echo [i] Checking ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo [i] Killing process on port 3000...
    taskkill /F /PID %%a >nul 2>nul
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do (
    echo [i] Killing process on port 3001...
    taskkill /F /PID %%a >nul 2>nul
)

:: Setup frontend
echo [i] Setting up frontend...
if not exist ".env.local" (
    if exist ".env.local.example" (
        copy .env.local.example .env.local >nul
        echo [OK] Created .env.local from example
    ) else (
        echo NEXT_PUBLIC_API_URL="http://localhost:3001" > .env.local
        echo [OK] Created .env.local with default values
    )
) else (
    echo [OK] .env.local already exists
)

:: Install frontend dependencies
if not exist "node_modules" (
    echo [i] Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [X] Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

:: Setup backend
cd backend
if %errorlevel% neq 0 (
    echo [X] Backend directory not found
    pause
    exit /b 1
)

echo [i] Setting up backend...

:: Create .env file if it doesn't exist
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] Created backend .env from example
    ) else (
        (
            echo DATABASE_URL="file:./dev.db"
            echo JWT_SECRET="your-jwt-secret-here-change-in-production"
            echo FRONTEND_URL="http://localhost:3000"
            echo GOOGLE_CLIENT_ID=""
            echo GOOGLE_CLIENT_SECRET=""
            echo GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"
            echo ENCRYPTION_KEY="your-encryption-key-here-change-in-production"
        ) > .env
        echo [OK] Created backend .env with default values
    )
) else (
    echo [OK] Backend .env already exists
)

:: Install backend dependencies
if not exist "node_modules" (
    echo [i] Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [X] Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed
) else (
    echo [OK] Backend dependencies already installed
)

:: Generate Prisma client
echo [i] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [X] Failed to generate Prisma client
    pause
    exit /b 1
)
echo [OK] Prisma client generated

:: Run database migrations
echo [i] Running database migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo [X] Failed to run database migrations
    pause
    exit /b 1
)
echo [OK] Database migrations completed

:: Seed the database
echo [i] Seeding database with demo user...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo [X] Failed to seed database
    pause
    exit /b 1
)
echo [OK] Database seeded successfully

:: Go back to root directory
cd ..

:: Start backend
echo [i] Starting backend server...
cd backend
start /B cmd /c "npm run start:dev > ../backend.log 2>&1"
cd ..

:: Wait for backend to start
echo [i] Waiting for backend to start...
timeout /t 5 /nobreak >nul

:: Start frontend
echo [i] Starting frontend server...
start /B cmd /c "npm run dev > frontend.log 2>&1"

:: Wait for frontend to start
echo [i] Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo [OK] Application started successfully!
echo.
echo Access the application at: http://localhost:3000
echo Backend API running at: http://localhost:3001
echo.
echo Login credentials:
echo    Email: demo@example.com
echo    Password: demo1234
echo.
echo Logs:
echo    Frontend: ./frontend.log
echo    Backend: ./backend.log
echo.
echo Press Ctrl+C to stop all services
echo ========================================
echo.
echo Access the application at: http://localhost:3000
echo Backend API running at: http://localhost:3001
echo.
echo Login credentials:
echo    Email: demo@example.com
echo    Password: demo123
echo.
echo Logs:
echo    Frontend: ./frontend.log
echo    Backend: ./backend.log
echo.
echo Press Ctrl+C to stop all services
echo ========================================
echo.

:: Keep the window open
pause >nul
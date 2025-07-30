# Application Startup Guide

This guide explains how to start the YouTube Sponsorship Workflow application using the provided startup scripts.

## 🚀 Quick Start

We provide three different ways to start the application, all of which handle the complete setup automatically:

### Option 1: Universal Node.js Script (Recommended)

This works on all operating systems (Windows, macOS, Linux):

```bash
npm run start:all
```

### Option 2: Platform-Specific Scripts

#### macOS/Linux:

```bash
./start.sh
# or
npm run start:unix
```

#### Windows:

```bash
start.bat
# or
npm run start:windows
```

## 📋 What the Scripts Do

All startup scripts perform the following steps automatically:

1. **Prerequisites Check**

   - Verifies Node.js 18+ is installed
   - Verifies npm is installed

2. **Port Management**

   - Checks if ports 3000 and 3001 are in use
   - Kills any processes using these ports

3. **Frontend Setup**

   - Creates `.env.local` from example (if needed)
   - Installs frontend dependencies
   - Configures API endpoint

4. **Backend Setup**

   - Creates `.env` from example (if needed)
   - Installs backend dependencies
   - Generates Prisma client
   - Runs database migrations
   - Seeds database with demo user

5. **Service Launch**
   - Starts backend server on port 3001
   - Starts frontend server on port 3000
   - Displays login credentials
   - Shows access URLs

## 🔐 Demo Account

The scripts automatically create a demo user account:

- **Email**: `demo@example.com`
- **Password**: `demo123`

## 📝 Script Details

### `start.js` (Cross-platform Node.js)

- Written in Node.js for maximum compatibility
- Works on Windows, macOS, and Linux
- Shows colored output for better readability
- Handles process cleanup on exit

### `start.sh` (Unix/Linux/macOS)

- Bash script for Unix-like systems
- Includes colored output and status indicators
- Creates log files for debugging
- Robust error handling

### `start.bat` (Windows)

- Batch script for Windows systems
- Compatible with Command Prompt and PowerShell
- Simple status messages
- Keeps window open for monitoring

## 🛠️ Troubleshooting

### Port Already in Use

The scripts automatically kill processes on ports 3000 and 3001. If issues persist:

- Manually check: `lsof -i :3000` (macOS/Linux) or `netstat -ano | findstr :3000` (Windows)
- Kill the process manually if needed

### Dependencies Installation Failed

- Ensure you have a stable internet connection
- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` folders and try again

### Database Issues

- The scripts use SQLite, which requires no additional setup
- If migrations fail, delete `backend/prisma/dev.db` and try again
- Check `backend/prisma/migrations` folder for migration files

### Scripts Not Executing

- **Unix/macOS**: Ensure script is executable: `chmod +x start.sh`
- **Windows**: Run as administrator if permission issues occur
- **All platforms**: Use `npm run start:all` as fallback

## 📂 Generated Files

The scripts create several files during setup:

- `.env.local` - Frontend environment configuration
- `backend/.env` - Backend environment configuration
- `backend/prisma/dev.db` - SQLite database file
- `backend/prisma/migrations/` - Database migration history

## 🔄 Restarting the Application

After the initial setup, you can use the same scripts to restart the application. They will:

- Skip dependency installation if already installed
- Skip database setup if already configured
- Just start the services

## 📊 Monitoring

While running, you can:

- View frontend at: http://localhost:3000
- View backend API at: http://localhost:3001
- Check Swagger docs at: http://localhost:3001/api-docs
- Monitor console output for both services

## 🛑 Stopping the Application

To stop all services:

- Press `Ctrl+C` in the terminal where the script is running
- The script will cleanly shut down both frontend and backend services

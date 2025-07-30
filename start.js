#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Helper functions
const log = {
  success: (msg) => console.log(`${colors.green}[✓]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[✗]${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.yellow}[i]${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}\n${'='.repeat(50)}`)
};

// Check if command exists
const commandExists = (cmd) => {
  return new Promise((resolve) => {
    const command = process.platform === 'win32' ? `where ${cmd}` : `which ${cmd}`;
    exec(command, (error) => {
      resolve(!error);
    });
  });
};

// Kill process on port
const killPort = (port) => {
  return new Promise((resolve) => {
    const command = process.platform === 'win32'
      ? `for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port} ^| findstr LISTENING') do taskkill /F /PID %a`
      : `lsof -ti:${port} | xargs kill -9 2>/dev/null || true`;

    exec(command, () => {
      resolve();
    });
  });
};

// Execute command and return promise
const execCommand = (command, cwd = '.') => {
  return new Promise((resolve, reject) => {
    log.info(`Running: ${command}`);
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

// Copy file if source exists
const copyFileIfExists = (source, dest) => {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    return true;
  }
  return false;
};

// Main startup function
async function startApp() {
  log.header('🚀 Starting YouTube Sponsorship Workflow Application');

  try {
    // Check prerequisites
    log.info('Checking prerequisites...');

    if (!await commandExists('node')) {
      log.error('Node.js is not installed. Please install Node.js 18+ first.');
      process.exit(1);
    }

    if (!await commandExists('npm')) {
      log.error('npm is not installed. Please install npm first.');
      process.exit(1);
    }

    log.success('Node.js and npm are installed');

    // Check Node version
    const nodeVersion = process.version.match(/^v(\d+)/)[1];
    if (parseInt(nodeVersion) < 18) {
      log.error(`Node.js version must be 18 or higher. Current version: ${process.version}`);
      process.exit(1);
    }

    // Kill processes on required ports
    log.info('Checking ports...');
    await killPort(3000);
    await killPort(3001);

    // Setup frontend
    log.info('Setting up frontend...');

    if (!fs.existsSync('.env.local')) {
      if (copyFileIfExists('.env.local.example', '.env.local')) {
        log.success('Created .env.local from example');
      } else {
        fs.writeFileSync('.env.local', 'NEXT_PUBLIC_API_URL="http://localhost:3001"');
        log.success('Created .env.local with default values');
      }
    } else {
      log.success('.env.local already exists');
    }

    // Install frontend dependencies
    if (!fs.existsSync('node_modules')) {
      log.info('Installing frontend dependencies...');
      await execCommand('npm install');
      log.success('Frontend dependencies installed');
    } else {
      log.success('Frontend dependencies already installed');
    }

    // Setup backend
    const backendPath = path.join(process.cwd(), 'backend');

    log.info('Setting up backend...');

    // Create backend .env if it doesn't exist
    const backendEnvPath = path.join(backendPath, '.env');
    if (!fs.existsSync(backendEnvPath)) {
      const backendEnvExample = path.join(backendPath, '.env.example');
      if (fs.existsSync(backendEnvExample)) {
        fs.copyFileSync(backendEnvExample, backendEnvPath);
        log.success('Created backend .env from example');
      } else {
        const envContent = `DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-here-change-in-production"
FRONTEND_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"
ENCRYPTION_KEY="your-encryption-key-here-change-in-production"`;
        fs.writeFileSync(backendEnvPath, envContent);
        log.success('Created backend .env with default values');
      }
    } else {
      log.success('Backend .env already exists');
    }

    // Install backend dependencies
    if (!fs.existsSync(path.join(backendPath, 'node_modules'))) {
      log.info('Installing backend dependencies...');
      await execCommand('npm install', backendPath);
      log.success('Backend dependencies installed');
    } else {
      log.success('Backend dependencies already installed');
    }

    // Generate Prisma client
    log.info('Generating Prisma client...');
    await execCommand('npx prisma generate', backendPath);
    log.success('Prisma client generated');

    // Run database migrations
    log.info('Running database migrations...');
    try {
      await execCommand('npx prisma migrate dev --name init', backendPath);
      log.success('Database migrations completed');
    } catch (error) {
      // Migration might fail if already applied, that's okay
      log.info('Migrations may already be applied');
    }

    // Seed the database
    log.info('Seeding database with demo user...');
    await execCommand('npx prisma db seed', backendPath);
    log.success('Database seeded successfully');

    // Start backend
    log.info('Starting backend server...');
    const backendProcess = spawn('npm', ['run', 'start:dev'], {
      cwd: backendPath,
      shell: true,
      detached: false,
      env: {
        ...process.env,
        DEMO_PASSWORD: 'demo1234' // Ensure demo password is set
      }
    });

    // Start frontend
    log.info('Starting frontend server...');
    const frontendProcess = spawn('npm', ['run', 'dev'], {
      shell: true,
      detached: false,
      env: {
        ...process.env,
        NEXT_PUBLIC_DEMO_PASSWORD: 'demo1234' // Make password available to frontend
      }
    });

    // Wait a bit for services to start
    await new Promise(resolve => setTimeout(resolve, 5000));

    log.header('✅ Application started successfully!');
    console.log(`
📌 Access the application at: ${colors.blue}http://localhost:3000${colors.reset}
📌 Backend API running at: ${colors.blue}http://localhost:3001${colors.reset}

🔐 Login credentials:
   Email: ${colors.green}demo@example.com${colors.reset}
   Password: ${colors.green}demo123${colors.reset}

📝 Logs are displayed in this terminal

Press ${colors.red}Ctrl+C${colors.reset} to stop all services
${'='.repeat(50)}
`);

    // Handle process termination
    const cleanup = () => {
      log.info('Shutting down services...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    // Pipe output to console
    backendProcess.stdout.on('data', (data) => {
      process.stdout.write(`[Backend] ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
      process.stderr.write(`[Backend] ${data}`);
    });

    frontendProcess.stdout.on('data', (data) => {
      process.stdout.write(`[Frontend] ${data}`);
    });

    frontendProcess.stderr.on('data', (data) => {
      process.stderr.write(`[Frontend] ${data}`);
    });

  } catch (error) {
    log.error(`Failed to start application: ${error.message}`);
    process.exit(1);
  }
}

// Run the startup script
startApp();
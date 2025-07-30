# Setup Guide - YouTube Sponsorship Workflow Kanban Board

This guide will help you set up and run the YouTube Sponsorship Workflow Kanban Board application on your local machine.

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **@dnd-kit** - Drag and drop functionality
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend

- **NestJS** - Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **tRPC** - Type-safe API
- **Passport.js** - Authentication
- **Google APIs** - Gmail integration

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **PostgreSQL** database - [Download here](https://www.postgresql.org/download/)
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd kanban-app
```

### 2. Install Dependencies

#### Frontend Dependencies

```bash
npm install
```

#### Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### 3. Database Setup

#### Install PostgreSQL

**macOS:**

```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**

```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/)

#### Create Database

```bash
# Create database
createdb kanban_gmail

# Or using psql
psql -U postgres
CREATE DATABASE kanban_gmail;
\q
```

### 4. Environment Configuration

#### Backend Environment Variables

The backend already has a `.env` file with template values. Update `backend/.env` with your actual values:

```env
# Database Configuration
# Replace with your actual PostgreSQL credentials
DATABASE_URL="postgresql://username:password@localhost:5432/kanban_gmail?schema=public"

# Google OAuth2 Configuration (Optional - for Gmail integration)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# JWT Configuration
# Generate a secure random string for production
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Frontend URL for CORS
FRONTEND_URL="http://localhost:3000"

# Server Configuration
PORT=3001
```

**Important**: Replace the following values:

- `username:password` - Your PostgreSQL credentials (e.g., `postgres:yourpassword`)
- `your-google-client-id` - Your Google OAuth client ID (if using Gmail integration)
- `your-google-client-secret` - Your Google OAuth client secret
- `your-super-secret-jwt-key-change-this-in-production` - A secure JWT secret

#### Frontend Environment Variables (Optional)

Create `.env.local` file in the root directory if you need custom API endpoints:

```env
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 5. Database Migration

```bash
cd backend
npx prisma generate
npx prisma db push
cd ..
```

### 6. Google OAuth Setup (Optional)

If you want to enable Gmail integration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Add authorized redirect URIs: `http://localhost:3001/auth/google/callback`
7. Copy Client ID and Client Secret to your `backend/.env` file

## 🏃‍♂️ Running the Application

### Development Mode

#### 1. Start Backend Server

```bash
cd backend
npm run start:dev
```

The backend will run on `http://localhost:3001`

#### 2. Start Frontend Server

```bash
# In a new terminal, from the root directory
npm run dev
```

The frontend will run on `http://localhost:3000`

### Production Mode

#### Build and Start Backend

```bash
cd backend
npm run build
npm run start:prod
```

#### Build and Start Frontend

```bash
npm run build
npm start
```

## 📁 Project Structure

```
kanban-app/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (login)
├── backend/               # NestJS backend
│   ├── src/               # Source code
│   │   ├── app.module.ts  # Main app module
│   │   └── main.ts        # Entry point
│   ├── prisma/            # Database schema
│   │   └── schema.prisma  # Prisma schema
│   ├── dist/              # Compiled output
│   └── .env               # Environment variables
├── components/            # React components
├── lib/                   # Utility functions
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔧 Available Scripts

### Frontend Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Backend Scripts

- `npm run start:dev` - Start development server with watch mode
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues

- Ensure PostgreSQL is running: `brew services start postgresql` (macOS) or `sudo service postgresql start` (Linux)
- Check database credentials in `backend/.env`
- Verify database exists: `psql -U postgres -l`
- Test connection: `psql -U postgres -d kanban_gmail`

#### Port Already in Use

```bash
# Kill process on port 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

#### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

#### Prisma Issues

```bash
cd backend
npx prisma generate
npx prisma db push

# If you need to reset the database
npx prisma db push --force-reset
```

#### Environment Variable Issues

- Make sure `backend/.env` exists and has correct values
- Check that DATABASE_URL format is correct
- Ensure PostgreSQL user has proper permissions

### Database Connection Examples

**Default PostgreSQL setup:**

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/kanban_gmail?schema=public"
```

**PostgreSQL with custom user:**

```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/kanban_gmail?schema=public"
```

## 🚀 Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] PostgreSQL installed and running
- [ ] Repository cloned
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend dependencies installed (`cd backend && npm install`)
- [ ] Database created (`createdb kanban_gmail`)
- [ ] Environment variables configured (`backend/.env`)
- [ ] Prisma setup completed (`npx prisma generate && npx prisma db push`)
- [ ] Backend running (`cd backend && npm run start:dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Application accessible at `http://localhost:3000`

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🆘 Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly set
4. Check that both frontend and backend are running
5. Look at console logs for specific error messages

For additional support, please check the project documentation or create an issue in the repository.

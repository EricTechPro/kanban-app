# Quick Start Guide - Backend API

## 🚀 Getting Started in 5 Minutes

### 1. Prerequisites Check

```bash
node --version  # Should be 18+
npm --version   # Should be 8+
psql --version  # PostgreSQL should be installed
```

### 2. Quick Setup

```bash
# Clone and navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# At minimum, update DATABASE_URL
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

### 5. Access Documentation

- Swagger UI: http://localhost:3001/api-docs
- Health Check: http://localhost:3001/api/health

## 📝 Testing the API

### Using Swagger UI

1. Navigate to http://localhost:3001/api-docs
2. Click on any endpoint to expand
3. Click "Try it out"
4. Fill in the parameters
5. Click "Execute"

### Using Postman

1. Import `postman_collection.json`
2. Set the `base_url` variable to `http://localhost:3001`
3. Start with the "Login" request to get a JWT token
4. The token will be automatically saved for other requests

### Using cURL

```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get deals (with JWT token)
curl -X GET http://localhost:3001/api/deals \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔧 Common Issues & Solutions

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Database Connection Failed

1. Check PostgreSQL is running: `pg_isready`
2. Verify DATABASE_URL in .env
3. Create database if needed: `createdb sponsorship_workflow`

### Gmail OAuth Not Working

1. Ensure Google Cloud project is set up
2. Gmail API is enabled
3. OAuth credentials are correct in .env
4. Redirect URI matches exactly

## 📚 Key API Endpoints

### Authentication

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/gmail/auth-url` - Start Gmail OAuth

### Deals

- `GET /api/deals` - List all deals
- `POST /api/deals` - Create new deal
- `PUT /api/deals/:id` - Update deal
- `POST /api/deals/move` - Move deals between stages

### Emails

- `GET /api/emails/messages` - Get Gmail messages
- `POST /api/emails/send` - Send email
- `GET /api/emails/templates` - Get email templates

## 🛠️ Development Commands

```bash
# Start dev server with hot reload
npm run start:dev

# Run tests
npm run test

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server
npm run start:prod
```

## 📊 Database Management

```bash
# View database in Prisma Studio
npx prisma studio

# Create new migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Generate Prisma client after schema changes
npx prisma generate
```

## 🔍 Debugging

### Enable Debug Logs

```bash
# In .env
LOG_LEVEL=debug

# Or when starting
LOG_LEVEL=debug npm run start:dev
```

### View SQL Queries

```typescript
// In main.ts or app.module.ts
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
```

## 📦 Adding New Features

### 1. Create New Module

```bash
nest g module features/new-feature
nest g controller features/new-feature
nest g service features/new-feature
```

### 2. Add DTOs

Create DTOs in `src/dto/new-feature.dto.ts` with validation decorators

### 3. Add Swagger Decorators

Use `@ApiTags`, `@ApiOperation`, `@ApiResponse` for documentation

### 4. Update Prisma Schema

Edit `prisma/schema.prisma` and run migrations

## 🚢 Deployment Checklist

- [ ] Set production environment variables
- [ ] Run database migrations
- [ ] Build the application
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring (e.g., Sentry)
- [ ] Configure backup strategy
- [ ] Test all endpoints in production

## 📞 Need Help?

- Check [API Documentation](./API_DOCUMENTATION.md)
- Review [Backend README](./README.md)
- Check Swagger docs at `/api-docs`
- Look for existing issues on GitHub

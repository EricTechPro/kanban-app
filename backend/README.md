# YouTube Sponsorship Workflow Backend

A NestJS backend microservice providing REST API and tRPC endpoints for managing YouTube sponsorship deals with Gmail integration.

## Features

- 🔐 **JWT Authentication** - Secure user authentication
- 📧 **Gmail Integration** - OAuth2 integration for email management
- 📊 **Deal Management** - Complete CRUD operations for sponsorship deals
- 🔄 **Workflow System** - 9-stage kanban workflow
- 📝 **Swagger Documentation** - Interactive API documentation
- 🚀 **tRPC Support** - Type-safe API calls
- 🗄️ **Prisma ORM** - Type-safe database access

## Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API**: REST + tRPC
- **Documentation**: Swagger/OpenAPI
- **Authentication**: JWT + Gmail OAuth2
- **Validation**: class-validator

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Cloud Console project with Gmail API enabled
- Gmail OAuth2 credentials

## Installation

1. Clone the repository and navigate to backend:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sponsorship_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRATION="24h"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3001/api/auth/gmail/callback"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Server
PORT=3001
```

5. Set up the database:

```bash
npx prisma generate
npx prisma migrate dev
```

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## API Documentation

### Swagger UI

Once the server is running, access the interactive API documentation at:

- http://localhost:3001/api-docs

### API Endpoints

The API provides the following main endpoint groups:

1. **Authentication** (`/api/auth/*`)

   - User registration and login
   - Gmail OAuth integration
   - Token management

2. **Deals** (`/api/deals/*`)

   - CRUD operations for sponsorship deals
   - Workflow stage management
   - Analytics and reporting

3. **Emails** (`/api/emails/*`)
   - Gmail message retrieval
   - Email sending
   - Thread management
   - Email templates

### tRPC Endpoints

tRPC endpoints are available at `/trpc/*` for type-safe client integration.

## Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   ├── controllers/       # REST API controllers
│   ├── dto/              # Data Transfer Objects
│   ├── config/           # Configuration files
│   ├── prisma/           # Prisma service
│   ├── trpc/             # tRPC routers and setup
│   ├── app.module.ts     # Main application module
│   └── main.ts           # Application entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── test/                 # Test files
├── API_DOCUMENTATION.md  # Detailed API docs
└── package.json
```

## Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User** - User accounts and authentication
- **Deal** - Sponsorship deal information
- **Email** - Email message tracking
- **EmailTemplate** - Reusable email templates

## Security

- JWT tokens for API authentication
- OAuth2 for Gmail integration
- Input validation on all endpoints
- SQL injection protection via Prisma
- CORS configuration for frontend access
- Rate limiting (configurable)

## Gmail OAuth Setup

1. Create a project in Google Cloud Console
2. Enable Gmail API
3. Create OAuth2 credentials
4. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/gmail/callback` (development)
   - `https://api.yourdomain.com/api/auth/gmail/callback` (production)
5. Add the credentials to your `.env` file

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

### Environment Variables

Ensure all required environment variables are set in your production environment.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Check the [API Documentation](./API_DOCUMENTATION.md)
- Open an issue on GitHub
- Contact the development team

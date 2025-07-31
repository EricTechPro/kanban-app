# Application Architecture

## Overview

The YouTube Sponsorship Workflow application uses a simplified, modern architecture that leverages Gmail as the primary data source, eliminating the need for a backend server or database.

## Architecture Diagram

```
┌─────────────────┐
│   Browser       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js App    │
│  (Frontend)     │
├─────────────────┤
│  API Routes     │
│  (Backend)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Gmail API      │
│  (Data Source)  │
└─────────────────┘
```

## Key Components

### 1. Frontend (Next.js App Router)

The frontend is built with Next.js 15 using the App Router pattern:

```
app/
├── api/                    # API routes
├── auth/                   # Authentication pages
├── dashboard/              # Main dashboard
└── page.tsx               # Landing page
```

### 2. API Routes

API routes handle all Gmail interactions:

```
app/api/
├── auth/gmail/
│   ├── auth-url/          # Generate OAuth URL
│   ├── callback/          # Handle OAuth callback
│   ├── status/            # Check connection status
│   ├── disconnect/        # Disconnect Gmail
│   └── refresh-token/     # Refresh access token
└── gmail/
    ├── emails/            # Fetch emails
    └── labels/            # Fetch labels
```

### 3. Components

React components organized by feature:

```
components/
├── ui/                    # shadcn/ui components
├── gmail-auth.tsx         # Gmail authentication
├── gmail-dashboard.tsx    # Email viewer
├── dashboard.tsx          # Kanban board
└── kanban-column.tsx      # Kanban columns
```

## Data Flow

### Authentication Flow

1. User clicks "Connect Gmail"
2. Frontend calls `/api/auth/gmail/auth-url`
3. User redirected to Google OAuth
4. Google redirects to `/auth/callback`
5. Callback exchanges code for tokens
6. Tokens stored in HTTP-only cookies
7. User redirected to dashboard

### Data Fetching Flow

1. Component requests data (e.g., emails)
2. API route retrieves tokens from cookies
3. API route calls Gmail API with tokens
4. Gmail API returns data
5. API route formats and returns data
6. Component displays data

## Security

### OAuth 2.0

- Industry-standard authentication
- Secure token exchange
- Granular permission scopes

### Token Storage

- Access tokens in HTTP-only cookies
- Refresh tokens for long-term access
- No tokens exposed to client-side JavaScript

### API Security

- All Gmail calls server-side
- No direct client-to-Gmail communication
- Rate limiting considerations

## Technology Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React hooks

### API Integration

- **Gmail API**: Official Google APIs client
- **Authentication**: Google OAuth 2.0
- **HTTP Client**: Native fetch API

### Development Tools

- **Package Manager**: npm
- **Bundler**: Turbopack (Next.js)
- **Linting**: ESLint
- **Type Checking**: TypeScript

## Design Decisions

### Why No Backend?

1. **Simplicity**: Fewer moving parts
2. **Cost**: No server hosting needed
3. **Maintenance**: Less code to maintain
4. **Real-time**: Always current Gmail data

### Why Gmail as Data Source?

1. **No Database**: Gmail stores all data
2. **Built-in Features**: Search, labels, threading
3. **Reliability**: Google's infrastructure
4. **Privacy**: User owns their data

### Why Next.js API Routes?

1. **Security**: Keep secrets server-side
2. **Same Origin**: No CORS issues
3. **Deployment**: Single app to deploy
4. **Performance**: Optimized for serverless

## Scalability Considerations

### Strengths

- Serverless architecture scales automatically
- No database bottlenecks
- Stateless API routes

### Limitations

- Gmail API rate limits (250 quota units/user/second)
- No offline functionality
- Limited to Gmail features

## Future Enhancements

### Planned Features

1. Email composition and sending
2. Advanced search and filtering
3. Email templates (localStorage)
4. Bulk operations
5. Analytics dashboard

### Architecture Evolution

1. Add Redis for caching
2. Implement webhook support
3. Add real-time updates via polling
4. Support multiple email providers

## Deployment

The application can be deployed to any Next.js-compatible platform:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Google Cloud Run**
- **Self-hosted Node.js**

### Environment Variables

Required for all deployments:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `NEXT_PUBLIC_APP_URL`

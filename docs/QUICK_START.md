# Quick Start Guide

Get the YouTube Sponsorship Workflow app running in 5 minutes!

## Prerequisites

- Node.js 18+ and npm installed
- A Google account for Gmail access
- Google Cloud Console account (free)

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd kanban-app

# Install dependencies
npm install
```

## Step 2: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/auth/callback`
   - Copy the Client ID and Client Secret

## Step 3: Configure Environment

Create a `.env.local` file in the root directory:

```env
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Start the Application

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 5: Connect Gmail

1. Click on "Dashboard" or navigate to `/dashboard`
2. Click "Connect Gmail" button
3. Authorize the application to access your Gmail
4. You're ready to go!

## Using the Application

### Gmail View

- See your emails directly from Gmail
- Filter by labels
- Real-time updates

### Kanban View

- Traditional kanban board for workflow management
- 9 stages from Prospecting to Completed
- Drag and drop functionality

## Troubleshooting

### "NetworkError when attempting to fetch resource"

- Make sure the app is running (`npm run dev`)
- Check that your `.env.local` file has the correct values

### Gmail not connecting

- Verify your Google OAuth credentials
- Ensure the redirect URI matches exactly: `http://localhost:3000/auth/callback`
- Check the browser console for errors

### Port already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Next Steps

- Explore the [Gmail Integration](GMAIL_INTEGRATION.md) features
- Learn about the [Application Architecture](ARCHITECTURE.md)
- Check out the [API Reference](API_REFERENCE.md)

## Need Help?

- Check the [documentation](README.md)
- Create an issue in the repository
- Review the error logs in the browser console

# Gmail Connection Setup Guide

## Prerequisites

Before connecting Gmail to the kanban board, you need to:

1. **Set up Google OAuth Credentials**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Gmail API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3001/api/auth/gmail/callback`
     - `http://localhost:3001/auth/google/callback`

2. **Configure Environment Variables**

   Create a `.env` file in the `backend` directory with:

   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/api/auth/gmail/callback
   ```

## Steps to Connect Gmail

1. **Start the Backend Server**

   ```bash
   cd backend
   npm run start:dev
   ```

2. **Start the Frontend**

   ```bash
   npm run dev
   ```

3. **Navigate to the Dashboard**

   - Open http://localhost:3002/dashboard
   - You should see the Gmail sync section

4. **Connect Gmail Account**

   - Click "Connect Gmail Account" button
   - A popup will open for Google OAuth
   - Sign in with your Google account
   - Grant permissions for Gmail access
   - The popup will close automatically

5. **Setup Kanban Labels**

   - After connecting, click "Setup Labels"
   - This creates the kanban label structure in Gmail

6. **Sync Emails**
   - Click "Sync Now" to import emails
   - Emails with kanban labels will appear as deal cards

## Troubleshooting

### "Gmail is not connected" Error

- Ensure Google OAuth credentials are properly configured
- Check that the backend server is running
- Verify the redirect URI matches your configuration

### OAuth Popup Blocked

- Allow popups for localhost in your browser
- Try disabling popup blockers temporarily

### Labels Not Creating

- Ensure your Google account has permission to create labels
- Check the backend logs for specific errors

### No Emails Syncing

- Make sure emails have the correct kanban labels
- Labels should follow the format: `kanban/stage-name`
- Example: `kanban/prospecting`, `kanban/negotiation`

## Testing Without Real Gmail

For testing purposes, you can:

1. Use the mock data already in the app
2. Manually create test deals through the "Add New Deal" button
3. The Gmail sync UI will still show, but won't connect without proper OAuth setup

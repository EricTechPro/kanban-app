# Gmail Setup Guide

## Overview

This guide walks you through setting up Gmail OAuth authentication for the YouTube Sponsorship Workflow application.

## Prerequisites

- A Google account
- Access to Google Cloud Console (free)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "YouTube Sponsorship App")
4. Click "Create"

### 2. Enable Gmail API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Gmail API"
3. Click on "Gmail API"
4. Click "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" user type
3. Click "Create"
4. Fill in the required fields:
   - App name: "YouTube Sponsorship Workflow"
   - User support email: Your email
   - Developer contact: Your email
5. Click "Save and Continue"
6. Add scopes:
   - Click "Add or Remove Scopes"
   - Select these scopes:
     - `gmail.readonly`
     - `gmail.labels`
     - `gmail.modify`
     - `email`
     - `profile`
   - Click "Update"
7. Add test users (your email)
8. Review and finish

### 4. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "YouTube Sponsorship Web Client"
5. Add Authorized redirect URIs:
   - For development: `http://localhost:3000/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`
6. Click "Create"
7. Copy the Client ID and Client Secret

### 5. Configure Application

Create or update `.env.local` in your project root:

```env
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Test the Connection

1. Start the application: `npm run dev`
2. Navigate to http://localhost:3000/dashboard
3. Click "Connect Gmail"
4. Authorize the application
5. You should see "Connected" status

## Production Setup

### 1. Update Redirect URIs

Add your production domain to authorized redirect URIs:

- `https://yourdomain.com/auth/callback`

### 2. Update Environment Variables

In your production environment:

```env
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=https://yourdomain.com/auth/callback
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Verify Domain (Optional)

For a better user experience:

1. Go to "OAuth consent screen"
2. Add your domain under "Authorized domains"
3. Complete verification process

## Security Best Practices

### 1. Protect Credentials

- Never commit `.env.local` to git
- Use environment variables in production
- Rotate credentials periodically

### 2. Limit Scopes

- Only request necessary permissions
- Use read-only scopes when possible
- Review scope usage regularly

### 3. Monitor Usage

- Check API quotas regularly
- Monitor for unusual activity
- Set up alerts for quota limits

## Troubleshooting

### "Access blocked" Error

- Ensure app is in testing mode or published
- Add user as test user if in testing
- Check OAuth consent screen configuration

### "Invalid redirect URI"

- Verify URI matches exactly (including protocol)
- No trailing slashes
- Check for typos

### "Quota exceeded"

- Gmail API has usage limits
- Implement caching
- Optimize API calls

### Token Expiration

- Access tokens expire after 1 hour
- Refresh tokens handle this automatically
- Check token refresh implementation

## API Quotas and Limits

### Gmail API Quotas

- **Per-user limit**: 250 quota units/user/second
- **Daily limit**: 1,000,000,000 quota units/day

### Quota Costs

- `messages.list`: 5 units
- `messages.get`: 5 units
- `labels.list`: 1 unit
- `messages.send`: 100 units

### Best Practices

1. Cache responses when possible
2. Use batch requests for multiple operations
3. Implement exponential backoff for retries
4. Monitor quota usage in Cloud Console

## Advanced Configuration

### Custom Scopes

Add additional scopes for more features:

- `gmail.send` - Send emails
- `gmail.compose` - Create drafts
- `gmail.metadata` - Access metadata only

### Service Account (Optional)

For server-to-server authentication:

1. Create service account in Cloud Console
2. Enable domain-wide delegation
3. Configure in Google Workspace admin

### Webhook Support (Future)

Gmail API supports push notifications:

1. Set up Cloud Pub/Sub
2. Configure webhook endpoint
3. Subscribe to Gmail changes

## Resources

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com)
- [API Explorer](https://developers.google.com/apis-explorer)

## Need Help?

Common issues and solutions:

1. Check browser console for errors
2. Verify all environment variables
3. Ensure Gmail API is enabled
4. Check OAuth consent screen status

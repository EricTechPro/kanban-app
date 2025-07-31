# API Reference

## Overview

All API endpoints are implemented as Next.js API routes under `/app/api/`. These routes handle Gmail authentication and data fetching.

## Authentication Endpoints

### GET /api/auth/gmail/auth-url

Generate Gmail OAuth authorization URL.

**Response:**

```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
  "message": "Redirect user to this URL to start OAuth flow"
}
```

### POST /api/auth/gmail/callback

Handle OAuth callback and exchange code for tokens.

**Request Body:**

```json
{
  "code": "authorization-code-from-google"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "email": "user@gmail.com",
    "name": "User Name",
    "picture": "https://..."
  }
}
```

### GET /api/auth/gmail/status

Check Gmail connection status.

**Response:**

```json
{
  "connected": true,
  "email": "user@gmail.com"
}
```

### DELETE /api/auth/gmail/disconnect

Disconnect Gmail account and clear tokens.

**Response:**

```json
{
  "success": true,
  "message": "Gmail disconnected successfully"
}
```

### POST /api/auth/gmail/refresh-token

Refresh the Gmail access token.

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

## Gmail Data Endpoints

### GET /api/gmail/emails

Fetch emails from Gmail.

**Query Parameters:**

- `q` (optional): Gmail search query (default: "is:unread")
- `maxResults` (optional): Maximum number of results (default: 50)

**Example:**

```
GET /api/gmail/emails?q=label:important&maxResults=20
```

**Response:**

```json
{
  "emails": [
    {
      "id": "message-id",
      "threadId": "thread-id",
      "subject": "Email Subject",
      "from": "sender@example.com",
      "date": "2024-01-01T12:00:00Z",
      "snippet": "Email preview text...",
      "labelIds": ["INBOX", "IMPORTANT"]
    }
  ],
  "nextPageToken": "token-for-pagination"
}
```

### GET /api/gmail/labels

Fetch Gmail labels.

**Response:**

```json
{
  "labels": [
    {
      "id": "Label_1",
      "name": "Work",
      "type": "user",
      "messageListVisibility": "show",
      "labelListVisibility": "labelShow"
    }
  ]
}
```

## Error Responses

All endpoints return consistent error responses:

### 401 Unauthorized

```json
{
  "error": "Not authenticated with Gmail"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to [action description]"
}
```

## Authentication Flow

1. **Initiate OAuth**

   - Call `GET /api/auth/gmail/auth-url`
   - Redirect user to the returned `authUrl`

2. **Handle Callback**

   - Google redirects to `/auth/callback?code=...`
   - Page calls `POST /api/auth/gmail/callback` with code
   - Tokens are stored in HTTP-only cookies

3. **Use Authenticated Endpoints**
   - Cookies are automatically sent with requests
   - API routes use tokens to access Gmail

## Rate Limits

Gmail API has the following limits:

- 250 quota units per user per second
- 1,000,000,000 quota units per day

Each API call consumes different quota units:

- `messages.list`: 5 units
- `messages.get`: 5 units
- `labels.list`: 1 unit

## Security Considerations

1. **Token Storage**

   - Tokens stored in HTTP-only cookies
   - Cookies have `SameSite=lax` attribute
   - Secure flag enabled in production

2. **CORS**

   - API routes are same-origin
   - No CORS configuration needed

3. **Environment Variables**
   - OAuth credentials in environment variables
   - Never exposed to client-side code

## Usage Examples

### JavaScript/TypeScript

```typescript
// Check connection status
const checkStatus = async () => {
  const response = await fetch("/api/auth/gmail/status");
  const data = await response.json();
  console.log("Connected:", data.connected);
};

// Fetch emails
const fetchEmails = async () => {
  const response = await fetch("/api/gmail/emails?q=is:unread");
  const data = await response.json();
  console.log("Emails:", data.emails);
};

// Disconnect Gmail
const disconnect = async () => {
  const response = await fetch("/api/auth/gmail/disconnect", {
    method: "DELETE",
  });
  const data = await response.json();
  console.log("Disconnected:", data.success);
};
```

### cURL

```bash
# Check status
curl http://localhost:3000/api/auth/gmail/status

# Get auth URL
curl http://localhost:3000/api/auth/gmail/auth-url

# Fetch emails
curl http://localhost:3000/api/gmail/emails?q=is:unread

# Fetch labels
curl http://localhost:3000/api/gmail/labels
```

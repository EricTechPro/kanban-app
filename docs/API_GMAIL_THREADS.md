# Gmail Threads API Endpoint

## Overview

The `/api/gmail/threads` endpoint fetches Gmail threads from the authenticated user's Gmail account.

## Endpoint

```
GET /api/gmail/threads
```

## Authentication

This endpoint requires Gmail OAuth authentication. The user must have a valid `gmail_access_token` cookie set.

## Query Parameters

| Parameter    | Type   | Default | Description                                            |
| ------------ | ------ | ------- | ------------------------------------------------------ |
| `maxResults` | number | 50      | Maximum number of threads to return                    |
| `pageToken`  | string | -       | Token for pagination (returned from previous requests) |
| `q`          | string | -       | Gmail search query to filter threads                   |

## Response

### Success Response (200 OK)

```json
{
  "threads": [
    {
      "threadId": "string",
      "messages": [
        {
          "id": "string",
          "threadId": "string",
          "from": "string",
          "to": ["string"],
          "subject": "string",
          "snippet": "string",
          "body": "string",
          "date": "ISO 8601 date string",
          "labels": ["string"]
        }
      ],
      "stage": "PROSPECTING | INITIAL_CONTACT | NEGOTIATION | CONTRACT_SENT | CONTRACT_SIGNED | IN_PRODUCTION | COMPLETED"
    }
  ],
  "nextPageToken": "string (optional)",
  "totalThreads": number
}
```

### Error Responses

#### 401 Unauthorized

```json
{
  "error": "Not authenticated with Gmail"
}
```

or

```json
{
  "error": "Gmail authentication expired"
}
```

#### 500 Internal Server Error

```json
{
  "error": "Failed to fetch Gmail threads"
}
```

## Usage Example

### JavaScript/TypeScript

```typescript
// Using the API client
import { apiClient } from "@/lib/api/client";

const threads = await apiClient.getGmailThreads();

// Direct fetch
const response = await fetch("/api/gmail/threads?maxResults=20", {
  method: "GET",
  credentials: "include",
});

if (response.ok) {
  const data = await response.json();
  console.log(data.threads);
}
```

### With Pagination

```typescript
let allThreads = [];
let pageToken = null;

do {
  const url = pageToken
    ? `/api/gmail/threads?pageToken=${pageToken}`
    : "/api/gmail/threads";

  const response = await fetch(url);
  const data = await response.json();

  allThreads = [...allThreads, ...data.threads];
  pageToken = data.nextPageToken;
} while (pageToken);
```

### With Search Query

```typescript
// Search for threads from a specific sender
const response = await fetch("/api/gmail/threads?q=from:example@gmail.com");

// Search for threads with specific subject
const response = await fetch(
  '/api/gmail/threads?q=subject:"YouTube Sponsorship"'
);
```

## Implementation Details

1. **Authentication**: The endpoint checks for a valid Gmail access token in cookies
2. **Label Mapping**: Automatically maps Gmail labels to Kanban stages based on the configured label structure
3. **Thread Processing**: Fetches full thread details including all messages
4. **Stage Detection**: Determines the Kanban stage based on the labels of the most recent message in the thread
5. **Body Extraction**: Attempts to extract message body from both single-part and multi-part messages

## Notes

- The endpoint fetches threads in batches to avoid timeout issues
- Each thread includes all its messages with full details
- The stage is determined by checking for Kanban-specific labels (e.g., "Kanban/Prospecting")
- If no Kanban label is found, threads default to the "PROSPECTING" stage
- The endpoint supports Gmail's search query syntax for filtering threads

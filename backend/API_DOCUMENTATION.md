# YouTube Sponsorship Workflow API Documentation

## Overview

This API provides comprehensive endpoints for managing YouTube sponsorship deals through a structured workflow system. The API is built with NestJS and provides both tRPC and REST endpoints with full Swagger documentation.

## Base URL

- Development: `http://localhost:3001`
- Production: `https://api.yourdomain.com`

## Authentication

The API uses JWT Bearer tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Swagger Documentation

Interactive API documentation is available at:

- Development: `http://localhost:3001/api-docs`
- Production: `https://api.yourdomain.com/api-docs`

## API Endpoints

### Authentication Endpoints

#### 1. Register User

- **POST** `/api/auth/register`
- **Description**: Create a new user account
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }
  ```
- **Response**: `AuthResponseDto` with JWT token and user info

#### 2. Login

- **POST** `/api/auth/login`
- **Description**: Authenticate user and receive JWT token
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `AuthResponseDto` with JWT token and user info

#### 3. Get Gmail Auth URL

- **GET** `/api/auth/gmail/auth-url`
- **Description**: Get Gmail OAuth authorization URL
- **Response**:
  ```json
  {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...",
    "message": "Redirect user to this URL to start OAuth flow"
  }
  ```

#### 4. Get Gmail Status

- **GET** `/api/auth/gmail/status`
- **Auth Required**: Yes
- **Description**: Check Gmail connection status
- **Response**:
  ```json
  {
    "isConnected": true,
    "email": "user@gmail.com",
    "expiresAt": "2024-12-31T23:59:59Z",
    "needsRefresh": false
  }
  ```

#### 5. Disconnect Gmail

- **DELETE** `/api/auth/gmail/disconnect`
- **Auth Required**: Yes
- **Description**: Remove Gmail OAuth connection

#### 6. Refresh Gmail Token

- **POST** `/api/auth/gmail/refresh-token`
- **Auth Required**: Yes
- **Description**: Refresh Gmail access token if expired

### Deal Management Endpoints

#### 1. Get All Deals

- **GET** `/api/deals`
- **Auth Required**: Yes
- **Query Parameters**:
  - `stage`: Filter by workflow stage (enum: DealStage)
  - `priority`: Filter by priority (enum: DealPriority)
  - `search`: Search in title and brand
  - `tags`: Filter by tags (comma-separated)
  - `dueBefore`: Filter deals due before date
  - `dueAfter`: Filter deals due after date
- **Response**: Array of `DealResponseDto`

#### 2. Get Deal by ID

- **GET** `/api/deals/:id`
- **Auth Required**: Yes
- **Response**: `DealResponseDto`

#### 3. Create Deal

- **POST** `/api/deals`
- **Auth Required**: Yes
- **Body**: `CreateDealDto`
- **Response**: `DealResponseDto`

#### 4. Update Deal

- **PUT** `/api/deals/:id`
- **Auth Required**: Yes
- **Body**: `UpdateDealDto`
- **Response**: `DealResponseDto`

#### 5. Delete Deal

- **DELETE** `/api/deals/:id`
- **Auth Required**: Yes
- **Response**: 204 No Content

#### 6. Move Deals

- **POST** `/api/deals/move`
- **Auth Required**: Yes
- **Description**: Bulk move deals to different stage
- **Body**:
  ```json
  {
    "dealIds": ["uuid1", "uuid2"],
    "targetStage": "contract_sent"
  }
  ```

#### 7. Get Deals by Stage

- **GET** `/api/deals/stage/:stage`
- **Auth Required**: Yes
- **Response**: Array of `DealResponseDto`

#### 8. Get Analytics Summary

- **GET** `/api/deals/analytics/summary`
- **Auth Required**: Yes
- **Response**:
  ```json
  {
    "totalDeals": 42,
    "totalValue": 2500000,
    "dealsByStage": {
      "prospecting": 5,
      "initial_contact": 8,
      "negotiation": 12,
      "contract_sent": 3,
      "contract_signed": 2,
      "content_creation": 4,
      "content_review": 2,
      "published": 3,
      "completed": 3
    },
    "averageDealValue": 59524,
    "overdueDeals": 7
  }
  ```

### Email Management Endpoints

#### 1. Get Email Messages

- **GET** `/api/emails/messages`
- **Auth Required**: Yes
- **Query Parameters**:
  - `label`: Filter by Gmail label
  - `unread`: Filter by unread status
  - `search`: Search query
  - `from`: Filter by sender
  - `after`: Filter emails after date
  - `before`: Filter emails before date
  - `maxResults`: Maximum number of results
- **Response**: Array of `EmailMessageDto`

#### 2. Get Email by ID

- **GET** `/api/emails/messages/:id`
- **Auth Required**: Yes
- **Response**: `EmailMessageDto`

#### 3. Send Email

- **POST** `/api/emails/send`
- **Auth Required**: Yes
- **Body**: `SendEmailDto`
- **Response**: `MessageResponseDto`

#### 4. Get Email Threads

- **GET** `/api/emails/threads`
- **Auth Required**: Yes
- **Response**: Array of `EmailThreadDto`

#### 5. Get Thread Messages

- **GET** `/api/emails/threads/:id`
- **Auth Required**: Yes
- **Response**: Array of `EmailMessageDto`

#### 6. Mark Email as Read

- **POST** `/api/emails/messages/:id/mark-read`
- **Auth Required**: Yes

#### 7. Mark Email as Unread

- **POST** `/api/emails/messages/:id/mark-unread`
- **Auth Required**: Yes

#### 8. Email Templates

- **GET** `/api/emails/templates` - Get all templates
- **POST** `/api/emails/templates` - Create template
- **PUT** `/api/emails/templates/:id` - Update template
- **DELETE** `/api/emails/templates/:id` - Delete template

#### 9. Link Email to Deal

- **POST** `/api/emails/messages/:id/link-deal`
- **Auth Required**: Yes
- **Body**: `{ "dealId": "uuid" }`

## Data Models

### DealStage Enum

```typescript
enum DealStage {
  PROSPECTING = "prospecting",
  INITIAL_CONTACT = "initial_contact",
  NEGOTIATION = "negotiation",
  CONTRACT_SENT = "contract_sent",
  CONTRACT_SIGNED = "contract_signed",
  CONTENT_CREATION = "content_creation",
  CONTENT_REVIEW = "content_review",
  PUBLISHED = "published",
  COMPLETED = "completed",
}
```

### DealPriority Enum

```typescript
enum DealPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}
```

## Error Responses

All endpoints follow a consistent error response format:

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

Common HTTP status codes:

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- Default: 100 requests per minute per IP
- Authenticated users: 1000 requests per minute

## Webhooks

The API supports webhooks for real-time updates:

- Deal status changes
- New email received
- Email sent confirmation

Configure webhooks in your account settings.

## tRPC Integration

In addition to REST endpoints, the API also provides tRPC endpoints at `/trpc/*` for type-safe client integration. The tRPC router includes all the same functionality as the REST API.

## Development

### Running the API

```bash
cd backend
npm install
npm run start:dev
```

### Testing

```bash
npm run test
npm run test:e2e
```

### Building for Production

```bash
npm run build
npm run start:prod
```

## Security

- All endpoints use HTTPS in production
- JWT tokens expire after 24 hours
- Gmail OAuth tokens are securely stored and refreshed automatically
- Input validation on all endpoints
- SQL injection protection via Prisma ORM
- XSS protection headers enabled

## Support

For API support, please contact:

- Email: api-support@yourdomain.com
- Documentation: https://docs.yourdomain.com
- Status Page: https://status.yourdomain.com

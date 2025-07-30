# Swagger API Documentation Guide

## 🚀 Accessing Swagger UI

Once your backend is running, you can access the Swagger documentation at:

**http://localhost:3001/api-docs**

## 📋 What You'll See in Swagger

### 1. **API Overview**

- Title: YouTube Sponsorship Workflow API
- Description of the API features
- Version information
- Authentication methods available

### 2. **Available Endpoints**

The API is organized into three main sections:

#### **Authentication Endpoints** (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/gmail/auth-url` - Get Gmail OAuth URL
- `GET /api/auth/gmail/status` - Check Gmail connection status
- `DELETE /api/auth/gmail/disconnect` - Disconnect Gmail
- `POST /api/auth/gmail/refresh-token` - Refresh Gmail token
- `GET /api/auth/gmail/callback` - Gmail OAuth callback

#### **Deals Endpoints** (`/api/deals`)

- `GET /api/deals` - Get all deals with filtering
- `GET /api/deals/:id` - Get specific deal
- `POST /api/deals` - Create new deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal
- `POST /api/deals/move` - Move deals between stages
- `GET /api/deals/stage/:stage` - Get deals by stage
- `GET /api/deals/analytics/summary` - Get analytics summary

#### **Email Endpoints** (`/api/emails`)

- `GET /api/emails/messages` - List email messages
- `GET /api/emails/messages/:id` - Get specific message
- `POST /api/emails/send` - Send email
- `GET /api/emails/threads` - List email threads
- `GET /api/emails/threads/:id` - Get specific thread
- `POST /api/emails/messages/:id/mark-read` - Mark as read
- `POST /api/emails/messages/:id/mark-unread` - Mark as unread
- `GET /api/emails/templates` - List email templates
- `POST /api/emails/templates` - Create template
- `PUT /api/emails/templates/:id` - Update template
- `DELETE /api/emails/templates/:id` - Delete template
- `POST /api/emails/messages/:id/link-deal` - Link email to deal

## 🔐 Authentication in Swagger

### Step 1: Register or Login

1. Expand the `POST /api/auth/register` or `POST /api/auth/login` endpoint
2. Click "Try it out"
3. Fill in the request body:
   ```json
   {
     "email": "your@email.com",
     "password": "yourpassword"
   }
   ```
4. Click "Execute"
5. Copy the `accessToken` from the response

### Step 2: Authorize Swagger

1. Click the "Authorize" button at the top of the page (or the lock icon)
2. In the "JWT-auth" section, enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click "Authorize"
4. Click "Close"

Now all protected endpoints will include your authentication token automatically!

## 🧪 Testing Endpoints

### Example: Creating a Deal

1. Find `POST /api/deals` endpoint
2. Click to expand it
3. Click "Try it out"
4. Fill in the request body:
   ```json
   {
     "title": "Tech Review Sponsorship",
     "brand": "TechCorp",
     "contactEmail": "sponsor@techcorp.com",
     "value": 5000,
     "currency": "USD",
     "stage": "prospecting",
     "priority": "high",
     "dueDate": "2025-08-15T00:00:00Z",
     "description": "Sponsorship for upcoming tech review video",
     "tags": ["tech", "review", "q3-2025"]
   }
   ```
5. Click "Execute"
6. View the response below

### Example: Getting All Deals with Filters

1. Find `GET /api/deals` endpoint
2. Click "Try it out"
3. Set query parameters:
   - `stage`: Select from dropdown (e.g., "negotiation")
   - `priority`: Select from dropdown (e.g., "high")
   - `search`: Enter search term
   - `sortBy`: Choose field to sort by
   - `sortOrder`: Choose "asc" or "desc"
4. Click "Execute"

## 📊 Response Information

For each endpoint, Swagger shows:

- **Request format**: Required fields, data types, and examples
- **Response codes**:
  - `200` - Success
  - `201` - Created
  - `400` - Bad Request
  - `401` - Unauthorized
  - `404` - Not Found
  - `500` - Server Error
- **Response schema**: Structure of the returned data
- **Example responses**: Sample data for each response code

## 🎯 Workflow Stages

The available workflow stages are:

1. `prospecting` - Initial research
2. `initial_contact` - First outreach
3. `negotiation` - Terms discussion
4. `contract_sent` - Legal docs sent
5. `contract_signed` - Agreement finalized
6. `content_creation` - Production phase
7. `content_review` - Sponsor approval
8. `published` - Content live
9. `completed` - Deal closed

## 🔧 Advanced Features

### Bulk Operations

Use the `POST /api/deals/move` endpoint to move multiple deals:

```json
{
  "dealIds": ["deal1", "deal2", "deal3"],
  "targetStage": "negotiation"
}
```

### Email Integration

After connecting Gmail:

1. Use `/api/emails/messages` to fetch emails
2. Use `/api/emails/messages/:id/link-deal` to link emails to deals
3. Use `/api/emails/send` to send emails with templates

### Analytics

Use `/api/deals/analytics/summary` to get:

- Total deals by stage
- Revenue by stage
- Priority distribution
- Overdue deals count

## 🐛 Troubleshooting

### Common Issues:

1. **401 Unauthorized**

   - Your token may have expired
   - Re-login and update the authorization

2. **400 Bad Request**

   - Check the request body format
   - Ensure all required fields are provided
   - Verify data types match the schema

3. **404 Not Found**
   - Verify the ID exists
   - Check the endpoint URL is correct

## 📝 Export Options

Swagger allows you to:

- **Copy curl commands**: Click on the endpoint response to get the curl command
- **Download OpenAPI spec**: Access the raw API specification at `/api-docs-json`
- **Import to Postman**: Use the OpenAPI spec to import into Postman

## 🚀 Quick Start Testing Flow

1. **Register a user**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` (get access token)
3. **Authorize Swagger**: Add Bearer token
4. **Create a deal**: `POST /api/deals`
5. **List all deals**: `GET /api/deals`
6. **Move deal to next stage**: `POST /api/deals/move`
7. **Get analytics**: `GET /api/deals/analytics/summary`

---

The Swagger UI provides an interactive way to explore and test all API endpoints without needing any external tools. It's perfect for development and testing!

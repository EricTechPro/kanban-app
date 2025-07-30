# Quick Start: Testing the Backend API

## 🚀 Prerequisites Completed

✅ Backend is running on port 3001
✅ Database migrations applied
✅ Swagger UI available at http://localhost:3001/api-docs

## 📋 Quick Testing Steps

### 1. Open Swagger UI

Navigate to: **http://localhost:3001/api-docs**

### 2. Create a Test User

1. Find `POST /api/auth/register`
2. Click "Try it out"
3. Use this body:
   ```json
   {
     "email": "test@example.com",
     "password": "Test123!",
     "name": "Test User"
   }
   ```
4. Click "Execute"
5. Copy the `accessToken` from response

### 3. Authorize Swagger

1. Click "Authorize" button (top right)
2. Enter: `Bearer YOUR_ACCESS_TOKEN`
3. Click "Authorize" then "Close"

### 4. Test Deal Creation

1. Find `POST /api/deals`
2. Click "Try it out"
3. Use this body:
   ```json
   {
     "title": "My First Sponsorship Deal",
     "brand": "TechCorp",
     "contactEmail": "sponsor@techcorp.com",
     "value": 5000,
     "currency": "USD",
     "stage": "prospecting",
     "priority": "high",
     "dueDate": "2025-08-15T00:00:00Z",
     "description": "Test sponsorship deal",
     "tags": ["test", "tech"]
   }
   ```
4. Click "Execute"

### 5. View All Deals

1. Find `GET /api/deals`
2. Click "Try it out"
3. Click "Execute"
4. You should see your created deal

## 🔧 Other Endpoints to Try

### Gmail Integration (Optional)

1. `GET /api/auth/gmail/auth-url` - Get OAuth URL
2. Visit the URL in browser to connect Gmail
3. `GET /api/auth/gmail/status` - Check connection

### Email Features (Requires Gmail)

- `GET /api/emails/messages` - List emails
- `POST /api/emails/send` - Send email
- `GET /api/emails/templates` - Email templates

### Analytics

- `GET /api/deals/analytics/summary` - Deal statistics

## 🐛 Troubleshooting

### Backend Not Running?

```bash
cd backend
npm run start:dev
```

### Database Issues?

```bash
cd backend
npx prisma migrate reset --force
npx prisma migrate dev --name init
```

### Port Already in Use?

Check `.env` file in backend folder and change PORT if needed.

## 📝 Environment Variables

Make sure your `backend/.env` file has:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

## 🎯 Next Steps

1. Test all CRUD operations for deals
2. Try moving deals between stages
3. Test filtering and sorting
4. Explore email integration
5. Check analytics endpoints

---

The API is now ready for testing! Use Swagger UI for interactive testing or import the OpenAPI spec into Postman for more advanced testing scenarios.

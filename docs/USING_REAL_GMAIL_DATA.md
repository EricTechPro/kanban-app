# Using Real Gmail Data

The application is now configured to use real Gmail data instead of mock data. Here's how it works:

## Automatic Gmail Sync

When you access the dashboard, the application will:

1. **Check Gmail Connection**: Automatically check if your Gmail account is connected
2. **Auto-sync Data**: If connected, it will automatically sync your Gmail threads
3. **Display Real Emails**: Show your actual email threads organized in the kanban board

## How to Connect Gmail

1. Navigate to the dashboard at http://localhost:3001/dashboard
2. Click the "Connect Gmail" button in the Gmail Sync section
3. Authorize the application to access your Gmail account
4. Once connected, your emails will automatically sync

## Data Flow

- **No Mock Data**: The application starts with an empty kanban board
- **Real-time Sync**: All data comes directly from your Gmail account
- **Automatic Updates**: The GmailAutoSync component fetches data on page load
- **Persistent State**: Data is managed through React Context and updates in real-time

## Features with Real Gmail Data

- **Email Threading**: Conversations are grouped by thread
- **Stage Management**: Move emails between stages (Prospecting, Initial Contact, etc.)
- **Gmail Label Sync**: Changes in the kanban board update Gmail labels
- **Two-way Sync**: Moving cards updates Gmail labels, and Gmail label changes reflect in the board

## Troubleshooting

If you don't see your Gmail data:

1. Check if Gmail is connected (look for the connection status in the Gmail Sync section)
2. Make sure you've authorized the correct Gmail account
3. Check the browser console for any error messages
4. Try manually clicking the "Sync Gmail" button

## Security Note

Your Gmail data is accessed securely through OAuth 2.0. The application only requests the minimum necessary permissions to read and manage labels on your emails.

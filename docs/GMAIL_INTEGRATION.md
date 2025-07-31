# Gmail Integration Guide for Kanban Board

## Overview

The kanban board now integrates with Gmail to automatically sync emails as deal cards based on Gmail labels. This allows you to manage your sponsorship workflow directly from your inbox.

## How It Works

### 1. Gmail Label Structure

The integration creates the following label structure in your Gmail:

```
kanban/
├── kanban/prospecting
├── kanban/initial-contact
├── kanban/negotiation
├── kanban/contract-sent
├── kanban/contract-signed
├── kanban/content-creation
├── kanban/content-review
├── kanban/published
└── kanban/completed
```

### 2. Setting Up Gmail Sync

1. **Connect Gmail**: First, ensure your Gmail account is connected through the Gmail Auth component
2. **Setup Labels**: Click "Setup Labels" in the Gmail Sync section to create the kanban label structure
3. **Sync Emails**: Click "Sync Now" to import emails with kanban labels as deal cards

### 3. Email to Deal Conversion

When syncing, emails are converted to deals with:

- **Title**: Email subject line
- **Brand**: Sender's name
- **Value**: Extracted from subject (if contains $XXX or XXXk)
- **Due Date**: Email date
- **Contact**: Sender's email and name
- **Stage**: Based on the Gmail label

### 4. Managing Email-Based Deals

- **Visual Indicator**: Email-based deals show a "Gmail" badge
- **Drag & Drop**: Moving cards updates Gmail labels automatically
- **Two-way Sync**: Changes in Gmail labels reflect on the board after sync

### 5. Workflow Example

1. Label incoming sponsorship emails with `kanban/prospecting`
2. Sync the board to see them as deal cards
3. Drag cards through stages as deals progress
4. Gmail labels update automatically

## API Endpoints

The following endpoints are available for Gmail sync:

- `POST /api/gmail/sync/labels` - Create kanban labels in Gmail
- `GET /api/gmail/sync/emails` - Fetch all emails with kanban labels
- `GET /api/gmail/sync/stage/:stage` - Get emails for specific stage
- `POST /api/gmail/sync/move` - Move email to different stage
- `GET /api/gmail/labels` - List all Gmail labels

## Technical Implementation

### Backend Services

- **GmailLabelsService**: Manages Gmail label operations
- **GmailSyncController**: Handles API endpoints for sync

### Frontend Components

- **GmailSync**: UI component for sync operations
- **useGmailSync**: Hook for Gmail-specific operations
- **DealCard**: Updated to show Gmail indicators

### Data Flow

1. User initiates sync from dashboard
2. Backend creates/verifies Gmail labels
3. Emails are fetched and converted to deals
4. Deals are added to kanban context
5. Moving deals triggers Gmail label updates

## Troubleshooting

### Labels Not Created

- Ensure Gmail is properly connected
- Check Gmail API permissions include label management

### Emails Not Syncing

- Verify emails have the correct kanban labels
- Check Gmail API quota limits

### Sync Errors

- Review browser console for detailed errors
- Ensure backend is running and accessible
- Check network connectivity

## Future Enhancements

- Real-time Gmail webhook integration
- Automatic email parsing for deal details
- Email template management
- Bulk label operations
- Email thread tracking

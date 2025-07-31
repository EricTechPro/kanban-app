# YouTube Sponsorship Workflow - Gmail-Powered Kanban Board

A modern kanban board application for managing YouTube sponsorship deals, powered directly by Gmail API. Built with Next.js 15, TypeScript, and shadcn/ui components.

## 🚀 Features

### Gmail Integration

- **Direct Gmail API Access**: No backend required - connects directly to Gmail
- **OAuth Authentication**: Secure Google OAuth 2.0 authentication
- **Real-time Email Data**: Always shows current Gmail state
- **Label Filtering**: Organize emails by Gmail labels

### Dashboard Views

- **Gmail View**: Browse and filter emails directly from Gmail
- **Kanban View**: Traditional kanban board for workflow management
- **Toggle Between Views**: Easy switching between Gmail and Kanban views

### Deal Management (Kanban View)

- **9-Stage Workflow**:
  - Prospecting
  - Initial Contact
  - Negotiation
  - Contract Sent
  - Contract Signed
  - Content Creation
  - Content Review
  - Published
  - Completed
- **Drag & Drop**: Move deals between stages
- **Rich Deal Cards**: Display all deal information

## 🏗️ Simplified Architecture

```
Frontend (Next.js) → Gmail API
```

No backend, no database - everything runs in the Next.js app with data from Gmail.

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Cloud Console account for OAuth credentials
- Gmail account

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd kanban-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file:

   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/callback
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Configure Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/auth/callback` to authorized redirect URIs

## 🚀 Running the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes for Gmail integration
│   │   ├── auth/gmail/    # Gmail OAuth endpoints
│   │   └── gmail/         # Gmail data endpoints
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── gmail-auth.tsx    # Gmail authentication component
│   ├── gmail-dashboard.tsx # Gmail email viewer
│   └── dashboard.tsx     # Kanban board component
├── lib/                  # Utility functions
└── docs/                 # Documentation
```

## 🔑 Key Features Explained

### Gmail OAuth Flow

1. User clicks "Connect Gmail"
2. Redirected to Google OAuth consent
3. After approval, redirected back to app
4. Tokens stored in secure HTTP-only cookies
5. App can now access Gmail data

### API Routes

- `/api/auth/gmail/auth-url` - Get OAuth URL
- `/api/auth/gmail/callback` - Handle OAuth callback
- `/api/auth/gmail/status` - Check connection status
- `/api/gmail/emails` - Fetch emails
- `/api/gmail/labels` - Fetch labels

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) for a modern, accessible interface:

- Cards for displaying content
- Buttons with multiple variants
- Forms with validation
- Modals and dialogs
- Toast notifications
- And more...

## 🔒 Security

- OAuth tokens stored in HTTP-only cookies
- No user data stored on servers
- Direct API communication with Gmail
- Secure authentication flow

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Known Issues

- Gmail API rate limits apply
- Requires active internet connection
- Limited to Gmail features

## 📚 Documentation

- [Simplified Architecture](docs/SIMPLIFIED_ARCHITECTURE.md)
- [Gmail Integration](docs/GMAIL_INTEGRATION.md)
- [Development Workflow](docs/development/Development_Workflow.md)

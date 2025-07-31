# YouTube Sponsorship Workflow - Gmail-Powered Kanban Board

A modern kanban board application for managing YouTube sponsorship deals, powered directly by Gmail API. Built with Next.js 15, TypeScript, and shadcn/ui components.

## 🚨 Gmail Connection Setup Required

**The "NetworkError when attempting to fetch resource" error occurs because Google OAuth credentials are not configured.**

### Quick Fix:

1. **Set up Google OAuth credentials** (see [GMAIL_OAUTH_SETUP.md](GMAIL_OAUTH_SETUP.md))
2. **Update `.env.local`** with your actual credentials
3. **Restart the development server**

For detailed setup instructions, see:

- [GMAIL_OAUTH_SETUP.md](GMAIL_OAUTH_SETUP.md) - Quick start guide
- [docs/GMAIL_SETUP.md](docs/GMAIL_SETUP.md) - Complete step-by-step guide

## 🚀 Features

### Gmail Integration

- **Direct Gmail API Access**: No backend required - connects directly to Gmail
- **OAuth Authentication**: Secure Google OAuth 2.0 authentication
- **Real-time Email Data**: Always shows current Gmail state
- **Label Filtering**: Organize emails by Gmail labels
- **No Mock Data**: Uses real Gmail data exclusively - see [Using Real Gmail Data](docs/USING_REAL_GMAIL_DATA.md)

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
- **Deal Details**: Track value, contacts, notes, and attachments
- **Bulk Operations**: Select and move/delete multiple deals

## 📋 Prerequisites

- Node.js 18+ and npm
- Google account
- Google Cloud Console access (free)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kanban-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure Google OAuth** (see [GMAIL_OAUTH_SETUP.md](GMAIL_OAUTH_SETUP.md))

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the application**
   - Navigate to http://localhost:3000
   - Click "Connect Gmail" to authenticate

## 📚 Documentation

- [Quick Start Guide](docs/QUICK_START.md)
- [Gmail Setup Guide](docs/GMAIL_SETUP.md)
- [API Reference](docs/API_REFERENCE.md)
- [Architecture Overview](docs/architecture.md)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License.

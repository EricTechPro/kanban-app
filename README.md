# YouTube Sponsorship Workflow - Kanban Board Application

A comprehensive kanban board application for managing YouTube sponsorship deals, built with Next.js 15, TypeScript, and shadcn/ui components.

## 🚀 Features

### Authentication

- **Login Page**: Clean, modern login interface with email/password authentication
- **Social Login**: Support for Google, YouTube, and GitHub authentication
- **Form Validation**: Real-time validation with error messages
- **Password Toggle**: Show/hide password functionality

### Dashboard

- **Kanban Board**: 9-stage workflow for sponsorship deals
  - Prospecting
  - Initial Contact
  - Negotiation
  - Contract Sent
  - Contract Signed
  - Content Creation
  - Content Review
  - Published
  - Completed

### Deal Management

- **Deal Cards**: Rich cards displaying all deal information
  - Deal title and brand
  - Deal value with currency formatting
  - Due dates with overdue indicators
  - Priority levels with color coding
  - Progress bars
  - Tags and labels
  - Quick action buttons (Edit, Move, Delete)

### Advanced Features

- **Search & Filters**: Global search with autocomplete suggestions
- **Multi-level Filtering**: Filter by status, brand, and date range
- **Statistics Dashboard**: Key metrics and KPIs
- **Bulk Operations**: Select multiple deals for bulk actions
- **View Modes**: Board, List, and Calendar views (Board implemented)
- **Responsive Design**: Works on desktop and mobile devices

### Add Deal Modal

- **Multi-step Form**: 3-step process for creating new deals
  - Step 1: Basic Information (name, brand, value, type, priority)
  - Step 2: Timeline & Deliverables (dates, requirements, deliverables)
  - Step 3: Contact & Notes (primary/secondary contacts, tags, notes, attachments)
- **Form Validation**: Comprehensive validation with Zod schema
- **Progress Indicator**: Visual progress through form steps
- **Draft Saving**: Save incomplete forms as drafts

## 🛠 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns and react-day-picker
- **Icons**: Lucide React

## 📦 Components Architecture

### Core Components

- `LoginPage`: Authentication interface
- `Dashboard`: Main application layout
- `TopNavigation`: Header with search, filters, and user menu
- `DashboardStatsBar`: Key metrics display
- `KanbanColumnComponent`: Individual kanban columns
- `DealCard`: Individual deal cards
- `AddDealModal`: Multi-step deal creation form

### UI Components (shadcn/ui)

- Card, Button, Input, Label, Form
- Alert, Avatar, Badge, Breadcrumb
- Calendar, Dialog, Dropdown Menu
- Select, Separator, Checkbox
- Radio Group, Textarea, Progress
- Scroll Area, Popover, Command
- Navigation Menu, Toggle Group

## 🗂 Project Structure

```
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard page
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Login page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── add-deal-modal.tsx   # Deal creation modal
│   ├── dashboard.tsx        # Main dashboard
│   ├── dashboard-stats.tsx  # Statistics bar
│   ├── deal-card.tsx        # Deal card component
│   ├── kanban-column.tsx    # Kanban column
│   └── login-page.tsx       # Login component
├── lib/
│   ├── api/
│   │   └── client.ts        # API client
│   ├── kanban-context.tsx   # Kanban state management
│   ├── mock-data.ts         # Mock data
│   ├── types.ts             # TypeScript types
│   └── utils.ts             # Utility functions
└── backend/
    ├── src/                 # NestJS source code
    ├── prisma/              # Database schema
    └── package.json         # Backend dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Quick Start (Recommended)

The easiest way to start the application is using the provided startup scripts:

#### Option 1: Cross-platform (Works on all systems)
```bash
npm run start:all
```

#### Option 2: Platform-specific scripts
- **macOS/Linux**: `./start.sh` or `npm run start:unix`
- **Windows**: `start.bat` or `npm run start:windows`

These scripts will automatically:
- Check prerequisites
- Install all dependencies
- Set up environment files
- Initialize the database
- Seed the demo user account
- Start both frontend and backend servers

### Manual Installation

If you prefer to set up manually:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd youtube-sponsorship-workflow
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up the database**
   ```bash
   # In the backend directory
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the backend server**
   ```bash
   # In the backend directory
   npm run start:dev
   ```

6. **Start the frontend development server**
   ```bash
   # In the root directory
   npm run dev
   ```

7. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`
   - The backend API will be running on `http://localhost:3001`

### 🔐 Login Credentials

Use the following demo account to log in:

- **Email**: `demo@example.com`
- **Password**: `demo123`

> **Note**: The signup functionality has been disabled. Only the seeded demo account can be used for authentication.

## 🎨 Design Features

### Color-Coded Stages

Each kanban column has a unique color scheme:

- **Prospecting**: Blue
- **Initial Contact**: Yellow
- **Negotiation**: Orange
- **Contract Sent**: Purple
- **Contract Signed**: Indigo
- **Content Creation**: Green
- **Content Review**: Teal
- **Published**: Emerald
- **Completed**: Gray

### Priority Indicators

- **Urgent**: Red with alert circle icon
- **High**: Orange with warning triangle icon
- **Medium**: Yellow with clock icon
- **Low**: Green with check circle icon

### Responsive Design

- Mobile-first approach
- Horizontal scrolling for kanban board on mobile
- Collapsible navigation elements
- Touch-friendly interface

## 🚀 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   ```

3. **Open Application**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

4. **Login**
   Use any email/password combination or click social login buttons

5. **Explore Features**
   - View the kanban board with sample deals
   - Try adding a new deal using the "Add Deal" button
   - Use search and filters to find specific deals
   - Test bulk operations by selecting multiple deals

## 📱 Usage Guide

### Adding a New Deal

1. Click "Add Deal" button in the top navigation
2. Fill out the 3-step form:
   - Basic information (required fields marked with \*)
   - Timeline and deliverables
   - Contact information and notes
3. Click "Create Deal" to add to the board

### Managing Deals

- **Edit**: Click the edit icon on any deal card
- **Move**: Drag deals between columns or use the move button
- **Delete**: Click the delete icon to remove a deal
- **Bulk Actions**: Select multiple deals for bulk operations

### Filtering and Search

- **Global Search**: Type in the search bar to find deals by name or brand
- **Status Filter**: Filter deals by their current stage
- **Brand Filter**: Show deals from specific brands only
- **Date Range**: Filter by due date ranges
- **Clear Filters**: Remove all active filters

## 🔧 Customization

### Adding New Stages

1. Update the `KanbanStage` type in `lib/types.ts`
2. Add the new stage to `kanbanColumns` in `lib/mock-data.ts`
3. Update color schemes in `KanbanColumnComponent`

### Modifying Deal Fields

1. Update the `Deal` interface in `lib/types.ts`
2. Modify the form schema in `AddDealModal`
3. Update the `DealCard` component to display new fields

### Styling Changes

- Modify Tailwind classes in components
- Update color schemes in `getColumnColor` and `getBadgeColor` functions
- Customize the global styles in `app/globals.css`

## 🎯 Implementation Status

✅ **Completed Features**

- Login page with validation
- Dashboard with kanban board
- Deal cards with all information
- Add deal modal with multi-step form
- Search and filtering
- Statistics dashboard
- Responsive design
- TypeScript implementation
- shadcn/ui integration

🚧 **Future Enhancements**

- Real authentication system
- Database integration
- Drag and drop functionality
- List and calendar views
- File upload functionality
- Email notifications
- Export functionality
- User management
- Real-time updates

## 📄 License

This project is built as a demonstration of modern React/Next.js development practices using shadcn/ui components.

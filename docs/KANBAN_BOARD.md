# Kanban Board

## Overview

The Kanban board provides a visual workflow management system for tracking YouTube sponsorship deals through various stages. It offers a traditional drag-and-drop interface for managing deals independently of Gmail data.

## Features

### 9-Stage Workflow

1. **Prospecting** - Potential sponsors identified
2. **Initial Contact** - First outreach made
3. **Negotiation** - Terms being discussed
4. **Contract Sent** - Agreement sent for review
5. **Contract Signed** - Deal confirmed
6. **Content Creation** - Creating sponsored content
7. **Content Review** - Sponsor reviewing content
8. **Published** - Content is live
9. **Completed** - Deal finished, payment received

### Deal Cards

Each deal card displays:

- Company/Brand name
- Deal value with currency
- Due date with overdue indicators
- Priority level (Low, Medium, High, Urgent)
- Progress bar
- Custom tags
- Quick actions menu

### Drag & Drop

- Smooth drag and drop between columns
- Visual feedback during dragging
- Automatic card reordering
- Mobile-friendly touch support

## User Interface

### Dashboard Toggle

Switch between Gmail and Kanban views:

```
[Gmail View] [Kanban View]
```

### Column Layout

```
┌─────────────┬─────────────┬─────────────┐
│ Prospecting │   Initial   │ Negotiation │
│             │   Contact   │             │
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │
│ │ Deal 1  │ │ │ Deal 3  │ │ │ Deal 5  │ │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │
│ ┌─────────┐ │             │             │
│ │ Deal 2  │ │             │             │
│ └─────────┘ │             │             │
└─────────────┴─────────────┴─────────────┘
```

### Deal Card Structure

```
┌─────────────────────────┐
│ Brand Name        ⋮     │
├─────────────────────────┤
│ 💰 $5,000              │
│ 📅 Due: Jan 15         │
│ 🔴 High Priority       │
│ ▓▓▓▓▓▓░░░░ 60%        │
│ #youtube #tech         │
└─────────────────────────┘
```

## Components

### Main Components

- `dashboard.tsx` - Main kanban board container
- `kanban-column.tsx` - Individual column component
- `deal-card.tsx` - Deal card component
- `add-deal-modal.tsx` - Modal for adding deals
- `edit-deal-modal.tsx` - Modal for editing deals

### State Management

- Uses React Context (`kanban-context.tsx`)
- Local state with mock data
- Drag and drop via @dnd-kit

## Usage

### Adding a Deal

1. Click "Add Deal" button
2. Fill in deal details:
   - Company name
   - Deal value
   - Due date
   - Priority
   - Initial stage
3. Click "Create Deal"

### Moving Deals

1. Click and hold a deal card
2. Drag to desired column
3. Release to drop

### Editing Deals

1. Click the menu (⋮) on a deal card
2. Select "Edit"
3. Update details
4. Save changes

### Deleting Deals

1. Click the menu (⋮) on a deal card
2. Select "Delete"
3. Confirm deletion

## Mock Data

Currently uses mock data from `lib/mock-data.ts`:

```typescript
export const mockDeals = [
  {
    id: "1",
    title: "TechCorp Sponsorship",
    value: 5000,
    currency: "USD",
    dueDate: "2024-02-15",
    priority: "high",
    stage: "negotiation",
    tags: ["youtube", "tech"],
    progress: 60,
  },
  // ... more deals
];
```

## Customization

### Adding New Stages

Edit the `STAGES` constant in `dashboard.tsx`:

```typescript
const STAGES = [
  { id: "prospecting", title: "Prospecting" },
  { id: "initial-contact", title: "Initial Contact" },
  // Add new stage here
];
```

### Styling

- Uses Tailwind CSS classes
- Theme colors from CSS variables
- Responsive design included

### Priority Levels

```typescript
type Priority = "low" | "medium" | "high" | "urgent";
```

Each priority has associated colors:

- Low: Blue
- Medium: Yellow
- High: Orange
- Urgent: Red

## Future Enhancements

### Planned Features

1. **Gmail Integration**

   - Create deals from emails
   - Link emails to deals
   - Auto-update based on email activity

2. **Persistence**

   - Save to localStorage
   - Export/import functionality
   - Cloud sync options

3. **Analytics**

   - Deal pipeline metrics
   - Revenue forecasting
   - Performance tracking

4. **Automation**
   - Auto-move based on dates
   - Email notifications
   - Recurring deals

### Possible Improvements

1. Custom fields for deals
2. Multiple boards/workspaces
3. Team collaboration features
4. Calendar integration
5. Mobile app

## Best Practices

### Performance

- Virtualize long lists
- Lazy load deal details
- Optimize drag animations

### Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast mode

### User Experience

- Clear visual feedback
- Undo/redo functionality
- Bulk operations
- Search and filter

## Limitations

### Current Limitations

1. No data persistence (mock data only)
2. No real Gmail integration yet
3. Limited to predefined stages
4. No collaboration features

### Technical Constraints

- Client-side only
- No backend API
- Limited to browser storage
- No real-time updates

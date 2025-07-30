# Design System Guide

## YouTube Sponsorship Workflow - Design System

This document outlines the design system used throughout the YouTube Sponsorship Workflow application, including colors, typography, spacing, and component styling guidelines.

## 🎨 Color Palette

### Brand Colors

```css
/* Primary Colors */
--primary: 222.2 47.4% 11.2%; /* Dark blue - primary actions */
--primary-foreground: 210 40% 98%; /* Light text on primary */

/* Secondary Colors */
--secondary: 210 40% 96.1%; /* Light gray - secondary elements */
--secondary-foreground: 222.2 47.4% 11.2%;

/* Accent Colors */
--accent: 210 40% 96.1%; /* Accent elements */
--accent-foreground: 222.2 47.4% 11.2%;
```

### Workflow Stage Colors

Each kanban stage has a unique color scheme:

```typescript
const stageColors = {
  prospecting: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    hover: "hover:bg-blue-100",
  },
  initial_contact: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    hover: "hover:bg-yellow-100",
  },
  negotiation: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    hover: "hover:bg-orange-100",
  },
  contract_sent: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    hover: "hover:bg-purple-100",
  },
  contract_signed: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    hover: "hover:bg-indigo-100",
  },
  content_creation: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    hover: "hover:bg-green-100",
  },
  content_review: {
    bg: "bg-teal-50",
    border: "border-teal-200",
    text: "text-teal-700",
    hover: "hover:bg-teal-100",
  },
  published: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    hover: "hover:bg-emerald-100",
  },
  completed: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-700",
    hover: "hover:bg-gray-100",
  },
};
```

### Status Colors

```css
/* Success */
--success: 142.1 76.2% 36.3%; /* Green */
--success-foreground: 355.7 100% 97.3%;

/* Warning */
--warning: 47.9 95.8% 53.1%; /* Yellow */
--warning-foreground: 26 83.3% 14.1%;

/* Error/Destructive */
--destructive: 0 84.2% 60.2%; /* Red */
--destructive-foreground: 210 40% 98%;

/* Info */
--info: 199 89% 48%; /* Blue */
--info-foreground: 210 40% 98%;
```

### Priority Colors

```typescript
const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};
```

## 📐 Typography

### Font Family

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
```

### Font Sizes

```css
/* Headings */
--text-4xl: 2.25rem; /* 36px - Page titles */
--text-3xl: 1.875rem; /* 30px - Section headers */
--text-2xl: 1.5rem; /* 24px - Card titles */
--text-xl: 1.25rem; /* 20px - Subsection headers */
--text-lg: 1.125rem; /* 18px - Large body text */

/* Body */
--text-base: 1rem; /* 16px - Default body text */
--text-sm: 0.875rem; /* 14px - Small text */
--text-xs: 0.75rem; /* 12px - Tiny text, labels */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Typography Classes

```typescript
// Heading styles
<h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
<h2 className="text-3xl font-semibold">Sponsorship Deals</h2>
<h3 className="text-2xl font-semibold">Deal Details</h3>

// Body text
<p className="text-base text-muted-foreground">Description text</p>
<span className="text-sm text-gray-600">Secondary information</span>

// Labels
<label className="text-sm font-medium">Field Label</label>
```

## 📏 Spacing System

### Base Unit

The spacing system is based on a 4px grid:

```css
/* Spacing Scale */
--space-0: 0; /* 0px */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem; /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem; /* 24px */
--space-8: 2rem; /* 32px */
--space-10: 2.5rem; /* 40px */
--space-12: 3rem; /* 48px */
--space-16: 4rem; /* 64px */
```

### Common Spacing Patterns

```typescript
// Card spacing
<Card className="p-6 space-y-4">

// Form spacing
<form className="space-y-6">
  <div className="space-y-2">
    <Label />
    <Input />
  </div>
</form>

// Button group spacing
<div className="flex gap-3">
  <Button />
  <Button />
</div>

// Section spacing
<section className="py-8 px-6">
```

## 🎯 Component Styling

### Cards

```typescript
// Default card
<Card className="border bg-card text-card-foreground shadow-sm">

// Hover effect card
<Card className="transition-shadow hover:shadow-lg">

// Colored card (stage-specific)
<Card className="bg-blue-50 border-blue-200">
```

### Buttons

```typescript
// Primary button
<Button>Primary Action</Button>

// Secondary button
<Button variant="outline">Secondary Action</Button>

// Destructive button
<Button variant="destructive">Delete</Button>

// Ghost button (icon buttons)
<Button variant="ghost" size="icon">
  <Icon className="h-4 w-4" />
</Button>

// Button sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### Forms

```typescript
// Form field structure
<div className="space-y-2">
  <Label htmlFor="field">Field Label</Label>
  <Input id="field" placeholder="Enter value" />
  <p className="text-sm text-muted-foreground">
    Helper text for the field.
  </p>
</div>

// Form validation states
<Input className="border-red-500" /> // Error
<p className="text-sm text-red-600">Error message</p>
```

### Badges

```typescript
// Status badges
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>

// Custom colored badges
<Badge className="bg-green-100 text-green-800">Success</Badge>
<Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
```

## 🌗 Dark Mode Support

The design system supports dark mode through CSS variables:

```css
/* Light mode (default) */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

/* Dark mode */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

### Dark Mode Classes

```typescript
// Automatic dark mode support
<Card className="bg-background text-foreground">

// Conditional dark mode styling
<div className="bg-white dark:bg-gray-900">
```

## 📱 Responsive Design

### Breakpoints

```css
/* Tailwind default breakpoints */
--screen-sm: 640px; /* Small devices */
--screen-md: 768px; /* Medium devices */
--screen-lg: 1024px; /* Large devices */
--screen-xl: 1280px; /* Extra large devices */
--screen-2xl: 1536px; /* 2X large devices */
```

### Responsive Patterns

```typescript
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">

// Responsive visibility
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
```

## 🎭 Animation & Transitions

### Transition Classes

```css
/* Default transitions */
transition-all       /* All properties */
transition-colors    /* Color changes */
transition-shadow    /* Shadow changes */
transition-transform /* Transform changes */

/* Duration */
duration-150        /* 150ms */
duration-200        /* 200ms */
duration-300        /* 300ms */

/* Easing */
ease-in-out         /* Default easing */
ease-in            /* Accelerate */
ease-out           /* Decelerate */
```

### Common Animations

```typescript
// Hover effects
<Card className="transition-shadow hover:shadow-lg">

// Fade in/out
<div className="transition-opacity duration-200 opacity-0 hover:opacity-100">

// Scale on hover
<Button className="transition-transform hover:scale-105">

// Smooth color transitions
<div className="transition-colors hover:bg-gray-100">
```

## 🎪 Shadows & Elevation

```css
/* Shadow scale */
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Elevation Patterns

```typescript
// Card elevation
<Card className="shadow-sm hover:shadow-md transition-shadow">

// Modal/Dialog elevation
<DialogContent className="shadow-xl">

// Dropdown elevation
<DropdownMenuContent className="shadow-lg">
```

## 🔤 Icon System

Using Lucide React icons:

```typescript
import {
  Edit,
  Trash,
  Move,
  Plus,
  X,
  ChevronRight,
  Calendar,
  DollarSign,
  User
} from "lucide-react"

// Icon sizes
<Icon className="h-4 w-4" />  // Small (16px)
<Icon className="h-5 w-5" />  // Medium (20px)
<Icon className="h-6 w-6" />  // Large (24px)

// Icon colors
<Icon className="text-gray-500" />
<Icon className="text-primary" />
```

## 📋 Best Practices

### 1. Consistency

- Use design tokens (CSS variables) instead of hard-coded values
- Follow the established color palette
- Maintain consistent spacing using the spacing scale

### 2. Accessibility

- Ensure sufficient color contrast (WCAG AA minimum)
- Use semantic HTML elements
- Include proper ARIA labels
- Support keyboard navigation

### 3. Performance

- Use Tailwind's purge feature in production
- Minimize custom CSS
- Leverage CSS variables for theming
- Use responsive images

### 4. Maintainability

- Follow naming conventions
- Document custom components
- Use TypeScript for type safety
- Keep styles co-located with components

---

_This design system is a living document and should be updated as the application evolves._

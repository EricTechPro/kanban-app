# Component Library Guide

## shadcn/ui Components Usage in YouTube Sponsorship Workflow

This guide documents how shadcn/ui components are used throughout the application and provides guidelines for implementing new features with the component library.

## 📚 Table of Contents

1. [Component Overview](#component-overview)
2. [Core Components](#core-components)
3. [Form Components](#form-components)
4. [Layout Components](#layout-components)
5. [Feedback Components](#feedback-components)
6. [Data Display Components](#data-display-components)
7. [Custom Implementations](#custom-implementations)
8. [Best Practices](#best-practices)

## 🎨 Component Overview

The application uses shadcn/ui as the primary component library, providing:

- Consistent design language
- Accessibility out of the box
- Customizable with Tailwind CSS
- TypeScript support
- Radix UI primitives

### Installation Pattern

```bash
npx shadcn-ui@latest add [component-name]
```

## 🔧 Core Components

### Button

Used throughout the application for actions.

```typescript
import { Button } from "@/components/ui/button"

// Primary action
<Button>Add New Deal</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete Deal</Button>

// Icon button
<Button variant="ghost" size="icon">
  <Edit className="h-4 w-4" />
</Button>
```

### Card

Used for deal cards and content containers.

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Deal Title</CardTitle>
    <CardDescription>Brand Name</CardDescription>
  </CardHeader>
  <CardContent>{/* Deal details */}</CardContent>
  <CardFooter>{/* Action buttons */}</CardFooter>
</Card>;
```

### Dialog

Used for modals throughout the application.

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Deal</DialogTitle>
      <DialogDescription>Make changes to your deal here.</DialogDescription>
    </DialogHeader>
    {/* Form content */}
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

## 📝 Form Components

### Form with React Hook Form

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const form = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    title: "",
  },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Deal Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter deal title" {...field} />
          </FormControl>
          <FormDescription>
            This is the name of your sponsorship deal.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Select

Used for dropdowns and stage selection.

```typescript
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select value={stage} onValueChange={setStage}>
  <SelectTrigger>
    <SelectValue placeholder="Select a stage" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Workflow Stages</SelectLabel>
      <SelectItem value="prospecting">Prospecting</SelectItem>
      <SelectItem value="negotiation">Negotiation</SelectItem>
      <SelectItem value="completed">Completed</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>;
```

### Calendar

Used for date selection in deal forms.

```typescript
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon className="mr-2 h-4 w-4" />
      {date ? format(date, "PPP") : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
  </PopoverContent>
</Popover>;
```

## 🏗️ Layout Components

### ScrollArea

Used for scrollable content areas.

```typescript
import { ScrollArea } from "@/components/ui/scroll-area";

<ScrollArea className="h-[600px] w-full">
  {/* Scrollable content */}
</ScrollArea>;
```

### Separator

Used to divide sections.

```typescript
import { Separator } from "@/components/ui/separator";

<div>
  <h4>Section 1</h4>
  <Separator className="my-4" />
  <h4>Section 2</h4>
</div>;
```

### Tabs

Used for multi-step forms or views.

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="overview" className="w-full">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">{/* Overview content */}</TabsContent>
  <TabsContent value="details">{/* Details content */}</TabsContent>
</Tabs>;
```

## 💬 Feedback Components

### Alert

Used for notifications and messages.

```typescript
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You have unsaved changes. Save before leaving?
  </AlertDescription>
</Alert>;
```

### Toast

Used for temporary notifications.

```typescript
import { useToast } from "@/components/ui/use-toast";

const { toast } = useToast();

toast({
  title: "Deal created",
  description: "Your sponsorship deal has been created successfully.",
});
```

### Progress

Used to show completion status.

```typescript
import { Progress } from "@/components/ui/progress";

<Progress value={progress} className="w-full" />;
```

## 📊 Data Display Components

### Badge

Used for status indicators and tags.

```typescript
import { Badge } from "@/components/ui/badge"

// Priority badges
<Badge variant="destructive">Urgent</Badge>
<Badge variant="secondary">Medium</Badge>
<Badge variant="outline">Low</Badge>

// Status badges
<Badge className="bg-green-100 text-green-800">Active</Badge>
<Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
```

### Avatar

Used for user profiles and brand logos.

```typescript
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

<Avatar>
  <AvatarImage src={user.image} alt={user.name} />
  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
</Avatar>;
```

### DropdownMenu

Used for action menus and user menus.

```typescript
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleEdit}>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>
      <Trash className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

## 🎯 Custom Implementations

### Deal Card Component

Combines multiple shadcn/ui components:

```typescript
export function DealCard({ deal }: DealCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{deal.title}</CardTitle>
            <CardDescription>{deal.brand}</CardDescription>
          </div>
          <Badge variant={getPriorityVariant(deal.priority)}>
            {deal.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <DollarSign className="mr-2 h-4 w-4" />
            {formatCurrency(deal.value)}
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            {format(deal.dueDate, "PPP")}
          </div>
          <Progress value={deal.progress} />
        </div>
      </CardContent>
      <CardFooter className="opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Move className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Kanban Column Component

Custom implementation using shadcn/ui:

```typescript
export function KanbanColumn({ stage, deals }: KanbanColumnProps) {
  return (
    <Card className={cn("w-80", getStageStyles(stage))}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{getStageTitle(stage)}</CardTitle>
          <Badge variant="secondary">{deals.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </ScrollArea>
        <Button variant="dashed" className="w-full mt-3">
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 📋 Best Practices

### 1. Component Composition

Compose complex components from primitives:

```typescript
// Good: Composed from primitives
function DealActions({ deal }: { deal: Deal }) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm">
        <Move className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Avoid: Overly complex single component
```

### 2. Consistent Styling

Use the `cn` utility for conditional classes:

```typescript
import { cn } from "@/lib/utils"

<Card className={cn(
  "transition-all",
  isActive && "ring-2 ring-primary",
  isDragging && "opacity-50"
)}>
```

### 3. Accessibility

Always include proper ARIA labels:

```typescript
<Button variant="ghost" size="icon" aria-label="Edit deal">
  <Edit className="h-4 w-4" />
</Button>
```

### 4. Type Safety

Define proper TypeScript interfaces:

```typescript
interface DealCardProps {
  deal: Deal;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}
```

### 5. Performance

Use React.memo for expensive components:

```typescript
export const DealCard = React.memo(({ deal }: DealCardProps) => {
  // Component implementation
});
```

## 🔗 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Component Examples](https://ui.shadcn.com/examples)

---

_This guide is maintained alongside the component library updates._

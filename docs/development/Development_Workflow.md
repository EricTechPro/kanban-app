# Development Workflow Guide

## 🚀 Development Best Practices

This guide outlines the recommended development workflow and best practices for working with the YouTube Sponsorship Workflow Kanban Board application.

## 📋 Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Git Workflow](#git-workflow)
3. [Code Style Guidelines](#code-style-guidelines)
4. [Component Development](#component-development)
5. [Testing Strategy](#testing-strategy)
6. [Debugging Tips](#debugging-tips)
7. [Performance Optimization](#performance-optimization)
8. [Deployment Process](#deployment-process)

## 🛠️ Development Environment Setup

### Recommended IDE Setup

**VS Code** with the following extensions:

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prisma
- GitLens
- Auto Rename Tag
- Path Intellisense

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 🌿 Git Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/email-integration`)
- `fix/` - Bug fixes (e.g., `fix/drag-drop-mobile`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Example:

```
feat(kanban): add bulk operations for deal management

- Implement multi-select functionality
- Add bulk move and delete actions
- Update UI to show selection state

Closes #123
```

### Pull Request Process

1. Create feature branch from `main`
2. Make changes following code guidelines
3. Write/update tests
4. Update documentation if needed
5. Create PR with descriptive title and description
6. Ensure all checks pass
7. Request review from team members
8. Address feedback
9. Merge after approval

## 💻 Code Style Guidelines

### TypeScript

```typescript
// Use explicit types for function parameters and return values
function calculateDealValue(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`;
}

// Use interfaces for object shapes
interface Deal {
  id: string;
  title: string;
  value: number;
  stage: KanbanStage;
}

// Use enums for constants
enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

// Use const assertions for literal types
const STAGES = ["prospecting", "negotiation", "completed"] as const;
type Stage = (typeof STAGES)[number];
```

### React Components

```typescript
// Use function components with TypeScript
interface DealCardProps {
  deal: Deal;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DealCard({ deal, onEdit, onDelete }: DealCardProps) {
  // Component logic
}

// Use custom hooks for reusable logic
function useDeals(stage: KanbanStage) {
  const { deals } = useKanban();
  return deals[stage] || [];
}
```

### File Organization

```
components/
├── ui/                    # shadcn/ui components
├── deal-card.tsx         # Component file
├── deal-card.test.tsx    # Test file
└── deal-card.stories.tsx # Storybook file (if using)
```

## 🧩 Component Development

### Creating New Components

1. **Plan the Component**

   - Define props interface
   - Identify reusable parts
   - Consider accessibility

2. **Implement with shadcn/ui**

   ```bash
   npx shadcn-ui@latest add [component-name]
   ```

3. **Follow Component Structure**

   ```typescript
   import { cn } from "@/lib/utils";

   interface ComponentProps {
     className?: string;
     children: React.ReactNode;
   }

   export function Component({ className, children }: ComponentProps) {
     return <div className={cn("default-styles", className)}>{children}</div>;
   }
   ```

### State Management

- Use React Context for global state (KanbanContext)
- Use local state for component-specific state
- Use React Query/SWR for server state (future enhancement)

## 🧪 Testing Strategy

### Unit Tests

```typescript
// Example test for DealCard component
import { render, screen } from "@testing-library/react";
import { DealCard } from "./deal-card";

describe("DealCard", () => {
  it("displays deal information correctly", () => {
    const deal = {
      id: "1",
      title: "Test Deal",
      value: 5000,
      brand: "Test Brand",
    };

    render(<DealCard deal={deal} />);

    expect(screen.getByText("Test Deal")).toBeInTheDocument();
    expect(screen.getByText("$5,000")).toBeInTheDocument();
  });
});
```

### Integration Tests

Test complete user flows:

- Login → Dashboard → Create Deal → Move Deal → Complete Deal

### E2E Tests (Future)

Using Playwright or Cypress for full application testing

## 🐛 Debugging Tips

### Frontend Debugging

1. **React Developer Tools**

   - Inspect component props and state
   - Profile performance
   - Track re-renders

2. **Console Debugging**

   ```typescript
   console.log("Deal state:", { deal, stage });
   console.table(deals);
   console.time("DragOperation");
   // ... operation
   console.timeEnd("DragOperation");
   ```

3. **Network Debugging**
   - Use browser DevTools Network tab
   - Monitor API calls
   - Check request/response payloads

### Backend Debugging

1. **NestJS Logger**

   ```typescript
   import { Logger } from "@nestjs/common";

   export class DealsService {
     private readonly logger = new Logger(DealsService.name);

     async createDeal(data: CreateDealDto) {
       this.logger.debug("Creating deal:", data);
       // ... logic
     }
   }
   ```

2. **Prisma Logging**
   ```typescript
   const prisma = new PrismaClient({
     log: ["query", "info", "warn", "error"],
   });
   ```

## ⚡ Performance Optimization

### Frontend Optimization

1. **Component Memoization**

   ```typescript
   import { memo } from "react";

   export const DealCard = memo(({ deal }: DealCardProps) => {
     // Component logic
   });
   ```

2. **Lazy Loading**

   ```typescript
   const EditDealModal = lazy(() => import("./edit-deal-modal"));
   ```

3. **Image Optimization**
   - Use Next.js Image component
   - Implement lazy loading
   - Use appropriate formats (WebP, AVIF)

### Backend Optimization

1. **Database Queries**

   - Use Prisma's `select` to fetch only needed fields
   - Implement pagination for large datasets
   - Use database indexes appropriately

2. **Caching Strategy**
   - Implement Redis for session storage
   - Cache frequently accessed data
   - Use HTTP caching headers

## 🚀 Deployment Process

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Performance testing completed
- [ ] Security audit performed

### Deployment Steps

1. **Build Applications**

   ```bash
   # Frontend
   npm run build

   # Backend
   cd backend
   npm run build
   ```

2. **Run Database Migrations**

   ```bash
   npx prisma migrate deploy
   ```

3. **Deploy to Production**
   - Use CI/CD pipeline
   - Deploy backend first
   - Deploy frontend
   - Verify deployment

### Post-deployment

- Monitor error logs
- Check performance metrics
- Verify all features working
- Monitor user feedback

## 📚 Additional Resources

### Documentation

- [Project README](../../README.md)
- [API Documentation](../../backend/API_DOCUMENTATION.md)
- [Setup Guide](../setup/Setup_Guide.md)

### External Resources

- [Next.js Best Practices](https://nextjs.org/docs)
- [NestJS Techniques](https://docs.nestjs.com/techniques)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

When contributing to this project:

1. Follow the code style guidelines
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation
5. Participate in code reviews
6. Be respectful and constructive

---

_This document is maintained by the development team and should be updated as practices evolve._

import { Dashboard } from "@/components/dashboard";
import { KanbanProvider } from "@/lib/kanban-context";

export default function DashboardPage() {
  return (
    <KanbanProvider>
      <Dashboard />
    </KanbanProvider>
  );
}

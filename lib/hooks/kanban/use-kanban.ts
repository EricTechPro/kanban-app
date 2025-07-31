import { useContext } from 'react';
import { KanbanContext, KanbanContextType } from '@/lib/kanban-context';

export function useKanban(): KanbanContextType {
  const context = useContext(KanbanContext);
  
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  
  return context;
}
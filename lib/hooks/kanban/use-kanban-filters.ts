import { useState, useCallback } from 'react';
import { Deal, FilterOptions, SortOptions } from '@/lib/types';

interface UseKanbanFiltersReturn {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  sortOptions: SortOptions;
  setSortOptions: React.Dispatch<React.SetStateAction<SortOptions>>;
  filterDeals: (deals: Deal[]) => Deal[];
  sortDeals: (deals: Deal[]) => Deal[];
  resetFilters: () => void;
}

const initialFilters: FilterOptions = {
  stages: [],
  priorities: [],
  dealTypes: [],
  tags: [],
  dateRange: undefined,
  search: '',
};

const initialSort: SortOptions = {
  field: 'dueDate',
  direction: 'asc',
};

export function useKanbanFilters(): UseKanbanFiltersReturn {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [sortOptions, setSortOptions] = useState<SortOptions>(initialSort);

  const filterDeals = useCallback((deals: Deal[]): Deal[] => {
    return deals.filter(deal => {
      // Stage filter
      if (filters.stages?.length && !filters.stages.includes(deal.stage)) {
        return false;
      }

      // Priority filter
      if (filters.priorities?.length && !filters.priorities.includes(deal.priority)) {
        return false;
      }

      // Deal type filter
      if (filters.dealTypes?.length && !filters.dealTypes.includes(deal.dealType)) {
        return false;
      }

      // Tags filter
      if (filters.tags?.length) {
        const hasMatchingTag = filters.tags.some(tag => deal.tags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const dealDate = deal.dueDate.getTime();
        const startDate = filters.dateRange.start.getTime();
        const endDate = filters.dateRange.end.getTime();
        if (dealDate < startDate || dealDate > endDate) {
          return false;
        }
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableText = `${deal.title} ${deal.brand} ${deal.notes || ''} ${deal.tags.join(' ')}`.toLowerCase();
        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const sortDeals = useCallback((deals: Deal[]): Deal[] => {
    const sorted = [...deals].sort((a, b) => {
      let comparison = 0;

      switch (sortOptions.field) {
        case 'dueDate':
          comparison = a.dueDate.getTime() - b.dueDate.getTime();
          break;
        case 'value':
          comparison = a.value - b.value;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case 'updatedAt':
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
          break;
      }

      return sortOptions.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [sortOptions]);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSortOptions(initialSort);
  }, []);

  return {
    filters,
    setFilters,
    sortOptions,
    setSortOptions,
    filterDeals,
    sortDeals,
    resetFilters,
  };
}
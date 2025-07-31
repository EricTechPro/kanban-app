import { useMemo } from 'react';
import { useKanban } from './use-kanban';
import { DashboardStats, Deal, KanbanColumn } from '@/lib/types';
import { KANBAN_STAGES } from '@/lib/constants';

export function useKanbanStats(): DashboardStats {
  const { state } = useKanban();

  return useMemo(() => {
    const allDeals = state.columns.flatMap((col: KanbanColumn) => col.deals);
    const completedDeals = allDeals.filter((deal: Deal) => deal.stage === KANBAN_STAGES.COMPLETED);
    const inProgressDeals = allDeals.filter(
      (deal: Deal) => deal.stage !== KANBAN_STAGES.COMPLETED && deal.stage !== KANBAN_STAGES.PROSPECTING
    );

    // Calculate upcoming deadlines (within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const upcomingDeadlines = allDeals.filter(
      (deal: Deal) => deal.dueDate <= sevenDaysFromNow && deal.stage !== KANBAN_STAGES.COMPLETED
    ).length;

    // Calculate average time to close for completed deals
    const avgTimeToClose = completedDeals.length > 0
      ? completedDeals.reduce((sum: number, deal: Deal) => {
        const timeToClose = deal.updatedAt.getTime() - deal.createdAt.getTime();
        return sum + timeToClose / (1000 * 60 * 60 * 24); // Convert to days
      }, 0) / completedDeals.length
      : 0;

    // Calculate total and average values
    const totalValue = allDeals.reduce((sum: number, deal: Deal) => sum + deal.value, 0);
    const avgDealValue = allDeals.length > 0 ? totalValue / allDeals.length : 0;

    // Calculate conversion rate
    const totalDealsExcludingProspecting = allDeals.filter(
      (deal: Deal) => deal.stage !== KANBAN_STAGES.PROSPECTING
    ).length;
    const conversionRate = totalDealsExcludingProspecting > 0
      ? (completedDeals.length / totalDealsExcludingProspecting) * 100
      : 0;

    return {
      totalDeals: allDeals.length,
      totalValue,
      avgDealValue,
      dealsInProgress: inProgressDeals.length,
      completedDeals: completedDeals.length,
      upcomingDeadlines,
      conversionRate,
      avgTimeToClose,
    };
  }, [state.columns]);
}
import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { GmailThread, Deal, KanbanStage } from '@/lib/types';
import { useKanban } from '../kanban/use-kanban';
import { GmailThreadConverter } from '@/lib/utils/gmail-thread-converter';

export function useGmailThreadSync() {
  const { setDeals, moveDeal, clearGmailDeals } = useKanban();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncGmailThreads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First check if Gmail is connected
      const status = await apiClient.getGmailStatus();
      if (!status.isAuthenticated) {
        const errorMsg = 'Gmail is not connected. Please connect your Gmail account first.';
        setError(errorMsg);
        console.log('[useGmailThreadSync] Gmail not connected');
        return { success: false, totalAdded: 0, error: errorMsg };
      }

      // Ensure labels exist
      await apiClient.ensureKanbanLabels();

      // Fetch all threads organized by stage
      const threadsByStage = await apiClient.getGmailThreadsByLabels();

      // Clear existing Gmail deals to avoid duplicates
      clearGmailDeals();

      // Convert threads to deals
      const allDeals: Deal[] = [];
      for (const [stage, threads] of Object.entries(threadsByStage)) {
        for (const thread of threads as GmailThread[]) {
          const deal = GmailThreadConverter.threadToDeal(thread);
          allDeals.push(deal);
        }
      }

      // Set all deals at once
      setDeals(allDeals);

      return { success: true, totalAdded: allDeals.length };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync Gmail threads';
      setError(errorMessage);
      console.error('[useGmailThreadSync] Error syncing threads:', err);
      return { success: false, totalAdded: 0, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [clearGmailDeals, setDeals]);

  const moveGmailThread = useCallback(async (
    deal: Deal,
    fromStage: KanbanStage,
    toStage: KanbanStage
  ) => {
    try {
      // Move in the UI first
      moveDeal(deal.id, fromStage, toStage);

      // If it's a Gmail deal, sync with Gmail
      if (deal.isFromGmail && deal.gmailThreadId) {
        await apiClient.moveGmailThread(
          deal.gmailThreadId,
          fromStage,
          toStage
        );
      }
    } catch (error) {
      console.error('Failed to move Gmail thread:', error);
      // Revert the move on error
      moveDeal(deal.id, toStage, fromStage);
      throw error;
    }
  }, [moveDeal]);

  return {
    syncGmailThreads,
    moveGmailThread,
    isLoading,
    error,
  };
}
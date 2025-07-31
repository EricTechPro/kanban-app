import { useCallback } from 'react';
import { apiClient } from './api/client';
import { Deal, KanbanStage } from './types';
import { useKanban } from './kanban-context';

export function useGmailSync() {
  const { moveDeal } = useKanban();

  const moveGmailDeal = useCallback(async (
    deal: Deal,
    fromStage: KanbanStage,
    toStage: KanbanStage
  ) => {
    try {
      // Move in the UI first
      moveDeal(deal.id, fromStage, toStage);

      // If it's a Gmail deal, sync with Gmail
      if (deal.isFromGmail && deal.gmailMessageId) {
        await apiClient.moveGmailEmail(
          deal.gmailMessageId,
          fromStage,
          toStage
        );
      }
    } catch (error) {
      console.error('Failed to move Gmail deal:', error);
      // Revert the move on error
      moveDeal(deal.id, toStage, fromStage);
      throw error;
    }
  }, [moveDeal]);

  const syncGmailDeals = useCallback(async () => {
    try {
      // Ensure labels exist
      await apiClient.ensureKanbanLabels();

      // Fetch Gmail deals
      const gmailDeals = await apiClient.syncGmailEmails();

      return gmailDeals;
    } catch (error) {
      console.error('Failed to sync Gmail deals:', error);
      throw error;
    }
  }, []);

  return {
    moveGmailDeal,
    syncGmailDeals,
  };
}
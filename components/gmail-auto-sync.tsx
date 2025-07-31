'use client';

import { useEffect, useState } from 'react';
import { useGmailThreadSync } from '@/lib/hooks/gmail/use-gmail-thread-sync';
import { apiClient } from '@/lib/api/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function GmailAutoSync() {
  const { syncGmailThreads, isLoading, error } = useGmailThreadSync();
  const [hasSynced, setHasSynced] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkAndSync = async () => {
      try {
        // Check if Gmail is connected
        const status = await apiClient.getGmailStatus();
        setIsConnected(status.isAuthenticated);

        // If connected and haven't synced yet, sync Gmail data
        if (status.isAuthenticated && !hasSynced) {
          console.log('[GmailAutoSync] Gmail connected, syncing threads...');
          const result = await syncGmailThreads();
          if (result.success) {
            setHasSynced(true);
            console.log(
              '[GmailAutoSync] Sync completed, added',
              result.totalAdded,
              'deals'
            );
          }
        }
      } catch (error) {
        console.error('[GmailAutoSync] Error during auto-sync:', error);
        // Don't throw the error, just log it
        // The error will be displayed by the error state
      }
    };

    checkAndSync();
  }, [hasSynced, syncGmailThreads]);

  // Show error if any
  if (error && isConnected) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to sync Gmail data: {error}</AlertDescription>
      </Alert>
    );
  }

  // Show loading indicator while syncing
  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Syncing Gmail data...</span>
      </div>
    );
  }

  return null;
}

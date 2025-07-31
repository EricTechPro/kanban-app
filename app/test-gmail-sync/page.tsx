'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGmailThreadSync } from '@/lib/hooks/gmail/use-gmail-thread-sync';
import { useKanban } from '@/lib/hooks/kanban/use-kanban';
import { KanbanColumn } from '@/lib/types';

export default function TestGmailSyncPage() {
  const { syncGmailThreads, isLoading, error } = useGmailThreadSync();
  const { state } = useKanban();
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    totalAdded: number;
  } | null>(null);

  const handleSync = async () => {
    try {
      const result = await syncGmailThreads();
      setSyncResult(result);
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Gmail Thread Sync</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sync Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSync} disabled={isLoading} className="mb-4">
            {isLoading ? 'Syncing...' : 'Sync Gmail Threads'}
          </Button>

          {error && <div className="text-red-500 mb-4">Error: {error}</div>}

          {syncResult && (
            <div className="text-green-600">
              Successfully synced {syncResult.totalAdded} email threads!
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Kanban State</CardTitle>
        </CardHeader>
        <CardContent>
          {state.columns.map((column: KanbanColumn) => (
            <div key={column.id} className="mb-4">
              <h3 className="font-semibold text-lg mb-2">
                {column.title} ({column.deals.length} deals)
              </h3>
              <div className="space-y-2">
                {column.deals.map((deal) => (
                  <div key={deal.id} className="p-2 bg-gray-100 rounded">
                    <div className="font-medium">{deal.title}</div>
                    <div className="text-sm text-gray-600">
                      {deal.brand} -{' '}
                      {deal.isFromGmail
                        ? `Gmail Thread (${deal.emailCount} emails)`
                        : 'Manual Deal'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

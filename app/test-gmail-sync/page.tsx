'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GmailThread, KanbanStage } from '@/lib/types';

// Using the same type as apiClient.getGmailStatus() returns
type GmailStatus = {
  isAuthenticated: boolean;
  email?: string;
};

// Using the same structure as the /api/gmail/threads endpoint returns
type ThreadsResponse = {
  threads: GmailThread[];
  total: number;
};

// Using the same type as apiClient.getGmailThreadsByLabels() returns
type ThreadsByLabels = Record<KanbanStage, GmailThread[]>;

export default function TestGmailSyncPage() {
  const [status, setStatus] = useState<GmailStatus | null>(null);
  const [threads, setThreads] = useState<ThreadsResponse | null>(null);
  const [threadsByLabels, setThreadsByLabels] =
    useState<ThreadsByLabels | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/gmail/status');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setError('Failed to check status');
    } finally {
      setLoading(false);
    }
  };

  const fetchThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/gmail/threads');
      const data = await response.json();
      setThreads(data);
    } catch (err) {
      setError('Failed to fetch threads');
    } finally {
      setLoading(false);
    }
  };

  const fetchThreadsByLabels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/gmail/threads/by-labels');
      const data = await response.json();
      setThreadsByLabels(data);
    } catch (err) {
      setError('Failed to fetch threads by labels');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Gmail Sync Debug</h1>

      <div className="flex gap-4">
        <Button onClick={checkStatus} disabled={loading}>
          Check Gmail Status
        </Button>
        <Button onClick={fetchThreads} disabled={loading}>
          Fetch All Threads
        </Button>
        <Button onClick={fetchThreadsByLabels} disabled={loading}>
          Fetch Threads by Labels
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {status && (
        <Card>
          <CardHeader>
            <CardTitle>Gmail Status</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm">{JSON.stringify(status, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {threads && (
        <Card>
          <CardHeader>
            <CardTitle>All Threads</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total threads: {threads.threads?.length || 0}</p>
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(threads, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {threadsByLabels && (
        <Card>
          <CardHeader>
            <CardTitle>Threads by Labels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(threadsByLabels).map(([stage, stageThreads]) => (
                <div key={stage}>
                  <strong>{stage}:</strong> {stageThreads.length} threads
                </div>
              ))}
            </div>
            <pre className="text-sm overflow-auto max-h-96 mt-4">
              {JSON.stringify(threadsByLabels, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

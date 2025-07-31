'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { GmailThread } from '@/lib/types';

export default function TestGmailThreadsPage() {
  const [threads, setThreads] = useState<GmailThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getGmailThreads();
      setThreads(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch threads');
      console.error('Error fetching threads:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Gmail Threads Test</h1>
        <p>Loading threads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Gmail Threads Test</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
        <button
          onClick={fetchThreads}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Gmail Threads Test</h1>
      <p className="mb-4">Found {threads.length} threads</p>

      <div className="space-y-4">
        {threads.map((thread) => (
          <div
            key={thread.threadId}
            className="border rounded-lg p-4 bg-white shadow"
          >
            <div className="mb-2">
              <span className="font-semibold">Thread ID:</span>{' '}
              {thread.threadId}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Stage:</span> {thread.stage}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Messages:</span>{' '}
              {thread.messages.length}
            </div>

            {thread.messages.length > 0 && (
              <div className="mt-3 pl-4 border-l-2 border-gray-200">
                <h3 className="font-semibold mb-2">Latest Message:</h3>
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Subject:</span>{' '}
                    {thread.messages[thread.messages.length - 1].subject}
                  </p>
                  <p>
                    <span className="font-medium">From:</span>{' '}
                    {thread.messages[thread.messages.length - 1].from}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{' '}
                    {thread.messages[
                      thread.messages.length - 1
                    ].date.toLocaleString()}
                  </p>
                  <p className="mt-1 text-gray-600">
                    {thread.messages[thread.messages.length - 1].snippet}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={fetchThreads}
        className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Refresh
      </button>
    </div>
  );
}

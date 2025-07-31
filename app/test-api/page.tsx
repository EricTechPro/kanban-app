'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';

export default function TestApiPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testGmailStatus = async () => {
    setLoading(true);
    setResult('Testing Gmail status...');

    try {
      const status = await apiClient.getGmailStatus();
      setResult(
        `Success! Gmail authenticated: ${status.isAuthenticated}, Email: ${
          status.email || 'N/A'
        }`
      );
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>API Error Handling Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testGmailStatus} disabled={loading}>
            {loading ? 'Testing...' : 'Test Gmail Status API'}
          </Button>

          {result && (
            <div className="p-4 bg-muted rounded-md">
              <pre className="text-sm">{result}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

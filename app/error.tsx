'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    // Use console.warn to avoid Next.js error interception
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Application Error]', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription className="mt-2">
            {error.message || 'An unexpected error occurred'}
          </AlertDescription>
        </Alert>
        <Button onClick={reset} className="mt-4 w-full" variant="outline">
          Try again
        </Button>
      </div>
    </div>
  );
}

'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Authentication failed';

  useEffect(() => {
    // Send error message to parent window
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'OAUTH_ERROR',
          message: message,
        },
        window.location.origin
      );
      window.close();
    }
  }, [message]);

  const handleRetry = () => {
    if (window.opener) {
      window.close();
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Authentication Failed</CardTitle>
          <CardDescription>
            There was an error connecting your Gmail account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            <p className="font-medium">Error details:</p>
            <p className="mt-1">{message}</p>
          </div>

          {typeof window !== 'undefined' && !window.opener && (
            <Button onClick={handleRetry} className="w-full">
              Return to Dashboard
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            {typeof window !== 'undefined' && window.opener
              ? 'This window will close automatically...'
              : 'You can try connecting again from the dashboard.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <AlertCircle className="h-6 w-6 text-gray-400 animate-pulse" />
              </div>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}

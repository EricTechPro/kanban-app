'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  useEffect(() => {
    const handleCallback = async () => {
      if (error) {
        console.error('OAuth error:', error);
        router.push('/dashboard?error=auth_failed');
        return;
      }

      if (code) {
        try {
          const response = await fetch('/api/auth/gmail/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          if (response.ok) {
            // Send success message to opener window if it exists
            if (window.opener) {
              window.opener.postMessage({ type: 'gmail-auth-success' }, '*');
              window.close();
            } else {
              router.push('/dashboard?success=gmail_connected');
            }
          } else {
            throw new Error('Failed to complete authentication');
          }
        } catch (err) {
          console.error('Callback error:', err);
          router.push('/dashboard?error=callback_failed');
        }
      }
    };

    handleCallback();
  }, [code, error, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-center">
            Completing Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-center">
            Please wait while we complete your Gmail authentication...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

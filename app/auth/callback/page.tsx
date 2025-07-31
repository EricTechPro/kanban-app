'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Processing authentication...');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      console.log('[Callback] === OAuth Callback Started ===');
      console.log('[Callback] URL:', window.location.href);
      console.log(
        '[Callback] Search params:',
        Object.fromEntries(searchParams.entries())
      );

      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('[Callback] OAuth error:', error);
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => {
          router.push('/dashboard?error=oauth_error');
        }, 3000);
        return;
      }

      if (code) {
        console.log(
          '[Callback] Authorization code received:',
          code.substring(0, 10) + '...'
        );

        try {
          console.log('[Callback] Sending code to backend...');
          const response = await fetch('/api/auth/gmail/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });

          console.log('[Callback] Backend response status:', response.status);
          const data = await response.json();
          console.log('[Callback] Backend response data:', data);

          if (response.ok && data.success) {
            console.log('[Callback] Authentication successful');
            setStatus('success');
            setMessage(data.message || 'Successfully connected to Gmail!');
            setUserEmail(data.email);

            // Send success message to opener window if it exists
            if (window.opener) {
              console.log('[Callback] Sending message to opener window');
              window.opener.postMessage(
                { type: 'gmail-auth-success', email: data.email },
                '*'
              );
              setTimeout(() => {
                console.log('[Callback] Closing window');
                window.close();
              }, 2000);
            } else {
              console.log(
                '[Callback] No opener window, redirecting to dashboard'
              );
              setTimeout(() => {
                router.push('/dashboard?success=gmail_connected');
              }, 2000);
            }
          } else {
            console.error('[Callback] Authentication failed:', data);

            // Provide more specific error messages
            let errorMessage =
              data.error || 'Failed to complete authentication';
            if (data.details) {
              errorMessage += `: ${data.details}`;
            }

            // Check for specific error types
            if (data.error === 'OAuth configuration error') {
              console.error('[Callback] OAuth configuration issue detected');
              console.error('[Callback] Please verify:');
              console.error('1. Google OAuth credentials in .env.local');
              console.error(
                '2. Redirect URI in Google Console matches:',
                window.location.origin + '/auth/callback'
              );
              console.error('3. OAuth app is enabled in Google Console');
            }

            throw new Error(errorMessage);
          }
        } catch (err) {
          console.error('[Callback] Error during authentication:', err);
          console.error('[Callback] Error details:', {
            name: err instanceof Error ? err.name : 'Unknown',
            message: err instanceof Error ? err.message : 'Unknown error',
            stack: err instanceof Error ? err.stack : 'No stack trace',
          });

          // Set a user-friendly error message
          let displayMessage =
            err instanceof Error
              ? err.message
              : 'Failed to complete authentication';

          // Add helpful hints for common errors
          if (displayMessage.includes('OAuth configuration error')) {
            displayMessage +=
              '\n\nPlease check your Google OAuth setup in the Google Cloud Console.';
          } else if (
            displayMessage.includes('NetworkError') ||
            displayMessage.includes('Failed to fetch')
          ) {
            displayMessage =
              'Network error: Unable to connect to the authentication server. Please check your internet connection and try again.';
          }

          setStatus('error');
          setMessage(displayMessage);

          setTimeout(() => {
            router.push('/dashboard?error=auth_failed');
          }, 5000); // Give more time to read the error
        }
      } else {
        console.error('[Callback] No authorization code received');
        setStatus('error');
        setMessage(
          'No authorization code received from Google. Please try again.'
        );
        setTimeout(() => {
          router.push('/dashboard?error=no_code');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {status === 'loading' && 'Connecting to Gmail'}
            {status === 'success' && 'Successfully Connected!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
          <CardDescription className="text-center">
            {status === 'loading' &&
              'Please wait while we complete the authentication...'}
            {status === 'success' && userEmail && `Connected as ${userEmail}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'loading' && (
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          )}
          {status === 'success' && (
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          )}
          {status === 'error' && <XCircle className="h-12 w-12 text-red-500" />}

          <p className="text-center text-sm text-gray-600 whitespace-pre-wrap">
            {message}
          </p>

          {status !== 'loading' && (
            <p className="text-xs text-gray-500 text-center">
              {status === 'success'
                ? 'Redirecting...'
                : 'Redirecting back to dashboard...'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center space-y-4 p-8">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <p className="text-center text-sm text-gray-600">Loading...</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

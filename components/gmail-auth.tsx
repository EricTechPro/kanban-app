'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  AlertCircle,
  Mail,
  Loader2,
  RefreshCw,
  Unplug,
} from 'lucide-react';

interface GmailAuthProps {
  onAuthSuccess?: (token: string) => void;
  onAuthError?: (error: string) => void;
  onStatusChange?: (connected: boolean) => void;
}

interface AuthStatus {
  connected: boolean;
  email?: string;
  tokenExpiry?: string;
  needsRefresh?: boolean;
}

export function GmailAuth({
  onAuthSuccess,
  onAuthError,
  onStatusChange,
}: GmailAuthProps) {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    connected: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Clear messages after timeout
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Constants for retry logic
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  const checkAuthStatus = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('jwt_token');
      if (!token) {
        setAuthStatus({ connected: false });
        return;
      }

      const response = await fetch('/api/auth/gmail/status', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAuthStatus({
          connected: data.isConnected || data.connected,
          email: data.email,
          tokenExpiry: data.expiresAt || data.tokenExpiry,
          needsRefresh: data.needsRefresh,
        });
        setRetryCount(0); // Reset retry count on success
      } else if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('jwt_token');
        setAuthStatus({ connected: false });
        setError('Session expired. Please reconnect.');
      } else {
        throw new Error(`Status check failed: ${response.status}`);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      setError('Failed to check connection status');

      // Implement retry logic
      if (retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1);
        setTimeout(() => {
          checkAuthStatus();
        }, RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, retryCount]);

  // Check auth status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Notify parent of status changes
  useEffect(() => {
    onStatusChange?.(authStatus.connected);
  }, [authStatus.connected, onStatusChange]);

  const initiateGmailAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      // Get OAuth URL from backend
      const response = await fetch('/api/auth/gmail/auth-url');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to get OAuth URL: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!data.authUrl) {
        throw new Error('No OAuth URL received from server');
      }

      // Open OAuth popup window
      const popup = window.open(
        data.authUrl,
        'gmail-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes,location=yes'
      );

      if (!popup) {
        throw new Error(
          'Failed to open OAuth popup. Please allow popups for this site.'
        );
      }

      // Monitor popup for closure
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsLoading(false);
          // Check if auth was successful after popup closes
          setTimeout(() => {
            checkAuthStatus();
          }, 1000);
        }
      }, 1000);

      // Handle OAuth success/error messages
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        clearInterval(checkClosed);
        popup?.close();
        setIsLoading(false);

        if (event.data.type === 'OAUTH_SUCCESS') {
          setSuccess('Gmail account connected successfully!');
          setAuthStatus({
            connected: true,
            email: event.data.email,
          });
          onAuthSuccess?.(event.data.token);
          window.removeEventListener('message', handleMessage);
        } else if (event.data.type === 'OAUTH_ERROR') {
          const errorMessage =
            event.data.message || 'OAuth authentication failed';
          setError(errorMessage);
          onAuthError?.(errorMessage);
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup if component unmounts
      return () => {
        clearInterval(checkClosed);
        window.removeEventListener('message', handleMessage);
        if (!popup.closed) {
          popup.close();
        }
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to initiate Gmail authentication';
      setError(errorMessage);
      onAuthError?.(errorMessage);
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/gmail/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        await response.json();
        setSuccess('Token refreshed successfully!');
        await checkAuthStatus();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh token';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectGmail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/auth/gmail/disconnect', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setAuthStatus({ connected: false });
        setSuccess('Gmail account disconnected successfully!');
        onStatusChange?.(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to disconnect: ${response.statusText}`
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to disconnect Gmail account';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      checkAuthStatus();
    } else {
      setError('Maximum retry attempts reached. Please refresh the page.');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail Integration
        </CardTitle>
        <CardDescription>
          Connect your Gmail account to sync emails and labels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={authStatus.connected ? 'default' : 'secondary'}>
            {authStatus.connected ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Connected
              </>
            )}
          </Badge>
        </div>

        {/* User Email */}
        {authStatus.connected && authStatus.email && (
          <div className="text-sm text-muted-foreground">
            Connected as:{' '}
            <span className="font-medium">{authStatus.email}</span>
          </div>
        )}

        {/* Token Refresh Warning */}
        {authStatus.needsRefresh && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your Gmail connection needs to be refreshed.
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              {retryCount < 3 && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleRetry}
                  className="ml-2 p-0 h-auto"
                >
                  Retry
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {!authStatus.connected ? (
            <Button
              onClick={initiateGmailAuth}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Connect Gmail Account
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={checkAuthStatus}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Status
                    </>
                  )}
                </Button>

                {authStatus.needsRefresh && (
                  <Button
                    variant="outline"
                    onClick={refreshToken}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Token
                      </>
                    )}
                  </Button>
                )}
              </div>

              <Button
                variant="destructive"
                onClick={disconnectGmail}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <Unplug className="h-4 w-4 mr-2" />
                    Disconnect Gmail
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* OAuth Permissions Info */}
        {!authStatus.connected && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Required permissions:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Read your Gmail messages</li>
              <li>Manage Gmail labels</li>
              <li>Access your email address</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Your data is encrypted and stored securely. You can disconnect at
              any time.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

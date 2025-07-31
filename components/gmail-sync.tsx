'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Progress } from '@/components/ui/progress';
import {
  Mail,
  Loader2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Tag,
  Inbox,
  Link2,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { ApiError } from '@/lib/api/errors';

import { useGmailThreadSync } from '@/lib/hooks/gmail/use-gmail-thread-sync';

// Types
import { Deal } from '@/lib/types';

interface GmailSyncProps {
  onSyncComplete?: (deals: Deal[]) => void;
}

export function GmailSync({ onSyncComplete }: GmailSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSettingUpLabels, setIsSettingUpLabels] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { syncGmailThreads } = useGmailThreadSync();

  useEffect(() => {
    // Wrap in setTimeout to avoid any initialization race conditions
    const timer = setTimeout(() => {
      // Add catch to prevent unhandled promise rejection
      checkGmailConnection().catch(() => {
        // Error is already handled inside checkGmailConnection
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const checkGmailConnection = async () => {
    try {
      const status = await apiClient.getGmailStatus();
      setGmailConnected(status.isAuthenticated);
      setUserEmail(status.email || null);
    } catch (error) {
      // Use console.warn instead of console.error to avoid Next.js interception
      if (process.env.NODE_ENV === 'development') {
        console.warn('[GmailSync] Failed to check Gmail status:', error);
      }
      setDebugInfo((prev) => prev + `\nGmail status check error: ${error}`);
      // Don't throw the error, just set disconnected state
      setGmailConnected(false);
      setUserEmail(null);
    }
  };

  const connectGmail = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const response = await apiClient.getGmailAuthUrl();

      // Open OAuth popup
      const popup = window.open(
        response.url,
        'gmail-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error(
          'Failed to open OAuth popup. Please allow popups for this site.'
        );
      }

      // Check for completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);
          // Check if auth was successful
          setTimeout(() => {
            checkGmailConnection();
          }, 1000);
        }
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to Gmail'
      );
      setDebugInfo((prev) => prev + `\nGmail connect error: ${err}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const setupKanbanLabels = async () => {
    setIsSettingUpLabels(true);
    setError(null);
    setSuccess(null);
    setSyncStatus('Checking Gmail labels...');
    setDebugInfo(''); // Clear debug info

    try {
      // First check if Gmail is connected
      if (!gmailConnected) {
        setError(
          'Please connect your Gmail account first before setting up labels.'
        );
        setDebugInfo(
          'Gmail is not connected. Click "Connect Gmail" button first.'
        );
        return false;
      }

      setDebugInfo((prev) => prev + '\nCalling ensureKanbanLabels API...');
      const response = await apiClient.ensureKanbanLabels();
      setDebugInfo(
        (prev) => prev + `\nAPI Response: ${JSON.stringify(response, null, 2)}`
      );

      // Build a detailed status message
      const { summary } = response;
      let statusMessage = '';

      if (summary) {
        if (summary.created?.length > 0) {
          statusMessage += `Created ${summary.created.length} new labels. `;
        }

        if (summary.existing?.length > 0) {
          statusMessage += `${summary.existing.length} labels already exist. `;
        }

        if (summary.failed?.length > 0) {
          statusMessage += `Failed to create ${summary.failed.length} labels.`;
          const failedDetails = summary.failed
            .map((f) => `${f.label}: ${f.error}`)
            .join('\n');
          setError(`Some labels failed:\n${failedDetails}`);
          setDebugInfo((prev) => prev + `\nFailed labels: ${failedDetails}`);
        } else {
          setSuccess(
            'All Gmail labels are ready! You can now sync your emails.'
          );
        }
      }

      setSyncStatus(statusMessage || 'All labels verified!');

      // Return true if we have all labels ready (even if some already existed)
      return summary?.failed?.length === 0;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to setup Gmail labels';

      // Check for specific error types
      if (err instanceof ApiError && err.status === 401) {
        setError(
          'Not authenticated with Gmail. Please connect your Gmail account first.'
        );
        setDebugInfo(
          'Authentication error: Gmail access token not found or expired.'
        );
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
        setDebugInfo(
          (prev) =>
            prev + '\nNetwork/CORS error. Check browser console for details.'
        );
      } else {
        setError(errorMessage);
        setDebugInfo(
          (prev) =>
            prev +
            `\nError details: ${err instanceof Error ? err.stack : String(err)}`
        );
      }

      return false;
    } finally {
      setIsSettingUpLabels(false);
    }
  };

  const syncEmails = async () => {
    setIsSyncing(true);
    setError(null);
    setSuccess(null);
    setSyncProgress(0);
    setShowDialog(true);

    try {
      // First ensure labels exist
      setSyncStatus('Checking Gmail labels...');
      setSyncProgress(10);
      const labelsSetup = await setupKanbanLabels();

      if (!labelsSetup) {
        throw new Error('Failed to setup Gmail labels');
      }

      // Sync emails using thread-based approach
      setSyncStatus('Fetching email threads from Gmail...');
      setSyncProgress(30);

      const result = await syncGmailThreads();

      setSyncProgress(90);
      setSuccess(
        `Successfully synced ${result.totalAdded} email threads from Gmail!`
      );
      setSyncStatus('Sync complete!');
      setSyncProgress(100);

      // Call the callback if provided
      if (onSyncComplete) {
        onSyncComplete([]);
      }

      // Close dialog after success
      setTimeout(() => {
        setShowDialog(false);
        setSyncProgress(0);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync emails');
      setSyncStatus('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!gmailConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Gmail Not Connected
          </CardTitle>
          <CardDescription>
            Please connect your Gmail account to start syncing deals.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex space-x-4 items-center">
          <Button
            onClick={connectGmail}
            disabled={isConnecting}
            variant="outline"
            size="lg"
            className="flex items-center space-x-2"
          >
            {isConnecting ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Link2 className="h-5 w-5" />
            )}
            <span>{isConnecting ? 'Connecting...' : 'Connect Gmail'}</span>
          </Button>
          {error && (
            <Alert variant="destructive" className="flex-1">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Gmail Sync
          </CardTitle>
          <CardDescription>
            Sync your Gmail emails with kanban board stages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gmail Connection Status */}
          {!gmailConnected && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Gmail not connected.</strong> Please connect your Gmail
                account first to use the sync features.
              </AlertDescription>
            </Alert>
          )}

          {gmailConnected && userEmail && (
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Connected as: <span className="font-medium">{userEmail}</span>
            </div>
          )}

          <div className="flex gap-2 mb-4">
            {!gmailConnected ? (
              <Button
                onClick={connectGmail}
                disabled={isConnecting}
                className="flex-1"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Connect Gmail
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={setupKanbanLabels}
                  disabled={isSettingUpLabels || isSyncing}
                  variant="outline"
                  className="flex-1"
                >
                  {isSettingUpLabels ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Tag className="mr-2 h-4 w-4" />
                      Setup Labels
                    </>
                  )}
                </Button>

                <Button
                  onClick={syncEmails}
                  disabled={isSyncing || isSettingUpLabels}
                  className="flex-1"
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Emails
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium mb-2">How it works:</h4>
            <ol className="text-xs text-muted-foreground space-y-1">
              <li>
                1. Creates a &quot;kanban&quot; label in Gmail with sub-labels
                for each stage
              </li>
              <li>2. Scans emails with kanban stage labels</li>
              <li>3. Converts emails to deals and adds them to the board</li>
              <li>4. Moving cards will update Gmail labels automatically</li>
            </ol>
          </div>

          {/* Debug Information */}
          {debugInfo && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <pre className="text-xs whitespace-pre-wrap">{debugInfo}</pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Inbox className="h-5 w-5" />
              Syncing Gmail Emails
            </DialogTitle>
            <DialogDescription>{syncStatus}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Progress value={syncProgress} className="w-full" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(syncProgress)}%</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

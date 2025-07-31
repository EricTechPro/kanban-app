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
  Link,
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { useKanban } from '@/lib/kanban-context';
import { Deal, KanbanStage } from '@/lib/types';

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
  const { addDeal } = useKanban();

  useEffect(() => {
    checkGmailConnection();
  }, []);

  const checkGmailConnection = async () => {
    try {
      const status = await apiClient.getGmailStatus();
      setGmailConnected(status.connected);
    } catch (err) {
      setGmailConnected(false);
    }
  };

  const connectGmail = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const { authUrl } = await apiClient.getGmailAuthUrl();

      // Open OAuth popup
      const popup = window.open(
        authUrl,
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
      setError(err instanceof Error ? err.message : 'Failed to connect Gmail');
      setIsConnecting(false);
    }
  };

  const setupKanbanLabels = async () => {
    setIsSettingUpLabels(true);
    setError(null);
    setSyncStatus('Setting up Gmail labels...');

    try {
      const labels = await apiClient.ensureKanbanLabels();
      setSuccess('Gmail labels created successfully!');
      setSyncStatus(
        `Created ${Object.keys(labels.stageLabels).length} kanban stage labels`
      );
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to setup Gmail labels'
      );
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

      // Sync emails
      setSyncStatus('Fetching emails from Gmail...');
      setSyncProgress(30);
      const gmailDeals = await apiClient.syncGmailEmails();

      setSyncStatus(`Found ${gmailDeals.length} emails to sync`);
      setSyncProgress(50);

      // Add deals to kanban board
      let addedCount = 0;
      for (let i = 0; i < gmailDeals.length; i++) {
        const deal = gmailDeals[i];
        setSyncStatus(
          `Adding deal ${i + 1} of ${gmailDeals.length}: ${deal.title}`
        );
        setSyncProgress(50 + (40 * (i + 1)) / gmailDeals.length);

        try {
          addDeal(deal as Deal, deal.stage as KanbanStage);
          addedCount++;
        } catch (err) {
          console.error(`Failed to add deal: ${deal.title}`, err);
        }
      }

      setSyncProgress(100);
      setSuccess(`Successfully synced ${addedCount} deals from Gmail!`);
      setSyncStatus('Sync complete!');

      if (onSyncComplete) {
        onSyncComplete(gmailDeals as Deal[]);
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
              <Link className="h-5 w-5" />
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
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Kanban Labels</p>
              <p className="text-xs text-muted-foreground">
                Gmail labels for each kanban stage
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={setupKanbanLabels}
              disabled={isSettingUpLabels}
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
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Email Sync</p>
              <p className="text-xs text-muted-foreground">
                Import emails as deals based on their labels
              </p>
            </div>
            <Button onClick={syncEmails} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sync Now
                </>
              )}
            </Button>
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

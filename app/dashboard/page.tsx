'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Dashboard } from '@/components/dashboard';
import GmailDashboard from '@/components/gmail-dashboard';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Kanban, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const [view, setView] = useState<'kanban' | 'gmail'>('gmail');
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for success/error parameters
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'gmail_connected') {
      setNotification({
        type: 'success',
        message: 'Successfully connected to Gmail!',
      });
      // Clear the URL parameter
      window.history.replaceState({}, '', '/dashboard');
    } else if (error) {
      const errorMessages: Record<string, string> = {
        auth_failed: 'Gmail authentication failed. Please try again.',
        callback_failed: 'Failed to complete authentication. Please try again.',
        no_code: 'No authorization code received. Please try again.',
      };
      setNotification({
        type: 'error',
        message:
          errorMessages[error] || 'An error occurred during authentication.',
      });
      // Clear the URL parameter
      window.history.replaceState({}, '', '/dashboard');
    }

    checkGmailStatus();
  }, [searchParams]);

  useEffect(() => {
    // Auto-hide notification after 5 seconds
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const checkGmailStatus = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      const response = await fetch(`${baseUrl}/api/auth/gmail/status`);
      const data = await response.json();
      setIsConnected(data.connected);

      // If just connected, refresh the Gmail dashboard
      if (data.connected && searchParams.get('success') === 'gmail_connected') {
        // Force a refresh of the Gmail dashboard
        window.location.reload();
      }
    } catch (error) {
      console.error('Error checking Gmail status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
          <Alert
            className={`w-96 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription
                className={
                  notification.type === 'success'
                    ? 'text-green-800'
                    : 'text-red-800'
                }
              >
                {notification.message}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {/* View Toggle */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">YouTube Sponsorship Manager</h1>
            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => v && setView(v as 'kanban' | 'gmail')}
            >
              <ToggleGroupItem value="gmail" aria-label="Gmail view">
                <Mail className="h-4 w-4 mr-2" />
                Gmail View
                {isConnected && (
                  <span className="ml-2 h-2 w-2 bg-green-500 rounded-full" />
                )}
              </ToggleGroupItem>
              <ToggleGroupItem value="kanban" aria-label="Kanban view">
                <Kanban className="h-4 w-4 mr-2" />
                Kanban View
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {view === 'gmail' ? <GmailDashboard /> : <Dashboard />}
      </div>
    </div>
  );
}

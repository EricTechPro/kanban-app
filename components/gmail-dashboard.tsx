'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Mail, Tag } from 'lucide-react';
import React from 'react';

interface Email {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  labelIds: string[];
}

interface Label {
  id: string;
  name: string;
}

// Error Boundary Component
class GmailErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('[GmailErrorBoundary] Caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[GmailErrorBoundary] Error details:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      errorBoundary: 'GmailDashboard',
      timestamp: new Date().toISOString(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-800">
              Gmail Dashboard Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-2">
              {this.state.error?.message ||
                'An error occurred loading the Gmail dashboard'}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Reload Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

function GmailDashboardContent() {
  console.log('[GmailDashboard] Component mounting');

  const [emails, setEmails] = useState<Email[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[GmailDashboard] Initial useEffect running');
    checkGmailStatus();
    fetchLabels();
  }, []);

  const fetchEmails = useCallback(async () => {
    console.log('[GmailDashboard] Fetching emails...');
    setLoading(true);
    setError(null);

    try {
      let query = 'is:unread';
      if (selectedLabel) {
        query = `label:${selectedLabel}`;
      }

      // Use relative URL for same-origin requests
      const url = `/api/gmail/emails?q=${encodeURIComponent(
        query
      )}&maxResults=20`;
      console.log('[GmailDashboard] Fetching emails from:', url);

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin', // Changed from 'include' to 'same-origin'
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(
        '[GmailDashboard] Emails response:',
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to fetch emails: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('[GmailDashboard] Emails data:', {
        emailCount: data.emails?.length || 0,
        hasEmails: !!data.emails,
      });

      setEmails(data.emails || []);
    } catch (error) {
      console.error('[GmailDashboard] Error fetching emails:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to fetch emails'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedLabel]);

  useEffect(() => {
    console.log(
      '[GmailDashboard] Email fetch effect running, isConnected:',
      isConnected
    );
    if (isConnected) {
      fetchEmails();
    }
  }, [selectedLabel, isConnected, fetchEmails]);

  const checkGmailStatus = async () => {
    console.log('[GmailDashboard] Checking Gmail status...');

    try {
      // Use relative URL for same-origin requests
      const url = `/api/auth/gmail/status`;
      console.log('[GmailDashboard] Status URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(
        '[GmailDashboard] Status response:',
        response.status,
        response.statusText
      );

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('[GmailDashboard] Status data:', data);

      setIsConnected(data.connected);
    } catch (error) {
      console.error('[GmailDashboard] Error checking Gmail status:', error);
      setError('Failed to check Gmail connection status');
    }
  };

  const fetchLabels = async () => {
    console.log('[GmailDashboard] Fetching labels...');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
      const url = `${baseUrl}/api/gmail/labels`;
      console.log('[GmailDashboard] Labels URL:', url);

      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(
        '[GmailDashboard] Labels response:',
        response.status,
        response.statusText
      );

      if (response.ok) {
        const data = await response.json();
        console.log('[GmailDashboard] Labels data:', {
          labelCount: data.labels?.length || 0,
          hasLabels: !!data.labels,
        });
        setLabels(data.labels || []);
      } else {
        console.warn(
          '[GmailDashboard] Failed to fetch labels:',
          response.status
        );
      }
    } catch (error) {
      console.error('[GmailDashboard] Error fetching labels:', error);
      // Don't set error state for labels - they're optional
    }
  };

  const extractSenderName = (from: string) => {
    try {
      const match = from.match(/^([^<]+)/);
      return match ? match[1].trim() : from;
    } catch (error) {
      console.error('[GmailDashboard] Error extracting sender name:', error);
      return from;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 60) {
        return `${diffMins}m ago`;
      } else if (diffMins < 1440) {
        return `${Math.floor(diffMins / 60)}h ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.error('[GmailDashboard] Error formatting date:', error);
      return dateString;
    }
  };

  const handleRefresh = () => {
    console.log('[GmailDashboard] Manual refresh triggered');
    fetchEmails();
  };

  const handleLabelChange = (labelId: string) => {
    console.log('[GmailDashboard] Label changed to:', labelId);
    setSelectedLabel(labelId);
  };

  console.log('[GmailDashboard] Rendering with state:', {
    isConnected,
    emailCount: emails.length,
    labelCount: labels.length,
    loading,
    hasError: !!error,
    selectedLabel,
  });

  // ... existing code ...
  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gmail Not Connected</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Connect your Gmail account to start managing sponsorship emails.
          </p>
          <Button
            onClick={() => (window.location.href = '/api/auth/gmail/auth-url')}
          >
            <Mail className="mr-2 h-4 w-4" />
            Connect Gmail
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gmail Dashboard</h2>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {/* Label Filter */}
      {labels.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedLabel === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleLabelChange('')}
          >
            <Tag className="mr-1 h-3 w-3" />
            Unread
          </Button>
          {labels.map((label) => (
            <Button
              key={label.id}
              variant={selectedLabel === label.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLabelChange(label.id)}
            >
              <Tag className="mr-1 h-3 w-3" />
              {label.name}
            </Button>
          ))}
        </div>
      )}

      {/* Email List */}
      {loading ? (
        <Card>
          <CardContent className="py-8">
            <div className="flex justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ) : emails.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No emails found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <Card key={email.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">
                    {email.subject || '(No subject)'}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(email.date)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  From: {extractSenderName(email.from)}
                </p>
                <p className="text-sm line-clamp-2">{email.snippet}</p>
                {email.labelIds.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {email.labelIds.map((labelId) => {
                      const label = labels.find((l) => l.id === labelId);
                      return label ? (
                        <Badge key={labelId} variant="secondary">
                          {label.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GmailDashboard() {
  return (
    <GmailErrorBoundary>
      <GmailDashboardContent />
    </GmailErrorBoundary>
  );
}

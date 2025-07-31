'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Mail, Tag } from 'lucide-react';

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

export default function GmailDashboard() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkGmailStatus();
    fetchLabels();
  }, []);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    try {
      let query = 'is:unread';
      if (selectedLabel) {
        query = `label:${selectedLabel}`;
      }

      const response = await fetch(
        `/api/gmail/emails?q=${encodeURIComponent(query)}&maxResults=20`
      );
      if (response.ok) {
        const data = await response.json();
        setEmails(data.emails || []);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedLabel]);

  useEffect(() => {
    if (isConnected) {
      fetchEmails();
    }
  }, [selectedLabel, isConnected, fetchEmails]);

  const checkGmailStatus = async () => {
    try {
      const response = await fetch('/api/auth/gmail/status');
      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      console.error('Error checking Gmail status:', error);
    }
  };

  const fetchLabels = async () => {
    try {
      const response = await fetch('/api/gmail/labels');
      if (response.ok) {
        const data = await response.json();
        setLabels(data.labels || []);
      }
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  const extractSenderName = (from: string) => {
    const match = from.match(/^([^<]+)/);
    return match ? match[1].trim() : from;
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
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }
    } catch {
      return dateString;
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Connect Gmail</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please connect your Gmail account to view emails.
            </p>
            <Button
              onClick={() => (window.location.href = '/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gmail Dashboard</h1>
        <Button onClick={fetchEmails} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Labels Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                Labels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={selectedLabel === '' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedLabel('')}
                >
                  All Unread
                </Button>
                {labels.map((label) => (
                  <Button
                    key={label.id}
                    variant={selectedLabel === label.name ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedLabel(label.name || '')}
                  >
                    {label.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emails List */}
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Emails {selectedLabel && `- ${selectedLabel}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading emails...
                </div>
              ) : emails.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No emails found
                </div>
              ) : (
                <div className="space-y-3">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {extractSenderName(email.from)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(email.date)}
                            </span>
                          </div>
                          <h3 className="font-medium mb-1">{email.subject}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {email.snippet}
                          </p>
                        </div>
                      </div>
                      {email.labelIds.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {email.labelIds.slice(0, 3).map((labelId) => (
                            <Badge
                              key={labelId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {labelId}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

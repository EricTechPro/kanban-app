'use client';

import { useEffect, useState } from 'react';
import { Dashboard } from '@/components/dashboard';
import GmailDashboard from '@/components/gmail-dashboard';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Kanban, Mail } from 'lucide-react';

export default function DashboardPage() {
  const [view, setView] = useState<'kanban' | 'gmail'>('gmail');
  const [, setIsConnected] = useState(false);

  useEffect(() => {
    checkGmailStatus();
  }, []);

  const checkGmailStatus = async () => {
    try {
      const response = await fetch('/api/auth/gmail/status');
      const data = await response.json();
      setIsConnected(data.connected);
    } catch (error) {
      console.error('Error checking Gmail status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
      {view === 'gmail' ? <GmailDashboard /> : <Dashboard />}
    </div>
  );
}

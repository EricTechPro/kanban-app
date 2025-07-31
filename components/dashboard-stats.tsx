'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, CheckCircle, Briefcase } from 'lucide-react';
import { useKanban } from '@/lib/hooks/kanban/use-kanban';

export function DashboardStats() {
  const { state } = useKanban();
  const { deals } = state;

  console.log('[DashboardStats] Total deals:', deals.length);
  console.log(
    '[DashboardStats] Deals by stage:',
    deals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  );

  // Calculate total revenue (sum of all completed deals)
  const completedDeals = deals.filter((deal) => deal.stage === 'completed');
  const totalRevenue = completedDeals.reduce(
    (sum, deal) => sum + deal.value,
    0
  );
  console.log('[DashboardStats] Completed deals:', completedDeals.length);
  console.log('[DashboardStats] Total revenue:', totalRevenue);

  // Calculate current active deals (all deals not completed)
  const activeDeals = deals.filter((deal) => deal.stage !== 'completed');
  console.log('[DashboardStats] Active deals:', activeDeals.length);

  // Number of deals completed
  const dealsCompleted = completedDeals.length;

  // Total deals
  const totalDeals = deals.length;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      description: 'From completed deals',
      icon: DollarSign,
    },
    {
      title: 'Current Active Deals',
      value: activeDeals.length.toString(),
      description: 'In progress',
      icon: TrendingUp,
    },
    {
      title: 'Deals Completed',
      value: dealsCompleted.toString(),
      description: 'Successfully closed',
      icon: CheckCircle,
    },
    {
      title: 'Total Deals',
      value: totalDeals.toString(),
      description: 'All time',
      icon: Briefcase,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

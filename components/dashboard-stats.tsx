'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Users, Target } from 'lucide-react';
import { useKanban } from '@/lib/hooks/kanban/use-kanban';

export function DashboardStats() {
  const { state } = useKanban();
  const { deals } = state;

  // Calculate real statistics from the deals
  const totalDeals = deals.length;
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealValue = totalDeals > 0 ? Math.round(totalValue / totalDeals) : 0;

  // Calculate pipeline value (deals not completed)
  const pipelineDeals = deals.filter((deal) => deal.stage !== 'completed');
  const pipelineValue = pipelineDeals.reduce(
    (sum, deal) => sum + deal.value,
    0
  );

  // Calculate conversion rate (completed deals / total deals)
  const completedDeals = deals.filter((deal) => deal.stage === 'completed');
  const conversionRate =
    totalDeals > 0 ? Math.round((completedDeals.length / totalDeals) * 100) : 0;

  // Calculate weighted pipeline value based on progress
  const weightedPipelineValue = pipelineDeals.reduce(
    (sum, deal) => sum + (deal.value * deal.progress) / 100,
    0
  );

  const stats = [
    {
      title: 'Total Pipeline Value',
      value: `$${pipelineValue.toLocaleString()}`,
      description: `${pipelineDeals.length} active deals`,
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Weighted Pipeline',
      value: `$${Math.round(weightedPipelineValue).toLocaleString()}`,
      description: 'Based on progress',
      icon: Target,
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Average Deal Size',
      value: `$${avgDealValue.toLocaleString()}`,
      description: `From ${totalDeals} total deals`,
      icon: TrendingUp,
      trend: '+5.4%',
      trendUp: true,
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      description: `${completedDeals.length} deals closed`,
      icon: Users,
      trend: '-2.1%',
      trendUp: false,
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
            <div className="mt-2 flex items-center text-xs">
              <span
                className={stat.trendUp ? 'text-green-600' : 'text-red-600'}
              >
                {stat.trend}
              </span>
              <span className="ml-1 text-muted-foreground">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DollarSign, TrendingUp, Package } from 'lucide-react';
import { Deal, KanbanStage } from '@/lib/types';
import { DealCard } from './deal-card';
import { getStageMetrics } from '@/lib/mock-data';
interface KanbanColumnProps {
  stage: KanbanStage;
  title: string;
  deals: Deal[];
  color: string;
}

export function KanbanColumn({
  stage,
  title,
  deals,
  color,
}: KanbanColumnProps) {
  const metrics = getStageMetrics(stage);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <Badge variant="secondary" className={`${color} px-2 py-1`}>
              <Package className="h-3 w-3 mr-1" />
              {deals.length}
            </Badge>
          </div>

          {/* Stage Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">
                {formatCurrency(metrics.totalValue)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">
                {Math.round(metrics.avgProgress)}% avg
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-3">
        <ScrollArea className="h-full pr-3">
          <div className="space-y-3">
            {deals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  No deals in this stage
                </p>
              </div>
            ) : (
              deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

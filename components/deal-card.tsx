'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building2,
  Calendar,
  DollarSign,
  Mail,
  MoreVertical,
  User,
  Clock,
  Tag,
  TrendingUp,
} from 'lucide-react';
import { Deal } from '@/lib/types';
import { EditDealModal } from './edit-deal-modal';
import { useKanban } from '@/lib/hooks/kanban/use-kanban';
import { formatDistanceToNow } from 'date-fns';

interface DealCardProps {
  deal: Deal;
}

export function DealCard({ deal }: DealCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { deleteDeal } = useKanban();

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this deal?')) {
      deleteDeal(deal.id);
    }
  };

  const handleEdit = () => {
    // The edit modal will handle the update
    setShowEditModal(false);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: deal.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get progress color
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-50';
    if (progress >= 60) return 'text-yellow-600 bg-yellow-50';
    if (progress >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  // Get days until close
  const getDaysUntilClose = () => {
    const closeDate = new Date(deal.dueDate);
    const today = new Date();
    const diffTime = closeDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilClose = getDaysUntilClose();

  // Get last activity date
  const getLastActivityDate = () => {
    if (deal.isFromGmail && deal.lastEmailDate) {
      return deal.lastEmailDate;
    }
    return deal.updatedAt;
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                {deal.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span>{deal.brand}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Deal Value and Progress */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-bold text-lg">
                {formatCurrency(deal.value)}
              </span>
            </div>
            <Badge
              variant="secondary"
              className={`${getProgressColor(deal.progress)} border-0`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              {deal.progress}%
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <Progress value={deal.progress} className="h-2" />
          </div>

          {/* Contact Info */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-3 w-3" />
              <span className="truncate">{deal.primaryContact.name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span className="truncate">{deal.primaryContact.email}</span>
            </div>
          </div>

          {/* Timeline Info */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span
                className={
                  daysUntilClose < 7
                    ? 'text-orange-600 font-medium'
                    : 'text-muted-foreground'
                }
              >
                {daysUntilClose > 0 ? `${daysUntilClose}d left` : 'Overdue'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(getLastActivityDate(), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {/* Tags */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {deal.tags.slice(0, 3).map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-2 py-0"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </Badge>
              ))}
              {deal.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{deal.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Notes Preview */}
          {deal.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
              {deal.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <EditDealModal
        deal={deal}
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEdit}
      />
    </>
  );
}

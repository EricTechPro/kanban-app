"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Deal } from "@/lib/types";
import {
  Edit,
  Move,
  Trash2,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  GripVertical,
} from "lucide-react";
import { format } from "date-fns";

interface DealCardProps {
  deal: Deal;
  onEdit?: (deal: Deal) => void;
  onMove?: (deal: Deal) => void;
  onDelete?: (deal: Deal) => void;
  isDragging?: boolean;
}

export function DealCard({
  deal,
  onEdit,
  onMove,
  onDelete,
  isDragging,
}: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: "deal",
      deal,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatCurrency = (
    amount: number,
    currency: string
  ) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityIcon = (
    priority: Deal["priority"]
  ) => {
    switch (priority) {
      case "urgent":
        return (
          <AlertCircle className="h-3 w-3" />
        );
      case "high":
        return (
          <AlertTriangle className="h-3 w-3" />
        );
      case "medium":
        return <Clock className="h-3 w-3" />;
      case "low":
        return (
          <CheckCircle className="h-3 w-3" />
        );
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (
    priority: Deal["priority"]
  ) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isOverdue = new Date() > deal.dueDate;
  const daysUntilDue = Math.ceil(
    (deal.dueDate.getTime() -
      new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (sortableIsDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="w-full opacity-50 rotate-3 border-2 border-dashed border-blue-300 bg-blue-50"
      >
        <CardContent className="p-4">
          <div className="h-32 flex items-center justify-center">
            <div className="text-blue-500 text-sm font-medium">
              Moving...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="w-full hover:shadow-md transition-all cursor-pointer group bg-white border border-gray-200 hover:border-gray-300"
      {...attributes}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2 flex-1">
            {/* Drag Handle */}
            <div
              {...listeners}
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing mt-1"
            >
              <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight line-clamp-2 text-gray-900">
                {deal.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(deal);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onMove?.(deal);
              }}
            >
              <Move className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(deal);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={deal.brandLogo} />
            <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
              {deal.brand
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600 font-medium">
            {deal.brand}
          </span>
        </div>
      </CardHeader>

      <CardContent className="py-3 space-y-3">
        {/* Deal Value */}
        <div className="flex items-center space-x-1">
          <DollarSign className="h-3 w-3 text-green-600" />
          <span className="text-sm font-semibold text-green-600">
            {formatCurrency(
              deal.value,
              deal.currency
            )}
          </span>
        </div>

        {/* Due Date */}
        <div className="flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-gray-500" />
          <span
            className={`text-xs ${
              isOverdue
                ? "text-red-600 font-medium"
                : "text-gray-600"
            }`}
          >
            {format(deal.dueDate, "MMM dd, yyyy")}
            {isOverdue && " (Overdue)"}
            {!isOverdue &&
              daysUntilDue <= 7 &&
              daysUntilDue > 0 && (
                <span className="text-orange-600 font-medium">
                  {" "}
                  ({daysUntilDue}d left)
                </span>
              )}
          </span>
        </div>

        {/* Priority Indicator */}
        <Badge
          variant="outline"
          className={`text-xs ${getPriorityColor(
            deal.priority
          )} flex items-center space-x-1 w-fit`}
        >
          {getPriorityIcon(deal.priority)}
          <span className="capitalize">
            {deal.priority}
          </span>
        </Badge>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              Progress
            </span>
            <span className="text-xs text-gray-600 font-medium">
              {deal.progress}%
            </span>
          </div>
          <Progress
            value={deal.progress}
            className="h-1.5"
          />
        </div>

        {/* Tags */}
        {deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {deal.tags
              .slice(0, 3)
              .map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-1.5 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
            {deal.tags.length > 3 && (
              <Badge
                variant="secondary"
                className="text-xs px-1.5 py-0.5"
              >
                +{deal.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

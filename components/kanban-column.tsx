"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanColumn, Deal } from "@/lib/types";
import { DealCard } from "./deal-card";
import {
  MoreHorizontal,
  Plus,
} from "lucide-react";

interface KanbanColumnProps {
  column: KanbanColumn;
  onAddDeal?: (stage: KanbanColumn["id"]) => void;
  onEditDeal?: (deal: Deal) => void;
  onMoveDeal?: (deal: Deal) => void;
  onDeleteDeal?: (deal: Deal) => void;
}

export function KanbanColumnComponent({
  column,
  onAddDeal,
  onEditDeal,
  onMoveDeal,
  onDeleteDeal,
}: KanbanColumnProps) {
  const getColumnColor = (
    columnId: KanbanColumn["id"]
  ) => {
    const colors = {
      prospecting: "bg-blue-50 border-blue-200",
      "initial-contact":
        "bg-yellow-50 border-yellow-200",
      negotiation:
        "bg-orange-50 border-orange-200",
      "contract-sent":
        "bg-purple-50 border-purple-200",
      "contract-signed":
        "bg-indigo-50 border-indigo-200",
      "content-creation":
        "bg-green-50 border-green-200",
      "content-review":
        "bg-teal-50 border-teal-200",
      published:
        "bg-emerald-50 border-emerald-200",
      completed: "bg-gray-50 border-gray-200",
    };
    return (
      colors[columnId] ||
      "bg-gray-50 border-gray-200"
    );
  };

  const getBadgeColor = (
    columnId: KanbanColumn["id"]
  ) => {
    const colors = {
      prospecting: "bg-blue-100 text-blue-800",
      "initial-contact":
        "bg-yellow-100 text-yellow-800",
      negotiation:
        "bg-orange-100 text-orange-800",
      "contract-sent":
        "bg-purple-100 text-purple-800",
      "contract-signed":
        "bg-indigo-100 text-indigo-800",
      "content-creation":
        "bg-green-100 text-green-800",
      "content-review":
        "bg-teal-100 text-teal-800",
      published:
        "bg-emerald-100 text-emerald-800",
      completed: "bg-gray-100 text-gray-800",
    };
    return (
      colors[columnId] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Card
      className={`w-80 flex-shrink-0 ${getColumnColor(
        column.id
      )}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-sm">
              {column.title}
            </h3>
            <Badge
              variant="secondary"
              className={`text-xs ${getBadgeColor(
                column.id
              )}`}
            >
              {column.deals.length}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  onAddDeal?.(column.id)
                }
              >
                Add Deal
              </DropdownMenuItem>
              <DropdownMenuItem>
                Sort by Priority
              </DropdownMenuItem>
              <DropdownMenuItem>
                Sort by Due Date
              </DropdownMenuItem>
              <DropdownMenuItem>
                Sort by Value
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-3">
            {column.deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                onEdit={onEditDeal}
                onMove={onMoveDeal}
                onDelete={onDeleteDeal}
              />
            ))}

            {/* Add New Deal Button */}
            <Button
              variant="outline"
              className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 flex flex-col items-center justify-center space-y-1 bg-transparent hover:bg-gray-50"
              onClick={() =>
                onAddDeal?.(column.id)
              }
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs">
                Add Deal
              </span>
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      column,
    },
  });

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

  const getDropZoneColor = (
    columnId: KanbanColumn["id"]
  ) => {
    const colors = {
      prospecting: "border-blue-400 bg-blue-100",
      "initial-contact":
        "border-yellow-400 bg-yellow-100",
      negotiation:
        "border-orange-400 bg-orange-100",
      "contract-sent":
        "border-purple-400 bg-purple-100",
      "contract-signed":
        "border-indigo-400 bg-indigo-100",
      "content-creation":
        "border-green-400 bg-green-100",
      "content-review":
        "border-teal-400 bg-teal-100",
      published:
        "border-emerald-400 bg-emerald-100",
      completed: "border-gray-400 bg-gray-100",
    };
    return (
      colors[columnId] ||
      "border-gray-400 bg-gray-100"
    );
  };

  const dealIds = column.deals.map(
    (deal) => deal.id
  );

  return (
    <Card
      className={`w-80 flex-shrink-0 transition-all ${getColumnColor(
        column.id
      )} ${
        isOver
          ? `border-2 ${getDropZoneColor(
              column.id
            )}`
          : ""
      }`}
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
          <div
            ref={setNodeRef}
            className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-all ${
              isOver
                ? `${getDropZoneColor(
                    column.id
                  )} border-2 border-dashed`
                : ""
            }`}
          >
            <SortableContext
              items={dealIds}
              strategy={
                verticalListSortingStrategy
              }
            >
              {column.deals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onEdit={onEditDeal}
                  onMove={onMoveDeal}
                  onDelete={onDeleteDeal}
                />
              ))}
            </SortableContext>

            {/* Add New Deal Button */}
            <Button
              variant="outline"
              className="w-full h-20 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 flex flex-col items-center justify-center space-y-1 bg-transparent hover:bg-gray-50 mt-4"
              onClick={() =>
                onAddDeal?.(column.id)
              }
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs">
                Add Deal
              </span>
            </Button>

            {/* Drop zone indicator when dragging over empty column */}
            {isOver &&
              column.deals.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50">
                  <div className="text-center">
                    <div className="text-gray-500 text-sm font-medium">
                      Drop deal here
                    </div>
                    <div className="text-gray-400 text-xs">
                      Move to {column.title}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

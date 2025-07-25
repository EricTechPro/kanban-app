"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { TopNavigation } from "@/components/top-navigation";
import { DashboardStatsBar } from "@/components/dashboard-stats";
import { KanbanColumnComponent } from "@/components/kanban-column";
import { AddDealModal } from "@/components/add-deal-modal";
import {
  Deal,
  KanbanColumn,
  KanbanStage,
} from "@/lib/types";
import {
  mockUser,
  kanbanColumns as initialColumns,
  dashboardStats,
} from "@/lib/mock-data";
import {
  Grid,
  List,
  Calendar,
  Download,
  Move,
  Trash2,
} from "lucide-react";

export function Dashboard() {
  const [columns, setColumns] = useState<
    KanbanColumn[]
  >(initialColumns);
  const [
    isAddDealModalOpen,
    setIsAddDealModalOpen,
  ] = useState(false);
  const [
    selectedDealStage,
    setSelectedDealStage,
  ] = useState<KanbanStage>("prospecting");
  const [viewMode, setViewMode] = useState<
    "board" | "list" | "calendar"
  >("board");
  const [selectedDeals, setSelectedDeals] =
    useState<string[]>([]);
  const [selectAll, setSelectAll] =
    useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] =
    useState("");
  const [statusFilter, setStatusFilter] =
    useState("");
  const [brandFilter, setBrandFilter] =
    useState("");
  const [dateRangeFilter, setDateRangeFilter] =
    useState<{ from: Date; to: Date } | null>(
      null
    );

  const handleAddDeal = (stage?: KanbanStage) => {
    if (stage) {
      setSelectedDealStage(stage);
    }
    setIsAddDealModalOpen(true);
  };

  const handleCreateDeal = (
    dealData: Partial<Deal>
  ) => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      title: dealData.title || "",
      brand: dealData.brand || "",
      value: dealData.value || 0,
      currency: dealData.currency || "USD",
      dueDate: dealData.dueDate || new Date(),
      priority: dealData.priority || "medium",
      stage: dealData.stage || selectedDealStage,
      progress: dealData.progress || 0,
      tags: dealData.tags || [],
      dealType:
        dealData.dealType || "sponsored-video",
      startDate: dealData.startDate,
      contentRequirements:
        dealData.contentRequirements,
      deliverables: dealData.deliverables || [],
      estimatedHours: dealData.estimatedHours,
      primaryContact: dealData.primaryContact || {
        name: "",
        email: "",
      },
      secondaryContact: dealData.secondaryContact,
      notes: dealData.notes,
      attachments: dealData.attachments,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === newDeal.stage
          ? {
              ...column,
              deals: [...column.deals, newDeal],
            }
          : column
      )
    );
  };

  const handleEditDeal = (deal: Deal) => {
    console.log("Edit deal:", deal);
    // TODO: Implement edit functionality
  };

  const handleMoveDeal = (deal: Deal) => {
    console.log("Move deal:", deal);
    // TODO: Implement move functionality
  };

  const handleDeleteDeal = (deal: Deal) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        deals: column.deals.filter(
          (d) => d.id !== deal.id
        ),
      }))
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterStatus = (status: string) => {
    setStatusFilter(status);
  };

  const handleFilterBrand = (brand: string) => {
    setBrandFilter(brand);
  };

  const handleFilterDateRange = (dateRange: {
    from: Date;
    to: Date;
  }) => {
    setDateRangeFilter(dateRange);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setBrandFilter("");
    setDateRangeFilter(null);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedDeals([]);
    } else {
      const allDealIds = columns.flatMap(
        (column) =>
          column.deals.map((deal) => deal.id)
      );
      setSelectedDeals(allDealIds);
    }
    setSelectAll(!selectAll);
  };

  const handleBulkMove = () => {
    console.log(
      "Bulk move deals:",
      selectedDeals
    );
    // TODO: Implement bulk move
  };

  const handleBulkDelete = () => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        deals: column.deals.filter(
          (deal) =>
            !selectedDeals.includes(deal.id)
        ),
      }))
    );
    setSelectedDeals([]);
    setSelectAll(false);
  };

  const handleExportSelected = () => {
    console.log("Export deals:", selectedDeals);
    // TODO: Implement export functionality
  };

  // Apply filters to columns
  const filteredColumns = columns.map(
    (column) => ({
      ...column,
      deals: column.deals.filter((deal) => {
        const matchesSearch =
          !searchQuery ||
          deal.title
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            ) ||
          deal.brand
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesStatus =
          !statusFilter ||
          deal.stage === statusFilter;
        const matchesBrand =
          !brandFilter ||
          deal.brand === brandFilter;

        const matchesDateRange =
          !dateRangeFilter ||
          (deal.dueDate >= dateRangeFilter.from &&
            deal.dueDate <= dateRangeFilter.to);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesBrand &&
          matchesDateRange
        );
      }),
    })
  );

  const totalDeals = filteredColumns.reduce(
    (sum, column) => sum + column.deals.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation
        user={mockUser}
        onAddDeal={() => handleAddDeal()}
        onSearch={handleSearch}
        onFilterStatus={handleFilterStatus}
        onFilterBrand={handleFilterBrand}
        onFilterDateRange={handleFilterDateRange}
        onClearFilters={handleClearFilters}
      />

      <div className="p-6">
        <DashboardStatsBar
          stats={dashboardStats}
        />

        {/* Kanban Board */}
        <div className="space-y-4">
          <ScrollArea className="w-full">
            <div className="flex space-x-4 pb-4">
              {filteredColumns.map((column) => (
                <KanbanColumnComponent
                  key={column.id}
                  column={column}
                  onAddDeal={handleAddDeal}
                  onEditDeal={handleEditDeal}
                  onMoveDeal={handleMoveDeal}
                  onDeleteDeal={handleDeleteDeal}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Bottom Action Bar */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                {/* Bulk Actions */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectAll}
                      onCheckedChange={
                        toggleSelectAll
                      }
                    />
                    <Label
                      htmlFor="select-all"
                      className="text-sm"
                    >
                      Select All ({totalDeals})
                    </Label>
                  </div>

                  {selectedDeals.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkMove}
                      >
                        <Move className="h-4 w-4 mr-1" />
                        Move (
                        {selectedDeals.length})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkDelete}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete (
                        {selectedDeals.length})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={
                          handleExportSelected
                        }
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export (
                        {selectedDeals.length})
                      </Button>
                    </div>
                  )}
                </div>

                {/* View Options */}
                <div className="flex items-center space-x-4">
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value) =>
                      value &&
                      setViewMode(value as any)
                    }
                  >
                    <ToggleGroupItem
                      value="board"
                      aria-label="Board view"
                    >
                      <Grid className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="list"
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="calendar"
                      aria-label="Calendar view"
                    >
                      <Calendar className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddDealModal
        open={isAddDealModalOpen}
        onClose={() =>
          setIsAddDealModalOpen(false)
        }
        onSubmit={handleCreateDeal}
        initialStage={selectedDealStage}
      />
    </div>
  );
}

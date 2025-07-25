"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
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
import { DealCard } from "@/components/deal-card";
import { AddDealModal } from "@/components/add-deal-modal";
import { MoveDealModal } from "@/components/move-deal-modal";
import { EditDealModal } from "@/components/edit-deal-modal";
import { Deal, KanbanStage } from "@/lib/types";
import { useKanban } from "@/lib/kanban-context";
import { mockUser } from "@/lib/mock-data";
import {
  Grid,
  List,
  Calendar,
  Download,
  Move,
  Trash2,
} from "lucide-react";

export function Dashboard() {
  const {
    state,
    moveDeal,
    addDeal,
    updateDeal,
    deleteDeal,
    bulkMoveDeals,
    bulkDeleteDeals,
    reorderDeals,
    getAllDeals,
  } = useKanban();

  const [
    isAddDealModalOpen,
    setIsAddDealModalOpen,
  ] = useState(false);
  const [
    isMoveDealModalOpen,
    setIsMoveDealModalOpen,
  ] = useState(false);
  const [
    isEditDealModalOpen,
    setIsEditDealModalOpen,
  ] = useState(false);
  const [
    selectedDealStage,
    setSelectedDealStage,
  ] = useState<KanbanStage>("prospecting");
  const [dealToMove, setDealToMove] =
    useState<Deal | null>(null);
  const [dealToEdit, setDealToEdit] =
    useState<Deal | null>(null);
  const [viewMode, setViewMode] = useState<
    "board" | "list" | "calendar"
  >("board");
  const [selectedDeals, setSelectedDeals] =
    useState<string[]>([]);
  const [selectAll, setSelectAll] =
    useState(false);
  const [activeDeal, setActiveDeal] =
    useState<Deal | null>(null);

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

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (
    event: DragStartEvent
  ) => {
    const { active } = event;
    const deal = state.columns
      .flatMap((col) => col.deals)
      .find((d) => d.id === active.id);

    if (deal) {
      setActiveDeal(deal);
    }
  };

  const handleDragOver = (
    event: DragOverEvent
  ) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the active deal
    const activeDeal = state.columns
      .flatMap((col) => col.deals)
      .find((d) => d.id === activeId);

    if (!activeDeal) return;

    // Check if we're dropping over a column
    const overColumn = state.columns.find(
      (col) => col.id === overId
    );

    if (
      overColumn &&
      activeDeal.stage !== overColumn.id
    ) {
      // Move deal to different column
      moveDeal(
        activeId as string,
        activeDeal.stage,
        overColumn.id
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveDeal(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the active deal
    const activeDeal = state.columns
      .flatMap((col) => col.deals)
      .find((d) => d.id === activeId);

    if (!activeDeal) return;

    // Check if we're dropping over a column
    const overColumn = state.columns.find(
      (col) => col.id === overId
    );

    if (
      overColumn &&
      activeDeal.stage !== overColumn.id
    ) {
      // Move deal to different column
      moveDeal(
        activeId as string,
        activeDeal.stage,
        overColumn.id
      );
      return;
    }

    // Check if we're reordering within the same column
    const overDeal = state.columns
      .flatMap((col) => col.deals)
      .find((d) => d.id === overId);

    if (
      overDeal &&
      activeDeal.stage === overDeal.stage
    ) {
      const column = state.columns.find(
        (col) => col.id === activeDeal.stage
      );
      if (column) {
        const oldIndex = column.deals.findIndex(
          (d) => d.id === activeId
        );
        const newIndex = column.deals.findIndex(
          (d) => d.id === overId
        );

        if (oldIndex !== newIndex) {
          reorderDeals(
            activeDeal.stage,
            oldIndex,
            newIndex
          );
        }
      }
    }
  };

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

    addDeal(newDeal, newDeal.stage);
  };

  const handleEditDeal = (deal: Deal) => {
    setDealToEdit(deal);
    setIsEditDealModalOpen(true);
  };

  const handleUpdateDeal = (
    dealId: string,
    updates: Partial<Deal>
  ) => {
    updateDeal(dealId, updates);
    setDealToEdit(null);
  };

  const handleMoveDeal = (deal: Deal) => {
    setDealToMove(deal);
    setIsMoveDealModalOpen(true);
  };

  const handleMoveDealToStage = (
    toStage: KanbanStage
  ) => {
    if (dealToMove) {
      moveDeal(
        dealToMove.id,
        dealToMove.stage,
        toStage
      );
      setDealToMove(null);
    }
  };

  const handleDeleteDeal = (deal: Deal) => {
    if (
      confirm(
        `Are you sure you want to delete "${deal.title}"?`
      )
    ) {
      deleteDeal(deal.id);
    }
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
      const allDealIds = getAllDeals().map(
        (deal) => deal.id
      );
      setSelectedDeals(allDealIds);
    }
    setSelectAll(!selectAll);
  };

  const handleBulkMove = () => {
    if (selectedDeals.length === 0) return;

    // TODO: Show modal to select target stage
    const targetStage = prompt(
      "Enter target stage (prospecting, negotiation, etc.):"
    ) as KanbanStage;
    if (
      targetStage &&
      [
        "prospecting",
        "initial-contact",
        "negotiation",
        "contract-sent",
        "contract-signed",
        "content-creation",
        "content-review",
        "published",
        "completed",
      ].includes(targetStage)
    ) {
      bulkMoveDeals(selectedDeals, targetStage);
      setSelectedDeals([]);
      setSelectAll(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedDeals.length === 0) return;

    if (
      confirm(
        `Are you sure you want to delete ${selectedDeals.length} deals?`
      )
    ) {
      bulkDeleteDeals(selectedDeals);
      setSelectedDeals([]);
      setSelectAll(false);
    }
  };

  const handleExportSelected = () => {
    console.log("Export deals:", selectedDeals);
    // TODO: Implement export functionality
  };

  // Apply filters to columns
  const filteredColumns = state.columns.map(
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

  // Calculate dashboard stats
  const allDeals = getAllDeals();
  const dashboardStats = {
    totalDeals: allDeals.length,
    activeDeals: allDeals.filter(
      (deal) =>
        !["completed"].includes(deal.stage)
    ).length,
    completedDeals: allDeals.filter(
      (deal) => deal.stage === "completed"
    ).length,
    totalRevenue: allDeals.reduce(
      (sum, deal) => sum + deal.value,
      0
    ),
    monthlyRevenue: allDeals
      .filter(
        (deal) =>
          deal.createdAt.getMonth() ===
          new Date().getMonth()
      )
      .reduce((sum, deal) => sum + deal.value, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation
        user={mockUser}
        onSearch={handleSearch}
        onFilterStatus={handleFilterStatus}
        onFilterBrand={handleFilterBrand}
        onFilterDateRange={handleFilterDateRange}
        onClearFilters={handleClearFilters}
      />

      <div className="p-6 space-y-6">
        <DashboardStatsBar
          stats={dashboardStats}
        />

        {/* Kanban Board Container */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Board Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Sponsorship Pipeline
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage your sponsorship deals
                    across the entire workflow
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() =>
                      handleAddDeal()
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Add New Deal
                  </Button>
                </div>
              </div>

              {/* Kanban Board with Drag and Drop */}
              <DndContext
                sensors={sensors}
                collisionDetection={
                  closestCorners
                }
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                {/* Horizontal Scrollable Container */}
                <div className="relative">
                  <div className="kanban-scroll overflow-x-auto overflow-y-hidden">
                    <div
                      className="flex space-x-6 pb-4"
                      style={{
                        minWidth: "max-content",
                      }}
                    >
                      {filteredColumns.map(
                        (column) => (
                          <KanbanColumnComponent
                            key={column.id}
                            column={column}
                            onAddDeal={
                              handleAddDeal
                            }
                            onEditDeal={
                              handleEditDeal
                            }
                            onMoveDeal={
                              handleMoveDeal
                            }
                            onDeleteDeal={
                              handleDeleteDeal
                            }
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* Scroll Indicator */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                  {activeDeal ? (
                    <DealCard deal={activeDeal} />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Bar */}
        <Card className="bg-white shadow-sm border border-gray-200">
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
                      Move ({selectedDeals.length}
                      )
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
                    setViewMode(
                      value as
                        | "board"
                        | "list"
                        | "calendar"
                    )
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

      {/* Modals */}
      <AddDealModal
        open={isAddDealModalOpen}
        onClose={() =>
          setIsAddDealModalOpen(false)
        }
        onSubmit={handleCreateDeal}
        initialStage={selectedDealStage}
      />

      <MoveDealModal
        open={isMoveDealModalOpen}
        onClose={() =>
          setIsMoveDealModalOpen(false)
        }
        onMove={handleMoveDealToStage}
        deal={dealToMove}
      />

      <EditDealModal
        open={isEditDealModalOpen}
        onClose={() =>
          setIsEditDealModalOpen(false)
        }
        onSubmit={handleUpdateDeal}
        deal={dealToEdit}
      />
    </div>
  );
}

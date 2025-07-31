"use client";

import React, {
  createContext,
  useReducer,
  ReactNode,
} from "react";
import {
  Deal,
  KanbanColumn,
  KanbanStage,
} from "./types";
import { kanbanColumns as initialColumns } from "./mock-data";

// Export the context for use in hooks
export const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

// Action types
type KanbanAction =
  | {
      type: "MOVE_DEAL";
      dealId: string;
      fromStage: KanbanStage;
      toStage: KanbanStage;
    }
  | {
      type: "ADD_DEAL";
      deal: Deal;
      stage: KanbanStage;
    }
  | {
      type: "UPDATE_DEAL";
      dealId: string;
      updates: Partial<Deal>;
    }
  | { type: "DELETE_DEAL"; dealId: string }
  | {
      type: "BULK_MOVE_DEALS";
      dealIds: string[];
      toStage: KanbanStage;
    }
  | {
      type: "BULK_DELETE_DEALS";
      dealIds: string[];
    }
  | {
      type: "REORDER_DEALS";
      stage: KanbanStage;
      startIndex: number;
      endIndex: number;
    }
  | {
      type: "CLEAR_GMAIL_DEALS";
    }
  | {
      type: "SET_DEALS";
      deals: Deal[];
    };

// State interface
interface KanbanState {
  columns: KanbanColumn[];
}

// Context interface
export interface KanbanContextType {
  state: KanbanState;
  dispatch: React.Dispatch<KanbanAction>;
  // Helper functions
  moveDeal: (
    dealId: string,
    fromStage: KanbanStage,
    toStage: KanbanStage
  ) => void;
  addDeal: (
    deal: Deal,
    stage: KanbanStage
  ) => void;
  updateDeal: (
    dealId: string,
    updates: Partial<Deal>
  ) => void;
  deleteDeal: (dealId: string) => void;
  bulkMoveDeals: (
    dealIds: string[],
    toStage: KanbanStage
  ) => void;
  bulkDeleteDeals: (dealIds: string[]) => void;
  reorderDeals: (
    stage: KanbanStage,
    startIndex: number,
    endIndex: number
  ) => void;
  getDealById: (
    dealId: string
  ) => Deal | undefined;
  getAllDeals: () => Deal[];
  clearGmailDeals: () => void;
  setDeals: (deals: Deal[]) => void;
}

// Reducer function
function kanbanReducer(
  state: KanbanState,
  action: KanbanAction
): KanbanState {
  switch (action.type) {
    case "MOVE_DEAL": {
      const { dealId, fromStage, toStage } =
        action;

      // Find the deal to move
      const fromColumn = state.columns.find(
        (col) => col.id === fromStage
      );
      const deal = fromColumn?.deals.find(
        (d) => d.id === dealId
      );

      if (!deal) return state;

      // Update deal stage
      const updatedDeal = {
        ...deal,
        stage: toStage,
        updatedAt: new Date(),
      };

      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.id === fromStage) {
            // Remove deal from source column
            return {
              ...column,
              deals: column.deals.filter(
                (d) => d.id !== dealId
              ),
            };
          } else if (column.id === toStage) {
            // Add deal to target column
            return {
              ...column,
              deals: [
                ...column.deals,
                updatedDeal,
              ],
            };
          }
          return column;
        }),
      };
    }

    case "ADD_DEAL": {
      const { deal, stage } = action;
      const newDeal = {
        ...deal,
        id: deal.id || Date.now().toString(),
        stage,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        ...state,
        columns: state.columns.map((column) =>
          column.id === stage
            ? {
                ...column,
                deals: [...column.deals, newDeal],
              }
            : column
        ),
      };
    }

    case "UPDATE_DEAL": {
      const { dealId, updates } = action;

      return {
        ...state,
        columns: state.columns.map((column) => ({
          ...column,
          deals: column.deals.map((deal) =>
            deal.id === dealId
              ? {
                  ...deal,
                  ...updates,
                  updatedAt: new Date(),
                } as Deal
              : deal
          ),
        })),
      };
    }

    case "DELETE_DEAL": {
      const { dealId } = action;

      return {
        ...state,
        columns: state.columns.map((column) => ({
          ...column,
          deals: column.deals.filter(
            (deal) => deal.id !== dealId
          ),
        })),
      };
    }

    case "BULK_MOVE_DEALS": {
      const { dealIds, toStage } = action;

      return {
        ...state,
        columns: state.columns.map((column) => {
          // Remove deals from all columns
          const remainingDeals =
            column.deals.filter(
              (deal) => !dealIds.includes(deal.id)
            );

          if (column.id === toStage) {
            // Add moved deals to target column
            const movedDeals = state.columns
              .flatMap((col) => col.deals)
              .filter((deal) =>
                dealIds.includes(deal.id)
              )
              .map((deal) => ({
                ...deal,
                stage: toStage,
                updatedAt: new Date(),
              }));

            return {
              ...column,
              deals: [
                ...remainingDeals,
                ...movedDeals,
              ],
            };
          }

          return {
            ...column,
            deals: remainingDeals,
          };
        }),
      };
    }

    case "BULK_DELETE_DEALS": {
      const { dealIds } = action;

      return {
        ...state,
        columns: state.columns.map((column) => ({
          ...column,
          deals: column.deals.filter(
            (deal) => !dealIds.includes(deal.id)
          ),
        })),
      };
    }

    case "REORDER_DEALS": {
      const { stage, startIndex, endIndex } =
        action;

      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.id === stage) {
            const newDeals = [...column.deals];
            const [reorderedDeal] =
              newDeals.splice(startIndex, 1);
            newDeals.splice(
              endIndex,
              0,
              reorderedDeal
            );

            return {
              ...column,
              deals: newDeals,
            };
          }
          return column;
        }),
      };
    }

    case "CLEAR_GMAIL_DEALS": {
      return {
        ...state,
        columns: state.columns.map((column) => ({
          ...column,
          deals: column.deals.filter(
            (deal) => !deal.isFromGmail
          ),
        })),
      };
    }

    case "SET_DEALS": {
      const { deals } = action;

      // Group deals by stage
      const dealsByStage = deals.reduce((acc, deal) => {
        if (!acc[deal.stage]) {
          acc[deal.stage] = [];
        }
        acc[deal.stage].push(deal);
        return acc;
      }, {} as Record<KanbanStage, Deal[]>);

      return {
        ...state,
        columns: state.columns.map((column) => ({
          ...column,
          deals: [
            ...column.deals.filter(d => !d.isFromGmail), // Keep non-Gmail deals
            ...(dealsByStage[column.id] || []) // Add new Gmail deals
          ],
        })),
      };
    }

    default:
      return state;

  }
}

// Provider component
interface KanbanProviderProps {
  children: ReactNode;
}

// Provider component
export function KanbanProvider({
  children,
}: KanbanProviderProps) {
  const [state, dispatch] = useReducer(
    kanbanReducer,
    {
      columns: initialColumns,
    }
  );

  // Helper functions
  const moveDeal = (
    dealId: string,
    fromStage: KanbanStage,
    toStage: KanbanStage
  ) => {
    dispatch({
      type: "MOVE_DEAL",
      dealId,
      fromStage,
      toStage,
    });
  };

  const addDeal = (
    deal: Deal,
    stage: KanbanStage
  ) => {
    dispatch({
      type: "ADD_DEAL",
      deal,
      stage,
    });
  };

  const updateDeal = (
    dealId: string,
    updates: Partial<Deal>
  ) => {
    dispatch({
      type: "UPDATE_DEAL",
      dealId,
      updates,
    });
  };

  const deleteDeal = (dealId: string) => {
    dispatch({
      type: "DELETE_DEAL",
      dealId,
    });
  };

  const bulkMoveDeals = (
    dealIds: string[],
    toStage: KanbanStage
  ) => {
    dispatch({
      type: "BULK_MOVE_DEALS",
      dealIds,
      toStage,
    });
  };

  const bulkDeleteDeals = (dealIds: string[]) => {
    dispatch({
      type: "BULK_DELETE_DEALS",
      dealIds,
    });
  };

  const reorderDeals = (
    stage: KanbanStage,
    startIndex: number,
    endIndex: number
  ) => {
    dispatch({
      type: "REORDER_DEALS",
      stage,
      startIndex,
      endIndex,
    });
  };

  const getDealById = (
    dealId: string
  ): Deal | undefined => {
    return state.columns
      .flatMap((col) => col.deals)
      .find((deal) => deal.id === dealId);
  };

  const getAllDeals = (): Deal[] => {
    return state.columns.flatMap(
      (col) => col.deals
    );
  };

  const clearGmailDeals = () => {
    dispatch({ type: "CLEAR_GMAIL_DEALS" });
  };

  const setDeals = (deals: Deal[]) => {
    dispatch({ type: "SET_DEALS", deals });
  };

  const contextValue: KanbanContextType = {
    state,
    dispatch,
    moveDeal,
    addDeal,
    updateDeal,
    deleteDeal,
    bulkMoveDeals,
    bulkDeleteDeals,
    reorderDeals,
    getDealById,
    getAllDeals,
    clearGmailDeals,
    setDeals,
  };

  return (
    <KanbanContext.Provider value={contextValue}>
      {children}
    </KanbanContext.Provider>
  );
}
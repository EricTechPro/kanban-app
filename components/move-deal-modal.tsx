"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Deal, KanbanStage } from "@/lib/types";
import { Move, ArrowRight } from "lucide-react";

interface MoveDealModalProps {
  open: boolean;
  onClose: () => void;
  onMove: (toStage: KanbanStage) => void;
  deal: Deal | null;
}

const stageOptions: {
  value: KanbanStage;
  label: string;
  color: string;
}[] = [
  {
    value: "prospecting",
    label: "Prospecting",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "initial-contact",
    label: "Initial Contact",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "negotiation",
    label: "Negotiation",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "contract-sent",
    label: "Contract Sent",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "contract-signed",
    label: "Contract Signed",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "content-creation",
    label: "Content Creation",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "content-review",
    label: "Content Review",
    color: "bg-teal-100 text-teal-800",
  },
  {
    value: "published",
    label: "Published",
    color: "bg-emerald-100 text-emerald-800",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-gray-100 text-gray-800",
  },
];

export function MoveDealModal({
  open,
  onClose,
  onMove,
  deal,
}: MoveDealModalProps) {
  const [selectedStage, setSelectedStage] =
    useState<KanbanStage | "">("");

  const handleMove = () => {
    if (selectedStage && deal) {
      onMove(selectedStage as KanbanStage);
      onClose();
      setSelectedStage("");
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedStage("");
  };

  if (!deal) return null;

  const currentStage = stageOptions.find(
    (stage) => stage.value === deal.stage
  );
  const targetStage = stageOptions.find(
    (stage) => stage.value === selectedStage
  );

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Move className="h-5 w-5" />
            <span>Move Deal</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Deal Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={deal.brandLogo}
                />
                <AvatarFallback className="text-xs bg-gray-200">
                  {deal.brand
                    .substring(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                  {deal.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {deal.brand}
                </p>
              </div>
            </div>
          </div>

          {/* Stage Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <Label className="text-xs text-gray-500">
                  From
                </Label>
                {currentStage && (
                  <Badge
                    className={`mt-1 ${currentStage.color}`}
                  >
                    {currentStage.label}
                  </Badge>
                )}
              </div>

              <ArrowRight className="h-4 w-4 text-gray-400" />

              <div className="text-center">
                <Label className="text-xs text-gray-500">
                  To
                </Label>
                {targetStage && (
                  <Badge
                    className={`mt-1 ${targetStage.color}`}
                  >
                    {targetStage.label}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage-select">
                Select new stage
              </Label>
              <Select
                value={selectedStage}
                onValueChange={setSelectedStage}
              >
                <SelectTrigger id="stage-select">
                  <SelectValue placeholder="Choose a stage..." />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions
                    .filter(
                      (stage) =>
                        stage.value !== deal.stage
                    )
                    .map((stage) => (
                      <SelectItem
                        key={stage.value}
                        value={stage.value}
                      >
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              stage.color.split(
                                " "
                              )[0]
                            }`}
                          />
                          <span>
                            {stage.label}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={!selectedStage}
            className="flex items-center space-x-2"
          >
            <Move className="h-4 w-4" />
            <span>Move Deal</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

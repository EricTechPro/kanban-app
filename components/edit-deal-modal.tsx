"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Deal, KanbanStage } from "@/lib/types";
import {
  CalendarIcon,
  X,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const editDealSchema = z.object({
  title: z.string().min(1, "Title is required"),
  brand: z.string().min(1, "Brand is required"),
  value: z
    .number()
    .min(0, "Value must be positive"),
  currency: z
    .string()
    .min(1, "Currency is required"),
  dueDate: z.date(),
  priority: z.enum([
    "low",
    "medium",
    "high",
    "urgent",
  ]),
  stage: z.enum([
    "prospecting",
    "initial-contact",
    "negotiation",
    "contract-sent",
    "in-production",
    "completed",
  ]),
  progress: z.number().min(0).max(100),
  dealType: z.enum([
    "sponsored-video",
    "product-review",
    "brand-integration",
    "other",
  ]),
  startDate: z.date().optional(),
  contentRequirements: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
  notes: z.string().optional(),
});

type EditDealFormData = z.infer<
  typeof editDealSchema
>;

interface EditDealModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    dealId: string,
    updates: Partial<Deal>
  ) => void;
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
    value: "in-production",
    label: "In Production",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-gray-100 text-gray-800",
  },
];

export function EditDealModal({
  open,
  onClose,
  onSubmit,
  deal,
}: EditDealModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [deliverables, setDeliverables] =
    useState<string[]>([]);
  const [newDeliverable, setNewDeliverable] =
    useState("");

  const form = useForm<EditDealFormData>({
    resolver: zodResolver(editDealSchema),
    defaultValues: {
      title: "",
      brand: "",
      value: 0,
      currency: "USD",
      dueDate: new Date(),
      priority: "medium",
      stage: "prospecting",
      progress: 0,
      dealType: "sponsored-video",
      contentRequirements: "",
      estimatedHours: 0,
      notes: "",
    },
  });

  // Update form when deal changes
  useEffect(() => {
    if (deal) {
      form.reset({
        title: deal.title,
        brand: deal.brand,
        value: deal.value,
        currency: deal.currency,
        dueDate: deal.dueDate,
        priority: deal.priority,
        stage: deal.stage,
        progress: deal.progress,
        dealType: deal.dealType,
        startDate: deal.startDate,
        contentRequirements:
          deal.contentRequirements || "",
        estimatedHours: deal.estimatedHours || 0,
        notes: deal.notes || "",
      });
      setTags(deal.tags || []);
      setDeliverables(deal.deliverables || []);
    }
  }, [deal, form]);

  const handleSubmit = (
    data: EditDealFormData
  ) => {
    if (!deal) return;

    const updates: Partial<Deal> = {
      ...data,
      tags,
      deliverables,
      updatedAt: new Date(),
    };

    onSubmit(deal.id, updates);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setTags([]);
    setDeliverables([]);
    setNewTag("");
    setNewDeliverable("");
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      !tags.includes(newTag.trim())
    ) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const addDeliverable = () => {
    if (
      newDeliverable.trim() &&
      !deliverables.includes(
        newDeliverable.trim()
      )
    ) {
      setDeliverables([
        ...deliverables,
        newDeliverable.trim(),
      ]);
      setNewDeliverable("");
    }
  };

  const removeDeliverable = (
    deliverableToRemove: string
  ) => {
    setDeliverables(
      deliverables.filter(
        (deliverable) =>
          deliverable !== deliverableToRemove
      )
    );
  };

  if (!deal) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            handleSubmit
          )}
          className="space-y-6"
        >
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Deal Title *
              </Label>
              <Input
                id="title"
                {...form.register("title")}
                placeholder="Enter deal title"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600">
                  {
                    form.formState.errors.title
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">
                Brand *
              </Label>
              <Input
                id="brand"
                {...form.register("brand")}
                placeholder="Enter brand name"
              />
              {form.formState.errors.brand && (
                <p className="text-sm text-red-600">
                  {
                    form.formState.errors.brand
                      .message
                  }
                </p>
              )}
            </div>
          </div>

          {/* Value and Currency */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="value">
                Deal Value *
              </Label>
              <Input
                id="value"
                type="number"
                {...form.register("value", {
                  valueAsNumber: true,
                })}
                placeholder="0"
              />
              {form.formState.errors.value && (
                <p className="text-sm text-red-600">
                  {
                    form.formState.errors.value
                      .message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">
                Currency
              </Label>
              <Select
                value={form.watch("currency")}
                onValueChange={(value) =>
                  form.setValue("currency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    USD
                  </SelectItem>
                  <SelectItem value="EUR">
                    EUR
                  </SelectItem>
                  <SelectItem value="GBP">
                    GBP
                  </SelectItem>
                  <SelectItem value="CAD">
                    CAD
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority, Stage, and Deal Type */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority
              </Label>
              <Select
                value={form.watch("priority")}
                onValueChange={(value) =>
                  form.setValue(
                    "priority",
                    value as Deal["priority"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    Low
                  </SelectItem>
                  <SelectItem value="medium">
                    Medium
                  </SelectItem>
                  <SelectItem value="high">
                    High
                  </SelectItem>
                  <SelectItem value="urgent">
                    Urgent
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={form.watch("stage")}
                onValueChange={(value) =>
                  form.setValue(
                    "stage",
                    value as KanbanStage
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((stage) => (
                    <SelectItem
                      key={stage.value}
                      value={stage.value}
                    >
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dealType">
                Deal Type
              </Label>
              <Select
                value={form.watch("dealType")}
                onValueChange={(value) =>
                  form.setValue(
                    "dealType",
                    value as Deal["dealType"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sponsored-video">
                    Sponsored Video
                  </SelectItem>
                  <SelectItem value="product-review">
                    Product Review
                  </SelectItem>
                  <SelectItem value="brand-integration">
                    Brand Integration
                  </SelectItem>
                  <SelectItem value="other">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <Label htmlFor="progress">
              Progress ({form.watch("progress")}%)
            </Label>
            <div className="space-y-2">
              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                step="5"
                {...form.register("progress", {
                  valueAsNumber: true,
                })}
                className="w-full"
              />
              <Progress
                value={form.watch("progress")}
                className="w-full"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("dueDate") &&
                        "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("dueDate")
                      ? format(
                          form.watch("dueDate")!,
                          "PPP"
                        )
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch(
                      "dueDate"
                    )}
                    onSelect={(date) =>
                      date &&
                      form.setValue(
                        "dueDate",
                        date
                      )
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.watch("startDate") &&
                        "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.watch("startDate")
                      ? format(
                          form.watch("startDate")!,
                          "PPP"
                        )
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.watch(
                      "startDate"
                    )}
                    onSelect={(date) =>
                      form.setValue(
                        "startDate",
                        date
                      )
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-600"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) =>
                  setNewTag(e.target.value)
                }
                placeholder="Add a tag"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addTag())
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-2">
            <Label>Deliverables</Label>
            <div className="space-y-2 mb-2">
              {deliverables.map(
                (deliverable, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">
                      {deliverable}
                    </span>
                    <X
                      className="h-4 w-4 cursor-pointer hover:text-red-600"
                      onClick={() =>
                        removeDeliverable(
                          deliverable
                        )
                      }
                    />
                  </div>
                )
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={newDeliverable}
                onChange={(e) =>
                  setNewDeliverable(
                    e.target.value
                  )
                }
                placeholder="Add a deliverable"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(),
                  addDeliverable())
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDeliverable}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Requirements */}
          <div className="space-y-2">
            <Label htmlFor="contentRequirements">
              Content Requirements
            </Label>
            <Textarea
              id="contentRequirements"
              {...form.register(
                "contentRequirements"
              )}
              placeholder="Describe the content requirements..."
              rows={3}
            />
          </div>

          {/* Estimated Hours */}
          <div className="space-y-2">
            <Label htmlFor="estimatedHours">
              Estimated Hours
            </Label>
            <Input
              id="estimatedHours"
              type="number"
              {...form.register(
                "estimatedHours",
                { valueAsNumber: true }
              )}
              placeholder="0"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                form.formState.isSubmitting
              }
            >
              {form.formState.isSubmitting
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Deal, KanbanStage } from "@/lib/types";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Upload,
  File,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

const dealSchema = z.object({
  title: z
    .string()
    .min(1, "Deal name is required"),
  brand: z.string().min(1, "Brand is required"),
  value: z
    .number()
    .min(0, "Deal value must be positive"),
  currency: z
    .string()
    .min(1, "Currency is required"),
  dealType: z.enum([
    "sponsored-video",
    "product-review",
    "brand-integration",
    "other",
  ]),
  priority: z.enum([
    "low",
    "medium",
    "high",
    "urgent",
  ]),
  startDate: z.date().optional(),
  dueDate: z.date(),
  contentRequirements: z.string().optional(),
  deliverables: z.array(z.string()),
  estimatedHours: z.number().optional(),
  primaryContactName: z
    .string()
    .min(1, "Primary contact name is required"),
  primaryContactEmail: z
    .string()
    .min(1, "Email is required")
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Invalid email address"
    ),
  primaryContactPhone: z.string().optional(),
  secondaryContactName: z.string().optional(),
  secondaryContactEmail: z.string().optional(),
  secondaryContactPhone: z.string().optional(),
  tags: z.array(z.string()),
  notes: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface AddDealModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (deal: Partial<Deal>) => void;
  initialStage?: KanbanStage;
}

export function AddDealModal({
  open,
  onClose,
  onSubmit,
  initialStage,
}: AddDealModalProps) {
  const [currentStep, setCurrentStep] =
    useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [deliverables, setDeliverables] =
    useState<string[]>([]);
  const [
    customDeliverable,
    setCustomDeliverable,
  ] = useState("");
  const [attachments, setAttachments] = useState<
    File[]
  >([]);

  const form = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      currency: "USD",
      dealType: "sponsored-video",
      priority: "medium",
      deliverables: [],
      tags: [],
    },
  });

  const totalSteps = 3;
  const progressPercentage =
    (currentStep / totalSteps) * 100;

  const brands = [
    "TechCorp",
    "GameZone",
    "LifeStyle Co",
    "DevTools Inc",
  ];
  const availableTags = [
    "tech",
    "gaming",
    "lifestyle",
    "review",
    "sponsored",
    "partnership",
    "collaboration",
  ];
  const deliverableOptions = [
    "Video Content",
    "Social Media Posts",
    "Blog Post",
    "Email Newsletter",
  ];

  const handleNext = async () => {
    const fieldsToValidate =
      getFieldsForStep(currentStep);
    const isValid = await form.trigger(
      fieldsToValidate
    );

    if (isValid) {
      setCurrentStep((prev) =>
        Math.min(prev + 1, totalSteps)
      );
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) =>
      Math.max(prev - 1, 1)
    );
  };

  const getFieldsForStep = (
    step: number
  ): (keyof DealFormData)[] => {
    switch (step) {
      case 1:
        return [
          "title",
          "brand",
          "value",
          "currency",
          "dealType",
          "priority",
        ];
      case 2:
        return ["dueDate"];
      case 3:
        return [
          "primaryContactName",
          "primaryContactEmail",
        ];
      default:
        return [];
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(
      (tag) => tag !== tagToRemove
    );
    setTags(newTags);
    form.setValue("tags", newTags);
  };

  const toggleDeliverable = (
    deliverable: string
  ) => {
    const newDeliverables = deliverables.includes(
      deliverable
    )
      ? deliverables.filter(
          (d) => d !== deliverable
        )
      : [...deliverables, deliverable];
    setDeliverables(newDeliverables);
    form.setValue(
      "deliverables",
      newDeliverables
    );
  };

  const addCustomDeliverable = () => {
    if (
      customDeliverable &&
      !deliverables.includes(customDeliverable)
    ) {
      const newDeliverables = [
        ...deliverables,
        customDeliverable,
      ];
      setDeliverables(newDeliverables);
      form.setValue(
        "deliverables",
        newDeliverables
      );
      setCustomDeliverable("");
    }
  };

  const handleSubmit = (data: DealFormData) => {
    const dealData: Partial<Deal> = {
      title: data.title,
      brand: data.brand,
      value: data.value,
      currency: data.currency,
      dealType: data.dealType,
      priority: data.priority,
      stage: initialStage || "prospecting",
      startDate: data.startDate,
      dueDate: data.dueDate,
      contentRequirements:
        data.contentRequirements,
      deliverables: data.deliverables,
      estimatedHours: data.estimatedHours,
      primaryContact: {
        name: data.primaryContactName,
        email: data.primaryContactEmail,
        phone: data.primaryContactPhone,
      },
      secondaryContact:
        data.secondaryContactName &&
        data.secondaryContactEmail
          ? {
              name: data.secondaryContactName,
              email: data.secondaryContactEmail,
              phone: data.secondaryContactPhone,
            }
          : undefined,
      tags: data.tags,
      notes: data.notes,
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onSubmit(dealData);
    onClose();
    form.reset();
    setCurrentStep(1);
    setTags([]);
    setDeliverables([]);
    setAttachments([]);
  };

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            Deal Name *
          </Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Enter deal name"
          />
          {form.formState.errors.title && (
            <Alert variant="destructive">
              <AlertDescription>
                {
                  form.formState.errors.title
                    .message
                }
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">
            Brand/Company *
          </Label>
          <Select
            onValueChange={(value) =>
              form.setValue("brand", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select or type brand name" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem
                  key={brand}
                  value={brand}
                >
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
          >
            Add New Brand
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency">
              Currency
            </Label>
            <Select
              onValueChange={(value) =>
                form.setValue("currency", value)
              }
              defaultValue="USD"
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
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">
              Amount *
            </Label>
            <Input
              id="value"
              type="number"
              {...form.register("value", {
                valueAsNumber: true,
              })}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Deal Type</Label>
          <RadioGroup
            onValueChange={(value) =>
              form.setValue(
                "dealType",
                value as
                  | "sponsored-video"
                  | "product-review"
                  | "brand-integration"
                  | "other"
              )
            }
            defaultValue="sponsored-video"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="sponsored-video"
                id="sponsored-video"
              />
              <Label htmlFor="sponsored-video">
                Sponsored Video
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="product-review"
                id="product-review"
              />
              <Label htmlFor="product-review">
                Product Review
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="brand-integration"
                id="brand-integration"
              />
              <Label htmlFor="brand-integration">
                Brand Integration
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="other"
                id="other"
              />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Priority Level</Label>
          <Select
            onValueChange={(value) =>
              form.setValue(
                "priority",
                value as
                  | "low"
                  | "medium"
                  | "high"
                  | "urgent"
              )
            }
            defaultValue="medium"
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
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>
          Timeline & Deliverables
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
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

          <div className="space-y-2">
            <Label>Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("dueDate")
                    ? format(
                        form.watch("dueDate"),
                        "PPP"
                      )
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch("dueDate")}
                  onSelect={(date) =>
                    date &&
                    form.setValue("dueDate", date)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

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
          <p className="text-xs text-gray-500">
            {form.watch("contentRequirements")
              ?.length || 0}{" "}
            characters
          </p>
        </div>

        <div className="space-y-2">
          <Label>Deliverables</Label>
          <div className="space-y-2">
            {deliverableOptions.map(
              (deliverable) => (
                <div
                  key={deliverable}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={deliverable}
                    checked={deliverables.includes(
                      deliverable
                    )}
                    onCheckedChange={() =>
                      toggleDeliverable(
                        deliverable
                      )
                    }
                  />
                  <Label htmlFor={deliverable}>
                    {deliverable}
                  </Label>
                </div>
              )
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="custom"
                checked={!!customDeliverable}
                onCheckedChange={(checked) => {
                  if (!checked)
                    setCustomDeliverable("");
                }}
              />
              <Label htmlFor="custom">
                Custom:
              </Label>
              <Input
                value={customDeliverable}
                onChange={(e) =>
                  setCustomDeliverable(
                    e.target.value
                  )
                }
                placeholder="Enter custom deliverable"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCustomDeliverable();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <div className="space-y-2">
            <Label>Unit</Label>
            <Select defaultValue="hours">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">
                  Hours
                </SelectItem>
                <SelectItem value="days">
                  Days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Contact & Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h4 className="font-medium">
            Primary Contact
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryContactName">
                Name *
              </Label>
              <Input
                id="primaryContactName"
                {...form.register(
                  "primaryContactName"
                )}
                placeholder="Contact name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContactEmail">
                Email *
              </Label>
              <Input
                id="primaryContactEmail"
                type="email"
                {...form.register(
                  "primaryContactEmail"
                )}
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryContactPhone">
                Phone
              </Label>
              <Input
                id="primaryContactPhone"
                type="tel"
                {...form.register(
                  "primaryContactPhone"
                )}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">
            Secondary Contact (Optional)
          </h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="secondaryContactName">
                Name
              </Label>
              <Input
                id="secondaryContactName"
                {...form.register(
                  "secondaryContactName"
                )}
                placeholder="Contact name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryContactEmail">
                Email
              </Label>
              <Input
                id="secondaryContactEmail"
                type="email"
                {...form.register(
                  "secondaryContactEmail"
                )}
                placeholder="contact@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryContactPhone">
                Phone
              </Label>
              <Input
                id="secondaryContactPhone"
                type="tel"
                {...form.register(
                  "secondaryContactPhone"
                )}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="space-y-2">
            <Command className="border">
              <CommandInput
                placeholder="Add tags..."
                value={tagInput}
                onValueChange={setTagInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
              />
              <CommandList>
                <CommandEmpty>
                  No tags found.
                </CommandEmpty>
                <CommandGroup>
                  {availableTags
                    .filter(
                      (tag) =>
                        tag.includes(
                          tagInput.toLowerCase()
                        ) && !tags.includes(tag)
                    )
                    .map((tag) => (
                      <CommandItem
                        key={tag}
                        onSelect={() =>
                          addTag(tag)
                        }
                      >
                        {tag}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...form.register("notes")}
            placeholder="Additional notes about this deal..."
            rows={3}
          />
          <p className="text-xs text-gray-500">
            {form.watch("notes")?.length || 0}{" "}
            characters
          </p>
        </div>

        <div className="space-y-2">
          <Label>File Attachments</Label>
          <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag & drop files here
              </p>
              <Button variant="outline" size="sm">
                Browse Files
              </Button>
            </CardContent>
          </Card>
          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 border rounded"
                >
                  <File className="h-4 w-4" />
                  <span className="text-sm flex-1">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setAttachments((prev) =>
                        prev.filter(
                          (_, i) => i !== index
                        )
                      )
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>
              Add New Sponsorship Deal
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>
                {Math.round(progressPercentage)}%
                complete
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2"
            />
          </div>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(
            handleSubmit
          )}
          className="space-y-6"
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <DialogFooter className="flex justify-between">
            <div className="flex-1">
              <Button
                type="button"
                variant="outline"
              >
                Save as Draft
              </Button>
            </div>

            <div className="flex space-x-2">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Create Deal
                </Button>
              )}
            </div>

            <div className="flex-1 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

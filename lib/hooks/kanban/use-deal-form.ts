import { useState, useCallback } from 'react';
import { Deal, DealFormData, KanbanStage } from '@/lib/types';
import { useKanban } from './use-kanban';


interface UseDealFormReturn {
  formData: DealFormData;
  setFormData: React.Dispatch<React.SetStateAction<DealFormData>>;
  resetForm: () => void;
  submitDeal: (stage: KanbanStage) => void;
  updateDeal: (dealId: string) => void;
  isSubmitting: boolean;
  error: string | null;
}

const initialFormData: DealFormData = {
  title: '',
  brand: '',
  value: 0,
  currency: 'USD',
  dueDate: '',
  priority: 'medium',
  dealType: 'sponsored-video',
  deliverables: [],
  primaryContact: {
    name: '',
    email: '',
  },
  tags: [],
};

export function useDealForm(initialDeal?: Deal): UseDealFormReturn {
  const { addDeal, updateDeal: updateDealInContext } = useKanban();
  const [formData, setFormData] = useState<DealFormData>(() => {
    if (initialDeal) {
      return {
        title: initialDeal.title,
        brand: initialDeal.brand,
        value: initialDeal.value,
        currency: initialDeal.currency,
        dueDate: initialDeal.dueDate.toISOString().split('T')[0],
        priority: initialDeal.priority,
        dealType: initialDeal.dealType,
        startDate: initialDeal.startDate?.toISOString().split('T')[0],
        contentRequirements: initialDeal.contentRequirements,
        deliverables: initialDeal.deliverables,
        estimatedHours: initialDeal.estimatedHours,
        primaryContact: initialDeal.primaryContact,
        secondaryContact: initialDeal.secondaryContact,
        notes: initialDeal.notes,
        tags: initialDeal.tags,
      };
    }
    return initialFormData;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setError(null);
  }, []);

  const submitDeal = useCallback((stage: KanbanStage) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const newDeal: Deal = {
        id: `deal-${Date.now()}`,
        ...formData,
        dueDate: new Date(formData.dueDate),
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        stage,
        progress: 0,
        attachments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addDeal(newDeal, stage);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deal');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, addDeal, resetForm]);

  const updateDeal = useCallback((dealId: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedDeal: Partial<Deal> = {
        ...formData,
        dueDate: new Date(formData.dueDate),
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        updatedAt: new Date(),
      };

      updateDealInContext(dealId, updatedDeal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update deal');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, updateDealInContext]);

  return {
    formData,
    setFormData,
    resetForm,
    submitDeal,
    updateDeal,
    isSubmitting,
    error,
  };
}
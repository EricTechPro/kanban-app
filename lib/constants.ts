// Kanban stages configuration
export const KANBAN_STAGES = {
  PROSPECTING: 'prospecting',
  INITIAL_CONTACT: 'initial-contact',
  NEGOTIATION: 'negotiation',
  CONTRACT_SENT: 'contract-sent',
  CONTRACT_SIGNED: 'contract-signed',
  IN_PRODUCTION: 'in-production',
  COMPLETED: 'completed',
} as const;

export type KanbanStage = typeof KANBAN_STAGES[keyof typeof KANBAN_STAGES];

// Stage display configuration
export const STAGE_CONFIG: Record<KanbanStage, {
  label: string;
  color: string;
  description: string;
}> = {
  [KANBAN_STAGES.PROSPECTING]: {
    label: 'Prospecting',
    color: 'bg-blue-100 text-blue-800',
    description: 'Potential deals being researched',
  },
  [KANBAN_STAGES.INITIAL_CONTACT]: {
    label: 'Initial Contact',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'First contact has been made',
  },
  [KANBAN_STAGES.NEGOTIATION]: {
    label: 'Negotiation',
    color: 'bg-orange-100 text-orange-800',
    description: 'Terms are being discussed',
  },
  [KANBAN_STAGES.CONTRACT_SENT]: {
    label: 'Contract Sent',
    color: 'bg-purple-100 text-purple-800',
    description: 'Contract has been sent for review',
  },
  [KANBAN_STAGES.CONTRACT_SIGNED]: {
    label: 'Contract Signed',
    color: 'bg-purple-200 text-purple-500',
    description: 'Contract has been signed',
  },
  [KANBAN_STAGES.IN_PRODUCTION]: {
    label: 'In Production',
    color: 'bg-green-100 text-green-800',
    description: 'Content is being created',
  },
  [KANBAN_STAGES.COMPLETED]: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800',
    description: 'Deal has been completed',
  },
};

// Priority configuration
export const PRIORITY_CONFIG = {
  LOW: { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  HIGH: { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  URGENT: { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' },
} as const;

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Deal type configuration
export const DEAL_TYPE_CONFIG = {
  SPONSORED_VIDEO: {
    value: 'sponsored-video',
    label: 'Sponsored Video',
    icon: '🎥',
  },
  PRODUCT_REVIEW: {
    value: 'product-review',
    label: 'Product Review',
    icon: '📦',
  },
  BRAND_INTEGRATION: {
    value: 'brand-integration',
    label: 'Brand Integration',
    icon: '🤝',
  },
  OTHER: {
    value: 'other',
    label: 'Other',
    icon: '📄',
  },
} as const;

export type DealType = 'sponsored-video' | 'product-review' | 'brand-integration' | 'other';

// Gmail sync configuration
export const GMAIL_CONFIG = {
  LABELS: {
    PREFIX: 'Kanban',
    SEPARATOR: '/',
  },
  SYNC: {
    DEFAULT_PRIORITY_DAYS: {
      HIGH: 2,
      MEDIUM: 7,
    },
    DEFAULT_DUE_DATE_DAYS: 30,
    MIN_EMAILS_FOR_HIGH_PRIORITY: 5,
    MIN_EMAILS_FOR_MEDIUM_PRIORITY: 2,
  },
  TAGS: {
    KEYWORDS: {
      sponsorship: ['sponsor', 'sponsorship', 'sponsored'],
      collaboration: ['collab', 'collaboration', 'collaborate'],
      partnership: ['partner', 'partnership'],
      review: ['review', 'product review'],
      video: ['video', 'content', 'youtube'],
      product: ['product', 'item', 'merchandise'],
    },
  },
} as const;

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// UI configuration
export const UI_CONFIG = {
  ANIMATIONS: {
    DURATION: 200,
    EASING: 'ease-in-out',
  },
  DRAG_DROP: {
    ACTIVATION_DELAY: 250,
    ANIMATION_DURATION: 200,
  },
  MODALS: {
    OVERLAY_OPACITY: 0.5,
    ANIMATION_DURATION: 150,
  },
  TOAST: {
    DURATION: 5000,
    POSITION: 'bottom-right',
  },
} as const;
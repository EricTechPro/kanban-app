import { KanbanStage, Priority, DealType } from './constants';

// Contact information
export interface Contact {
  name: string;
  email: string;
  phone?: string;
  role?: string;
  company?: string;
}

// File attachment
export interface FileAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

// Base deal interface
export interface BaseDeal {
  id: string;
  title: string;
  brand: string;
  brandLogo?: string;
  value: number;
  currency: string;
  dueDate: Date;
  priority: Priority;
  stage: KanbanStage;
  progress: number;
  tags: string[];
  dealType: DealType;
  startDate?: Date;
  contentRequirements?: string;
  deliverables: string[];
  estimatedHours?: number;
  primaryContact: Contact;
  secondaryContact?: Contact;
  notes?: string;
  attachments?: FileAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

// Gmail-specific deal properties
export interface GmailDealProperties {
  isFromGmail: true;
  gmailMessageId: string;
  gmailThreadId: string;
  gmailMessages: GmailMessage[];
  emailCount: number;
  lastEmailDate: Date;
}

// Manual deal properties
export interface ManualDealProperties {
  isFromGmail?: false;
  gmailMessageId?: never;
  gmailThreadId?: never;
  gmailMessages?: never;
  emailCount?: never;
  lastEmailDate?: never;
}

// Deal type with discriminated union
export type Deal = BaseDeal & (GmailDealProperties | ManualDealProperties);

// Type guards
export function isGmailDeal(deal: Deal): deal is BaseDeal & GmailDealProperties {
  return deal.isFromGmail === true;
}

export function isManualDeal(deal: Deal): deal is BaseDeal & ManualDealProperties {
  return !deal.isFromGmail;
}

// Gmail message interface
export interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string[];
  subject: string;
  snippet: string;
  body?: string;
  date: Date;
  attachments?: GmailAttachment[];
  labels: string[];
}

// Gmail attachment interface
export interface GmailAttachment {
  filename: string;
  mimeType: string;
  size: number;
  attachmentId: string;
}

// Gmail thread interface
export interface GmailThread {
  threadId: string;
  messages: GmailMessage[];
  stage: KanbanStage;
}

// Kanban column interface
export interface KanbanColumn {
  id: KanbanStage;
  title: string;
  deals: Deal[];
  color: string;
}

// Kanban state interface
export interface KanbanState {
  columns: KanbanColumn[];
  isLoading: boolean;
  error: string | null;
}

// Dashboard statistics
export interface DashboardStats {
  totalDeals: number;
  totalValue: number;
  avgDealValue: number;
  dealsInProgress: number;
  completedDeals: number;
  upcomingDeadlines: number;
  conversionRate: number;
  avgTimeToClose: number;
}

// Gmail labels interface
export interface KanbanLabels {
  [key: string]: {
    id: string;
    name: string;
  };
}

// Form data interfaces
export interface DealFormData {
  title: string;
  brand: string;
  value: number;
  currency: string;
  dueDate: string;
  priority: Priority;
  dealType: DealType;
  startDate?: string;
  contentRequirements?: string;
  deliverables: string[];
  estimatedHours?: number;
  primaryContact: Contact;
  secondaryContact?: Contact;
  notes?: string;
  tags: string[];
}

// API response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter and sort options
export interface FilterOptions {
  stages?: KanbanStage[];
  priorities?: Priority[];
  dealTypes?: DealType[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface SortOptions {
  field: 'dueDate' | 'value' | 'priority' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

// Export all types
export * from './constants';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
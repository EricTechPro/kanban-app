export interface Deal {
  id: string;
  title: string;
  brand: string;
  brandLogo?: string;
  value: number;
  currency: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  stage: KanbanStage;
  progress: number;
  tags: string[];
  dealType: 'sponsored-video' | 'product-review' | 'brand-integration' | 'other';
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
  isFromGmail?: boolean;
  gmailMessageId?: string;
  gmailThreadId?: string;
}

export interface Contact {
  name: string;
  email: string;
  phone?: string;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export type KanbanStage =
  | 'prospecting'
  | 'initial-contact'
  | 'negotiation'
  | 'contract-sent'
  | 'contract-signed'
  | 'content-creation'
  | 'content-review'
  | 'published'
  | 'completed';

export interface KanbanColumn {
  id: KanbanStage;
  title: string;
  deals: Deal[];
}

export interface DashboardStats {
  totalDeals: number;
  activeDeals: number;
  completedDeals: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
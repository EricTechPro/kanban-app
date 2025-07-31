import { Deal, KanbanColumn, DashboardStats, User } from './types';
import { KANBAN_STAGES, STAGE_CONFIG } from './constants';

export const mockUser: User = {
  id: '1',
  name: 'John Creator',
  email: 'john@creator.com',
  avatar: 'https://github.com/shadcn.png'
};

export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Tech Review Sponsorship',
    brand: 'TechCorp',
    value: 5000,
    currency: 'USD',
    dueDate: new Date('2024-02-15'),
    priority: 'high',
    stage: KANBAN_STAGES.PROSPECTING,
    progress: 25,
    tags: ['tech', 'review', 'sponsored'],
    dealType: 'sponsored-video',
    startDate: new Date('2024-01-15'),
    contentRequirements: 'Create a 10-minute review video showcasing the new smartphone features',
    deliverables: ['Video Content', 'Social Media Posts'],
    estimatedHours: 20,
    primaryContact: {
      name: 'Sarah Johnson',
      email: 'sarah@techcorp.com',
      phone: '+1-555-0123'
    },
    notes: 'Initial contact made, waiting for product samples',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
    isFromGmail: false
  },
  {
    id: '2',
    title: 'Gaming Gear Partnership',
    brand: 'GameZone',
    value: 3500,
    currency: 'USD',
    dueDate: new Date('2024-02-20'),
    priority: 'medium',
    stage: KANBAN_STAGES.NEGOTIATION,
    progress: 60,
    tags: ['gaming', 'gear', 'partnership'],
    dealType: 'product-review',
    startDate: new Date('2024-01-20'),
    contentRequirements: 'Unboxing and gameplay footage with the new gaming setup',
    deliverables: ['Video Content', 'Blog Post'],
    estimatedHours: 15,
    primaryContact: {
      name: 'Mike Chen',
      email: 'mike@gamezone.com',
      phone: '+1-555-0124'
    },
    notes: 'Contract terms being discussed',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14'),
    isFromGmail: false
  },
  {
    id: '3',
    title: 'Fashion Brand Collaboration',
    brand: 'StyleHub',
    value: 4200,
    currency: 'USD',
    dueDate: new Date('2024-03-01'),
    priority: 'low',
    stage: KANBAN_STAGES.INITIAL_CONTACT,
    progress: 40,
    tags: ['fashion', 'lifestyle', 'collaboration'],
    dealType: 'brand-integration',
    deliverables: ['Instagram Posts', 'YouTube Short'],
    estimatedHours: 10,
    primaryContact: {
      name: 'Emma Wilson',
      email: 'emma@stylehub.com'
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-11'),
    isFromGmail: false
  },
  {
    id: '4',
    title: 'Fitness App Promotion',
    brand: 'FitLife',
    value: 2800,
    currency: 'USD',
    dueDate: new Date('2024-02-10'),
    priority: 'high',
    stage: KANBAN_STAGES.CONTRACT_SENT,
    progress: 75,
    tags: ['fitness', 'health', 'app'],
    dealType: 'sponsored-video',
    contentRequirements: 'Create workout routine using the app, showcase features',
    deliverables: ['Video Content', 'Instagram Stories'],
    estimatedHours: 12,
    primaryContact: {
      name: 'David Lee',
      email: 'david@fitlife.app',
      role: 'Marketing Manager'
    },
    notes: 'Contract sent for review, awaiting signature',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-13'),
    isFromGmail: false
  },
  {
    id: '5',
    title: 'Travel Vlog Sponsorship',
    brand: 'Wanderlust Co',
    value: 6000,
    currency: 'USD',
    dueDate: new Date('2024-02-25'),
    priority: 'medium',
    stage: KANBAN_STAGES.IN_PRODUCTION,
    progress: 85,
    tags: ['travel', 'vlog', 'sponsored'],
    dealType: 'sponsored-video',
    startDate: new Date('2024-01-25'),
    contentRequirements: 'Document travel experience using their luggage and travel gear',
    deliverables: ['Video Series', 'Blog Posts', 'Social Media Content'],
    estimatedHours: 30,
    primaryContact: {
      name: 'Lisa Park',
      email: 'lisa@wanderlust.co',
      company: 'Wanderlust Co'
    },
    secondaryContact: {
      name: 'Tom Brown',
      email: 'tom@wanderlust.co',
      role: 'Content Coordinator'
    },
    notes: 'Currently filming content in Bali',
    createdAt: new Date('2023-12-28'),
    updatedAt: new Date('2024-01-14'),
    isFromGmail: false
  },
  {
    id: '6',
    title: 'Software Tutorial Series',
    brand: 'CodeMaster',
    value: 4500,
    currency: 'USD',
    dueDate: new Date('2024-01-30'),
    priority: 'urgent',
    stage: KANBAN_STAGES.COMPLETED,
    progress: 100,
    tags: ['software', 'tutorial', 'education'],
    dealType: 'sponsored-video',
    deliverables: ['Video Tutorials', 'Written Guides'],
    estimatedHours: 25,
    primaryContact: {
      name: 'Alex Kumar',
      email: 'alex@codemaster.io'
    },
    notes: 'Successfully completed and published',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-10'),
    isFromGmail: false
  }
];

export const kanbanColumns: KanbanColumn[] = Object.values(KANBAN_STAGES).map(stageId => ({
  id: stageId,
  title: STAGE_CONFIG[stageId].label,
  deals: mockDeals.filter(deal => deal.stage === stageId),
  color: STAGE_CONFIG[stageId].color
}));

export const dashboardStats: DashboardStats = {
  totalDeals: mockDeals.length,
  totalValue: mockDeals.reduce((sum, deal) => sum + deal.value, 0),
  avgDealValue: mockDeals.length > 0 ? mockDeals.reduce((sum, deal) => sum + deal.value, 0) / mockDeals.length : 0,
  dealsInProgress: mockDeals.filter(deal => deal.stage !== KANBAN_STAGES.COMPLETED && deal.stage !== KANBAN_STAGES.PROSPECTING).length,
  completedDeals: mockDeals.filter(deal => deal.stage === KANBAN_STAGES.COMPLETED).length,
  upcomingDeadlines: mockDeals.filter(deal => {
    const daysUntilDue = (deal.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return daysUntilDue <= 7 && daysUntilDue > 0 && deal.stage !== KANBAN_STAGES.COMPLETED;
  }).length,
  conversionRate: mockDeals.length > 0 ? (mockDeals.filter(deal => deal.stage === KANBAN_STAGES.COMPLETED).length / mockDeals.length) * 100 : 0,
  avgTimeToClose: 15 // Mock value in days
};
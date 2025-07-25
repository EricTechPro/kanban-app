import { Deal, KanbanColumn, DashboardStats, User } from './types';

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
    stage: 'prospecting',
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
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '2',
    title: 'Gaming Gear Partnership',
    brand: 'GameZone',
    value: 3500,
    currency: 'USD',
    dueDate: new Date('2024-02-20'),
    priority: 'medium',
    stage: 'negotiation',
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
      phone: '+1-555-0456'
    },
    notes: 'Negotiating terms, almost ready to sign contract',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '3',
    title: 'Lifestyle Brand Collab',
    brand: 'LifeStyle Co',
    value: 2000,
    currency: 'USD',
    dueDate: new Date('2024-03-01'),
    priority: 'low',
    stage: 'content-creation',
    progress: 80,
    tags: ['lifestyle', 'collaboration'],
    dealType: 'brand-integration',
    startDate: new Date('2024-02-01'),
    contentRequirements: 'Integrate brand naturally into daily vlog content',
    deliverables: ['Video Content', 'Social Media Posts', 'Email Newsletter'],
    estimatedHours: 12,
    primaryContact: {
      name: 'Emma Davis',
      email: 'emma@lifestyleco.com'
    },
    notes: 'Content creation in progress, first draft ready for review',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: '4',
    title: 'Software Tutorial Series',
    brand: 'DevTools Inc',
    value: 8000,
    currency: 'USD',
    dueDate: new Date('2024-03-15'),
    priority: 'urgent',
    stage: 'contract-signed',
    progress: 40,
    tags: ['software', 'tutorial', 'series'],
    dealType: 'sponsored-video',
    startDate: new Date('2024-02-10'),
    contentRequirements: '5-part tutorial series on the new development platform',
    deliverables: ['Video Content', 'Blog Post'],
    estimatedHours: 40,
    primaryContact: {
      name: 'Alex Rodriguez',
      email: 'alex@devtools.com',
      phone: '+1-555-0789'
    },
    notes: 'Contract signed, starting content planning phase',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-08')
  }
];

export const kanbanColumns: KanbanColumn[] = [
  {
    id: 'prospecting',
    title: 'Prospecting',
    deals: mockDeals.filter(deal => deal.stage === 'prospecting')
  },
  {
    id: 'initial-contact',
    title: 'Initial Contact',
    deals: mockDeals.filter(deal => deal.stage === 'initial-contact')
  },
  {
    id: 'negotiation',
    title: 'Negotiation',
    deals: mockDeals.filter(deal => deal.stage === 'negotiation')
  },
  {
    id: 'contract-sent',
    title: 'Contract Sent',
    deals: mockDeals.filter(deal => deal.stage === 'contract-sent')
  },
  {
    id: 'contract-signed',
    title: 'Contract Signed',
    deals: mockDeals.filter(deal => deal.stage === 'contract-signed')
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    deals: mockDeals.filter(deal => deal.stage === 'content-creation')
  },
  {
    id: 'content-review',
    title: 'Content Review',
    deals: mockDeals.filter(deal => deal.stage === 'content-review')
  },
  {
    id: 'published',
    title: 'Published',
    deals: mockDeals.filter(deal => deal.stage === 'published')
  },
  {
    id: 'completed',
    title: 'Completed',
    deals: mockDeals.filter(deal => deal.stage === 'completed')
  }
];

export const dashboardStats: DashboardStats = {
  totalDeals: mockDeals.length,
  activeDeals: mockDeals.filter(deal => !['completed'].includes(deal.stage)).length,
  completedDeals: mockDeals.filter(deal => deal.stage === 'completed').length,
  totalRevenue: mockDeals.reduce((sum, deal) => sum + deal.value, 0),
  monthlyRevenue: mockDeals
    .filter(deal => deal.createdAt.getMonth() === new Date().getMonth())
    .reduce((sum, deal) => sum + deal.value, 0)
};
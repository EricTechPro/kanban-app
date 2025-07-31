import { Deal, KanbanStage, Priority, DealType } from './types';

export const mockDeals: Deal[] = [
  // Prospecting Stage
  {
    id: 'deal-1',
    title: 'TechGuru Pro - Annual Sponsorship',
    brand: 'TechGuru Pro',
    value: 50000,
    currency: 'USD',
    stage: 'prospecting' as KanbanStage,
    dealType: 'sponsorship' as DealType,
    progress: 30,
    dueDate: new Date('2024-03-15'),
    startDate: new Date('2024-02-01'),
    priority: 'high' as Priority,
    contentRequirements: 'Year-long sponsorship with monthly video integrations',
    deliverables: ['12 sponsored videos', 'Social media posts', 'Newsletter mentions'],
    estimatedHours: 48,
    primaryContact: {
      name: 'Sarah Johnson',
      email: 'sarah@techgurupro.com',
      company: 'TechGuru Pro',
      role: 'Marketing Director'
    },
    notes: 'Initial outreach sent. They have a Q1 budget for influencer partnerships.',
    tags: ['hot-lead', 'enterprise', 'annual'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    isFromGmail: true,
    gmailThreadId: 'thread_001',
    gmailMessageId: 'msg_001',
    gmailMessages: [],
    emailCount: 3,
    lastEmailDate: new Date('2024-01-20')
  },
  {
    id: 'deal-2',
    title: 'DevTools Plus - Product Review',
    brand: 'DevTools Plus',
    value: 15000,
    currency: 'USD',
    stage: 'initial-contact' as KanbanStage,
    dealType: 'product-review' as DealType,
    progress: 40,
    dueDate: new Date('2024-02-28'),
    priority: 'medium' as Priority,
    contentRequirements: '5-part video series on DevTools Plus features',
    deliverables: ['5 tutorial videos', 'Blog posts', 'Demo integration'],
    estimatedHours: 30,
    primaryContact: {
      name: 'Mike Chen',
      email: 'mike@devtoolsplus.com',
      company: 'DevTools Plus',
      role: 'Product Marketing Manager'
    },
    notes: 'Very interested in showcasing their new AI-powered debugging features.',
    tags: ['product-review', 'quick-turnaround'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
    isFromGmail: true,
    gmailThreadId: 'thread_002',
    gmailMessageId: 'msg_002',
    gmailMessages: [],
    emailCount: 5,
    lastEmailDate: new Date('2024-01-22')
  },
  {
    id: 'deal-3',
    title: 'CloudScale - Enterprise Partnership',
    brand: 'CloudScale',
    value: 75000,
    currency: 'USD',
    stage: 'negotiation' as KanbanStage,
    dealType: 'partnership' as DealType,
    progress: 60,
    dueDate: new Date('2024-04-01'),
    startDate: new Date('2024-03-01'),
    priority: 'high' as Priority,
    contentRequirements: 'In-depth review of their new cloud platform',
    deliverables: ['Platform review video', 'Written analysis', 'Benchmark tests'],
    estimatedHours: 80,
    primaryContact: {
      name: 'Lisa Wang',
      email: 'lisa@cloudscale.io',
      company: 'CloudScale',
      role: 'VP of Marketing'
    },
    notes: 'Negotiating deliverables and timeline. They want to start in February.',
    tags: ['enterprise', 'high-value'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-23')
  },
  {
    id: 'deal-4',
    title: 'AI Assistant Pro - Tutorial Series',
    brand: 'AI Assistant Pro',
    value: 25000,
    currency: 'USD',
    stage: 'negotiation' as KanbanStage,
    dealType: 'content-series' as DealType,
    progress: 75,
    dueDate: new Date('2024-03-10'),
    priority: 'medium' as Priority,
    contentRequirements: 'Comprehensive tutorial series on AI tools',
    deliverables: ['8 tutorial videos', 'Documentation', 'Code samples'],
    estimatedHours: 60,
    primaryContact: {
      name: 'David Park',
      email: 'david@aiassistantpro.com',
      company: 'AI Assistant Pro',
      role: 'Head of Developer Relations'
    },
    notes: 'Contract review in progress. Legal team reviewing terms.',
    tags: ['ai-tools', 'tutorial-series'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-24'),
    isFromGmail: true,
    gmailThreadId: 'thread_003',
    gmailMessageId: 'msg_003',
    gmailMessages: [],
    emailCount: 8,
    lastEmailDate: new Date('2024-01-24')
  },
  {
    id: 'deal-5',
    title: 'SecureVault - Security Audit Content',
    brand: 'SecureVault',
    value: 35000,
    currency: 'USD',
    stage: 'completed' as KanbanStage,
    dealType: 'sponsorship' as DealType,
    progress: 100,
    dueDate: new Date('2024-01-31'),
    priority: 'low' as Priority,
    contentRequirements: 'Security best practices video series',
    deliverables: ['4 security videos', 'Whitepaper', 'Webinar'],
    estimatedHours: 40,
    primaryContact: {
      name: 'Rachel Green',
      email: 'rachel@securevault.com',
      company: 'SecureVault',
      role: 'CMO'
    },
    notes: 'Successfully delivered all content. Payment received.',
    tags: ['completed', 'security'],
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'deal-6',
    title: 'DataFlow Analytics - Integration Guide',
    brand: 'DataFlow Analytics',
    value: 20000,
    currency: 'USD',
    stage: 'prospecting' as KanbanStage,
    dealType: 'product-review' as DealType,
    progress: 15,
    dueDate: new Date('2024-05-01'),
    priority: 'low' as Priority,
    contentRequirements: 'API integration tutorials and best practices',
    deliverables: ['Integration guide video', 'API documentation review', 'Sample code'],
    estimatedHours: 35,
    primaryContact: {
      name: 'Tom Wilson',
      email: 'tom@dataflowanalytics.com',
      company: 'DataFlow Analytics',
      role: 'Developer Advocate'
    },
    notes: 'Initial contact made. Scheduling discovery call.',
    tags: ['analytics', 'api'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'deal-7',
    title: 'MobileDev Kit - App Development Course',
    brand: 'MobileDev Kit',
    value: 45000,
    currency: 'USD',
    stage: 'initial-contact' as KanbanStage,
    dealType: 'content-series' as DealType,
    progress: 35,
    dueDate: new Date('2024-06-01'),
    startDate: new Date('2024-04-01'),
    priority: 'medium' as Priority,
    contentRequirements: 'Complete mobile app development course',
    deliverables: ['20 video lessons', 'Course materials', 'Sample projects'],
    estimatedHours: 120,
    primaryContact: {
      name: 'Jennifer Lee',
      email: 'jennifer@mobiledevkit.com',
      company: 'MobileDev Kit',
      role: 'Head of Education'
    },
    notes: 'Discussing course structure and timeline. Very engaged prospect.',
    tags: ['education', 'long-term', 'mobile'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-23'),
    isFromGmail: true,
    gmailThreadId: 'thread_004',
    gmailMessageId: 'msg_004',
    gmailMessages: [],
    emailCount: 4,
    lastEmailDate: new Date('2024-01-23')
  },
  {
    id: 'deal-9',
    title: 'WebFramework X - Migration Guide',
    brand: 'WebFramework X',
    value: 30000,
    currency: 'USD',
    stage: 'negotiation' as KanbanStage,
    dealType: 'content-series' as DealType,
    progress: 55,
    dueDate: new Date('2024-04-15'),
    priority: 'high' as Priority,
    contentRequirements: 'Framework migration guide from v3 to v4',
    deliverables: ['Migration video series', 'Written guide', 'Code examples'],
    estimatedHours: 50,
    primaryContact: {
      name: 'Maria Garcia',
      email: 'maria@webframeworkx.com',
      company: 'WebFramework X',
      role: 'Developer Relations Lead'
    },
    notes: 'Proposal sent. Awaiting feedback on timeline and deliverables.',
    tags: ['framework', 'migration', 'technical'],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-24')
  },
  {
    id: 'deal-10',
    title: 'CloudBackup Solutions - Disaster Recovery',
    brand: 'CloudBackup Solutions',
    value: 22000,
    currency: 'USD',
    stage: 'negotiation' as KanbanStage,
    dealType: 'partnership' as DealType,
    progress: 70,
    dueDate: new Date('2024-03-20'),
    priority: 'medium' as Priority,
    contentRequirements: 'Disaster recovery best practices and demo',
    deliverables: ['DR strategy video', 'Live demo', 'Case studies'],
    estimatedHours: 38,
    primaryContact: {
      name: 'Robert Kim',
      email: 'robert@cloudbackupsolutions.com',
      company: 'CloudBackup Solutions',
      role: 'VP of Sales'
    },
    notes: 'Final negotiations on pricing. They want to add extra deliverables.',
    tags: ['backup', 'enterprise', 'negotiating'],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-25'),
    isFromGmail: true,
    gmailThreadId: 'thread_005',
    gmailMessageId: 'msg_005',
    gmailMessages: [],
    emailCount: 6,
    lastEmailDate: new Date('2024-01-25')
  }
];

// Helper function to get deals by stage
export function getDealsByStage(stage: KanbanStage): Deal[] {
  return mockDeals.filter(deal => deal.stage === stage);
}

// Helper function to calculate total value by stage
export function getTotalValueByStage(stage: KanbanStage): number {
  return getDealsByStage(stage).reduce((total, deal) => total + deal.value, 0);
}

// Helper function to get upcoming deadlines
export function getUpcomingDeadlines(days: number = 7): Deal[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return mockDeals.filter(deal => {
    return deal.dueDate >= now && deal.dueDate <= futureDate &&
      deal.stage !== 'completed';
  }).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
}

// Helper function to get high priority deals
export function getHighPriorityDeals(): Deal[] {
  return mockDeals.filter(deal =>
    deal.priority === 'high' &&
    deal.stage !== 'completed'
  );
}

// Helper function to calculate dashboard stats
export function calculateDashboardStats() {
  const totalDeals = mockDeals.length;
  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealValue = totalValue / totalDeals;
  const dealsInProgress = mockDeals.filter(deal =>
    deal.stage !== 'completed'
  ).length;
  const completedDeals = mockDeals.filter(deal => deal.stage === 'completed').length;
  const upcomingDeadlines = getUpcomingDeadlines(7).length;
  const conversionRate = (completedDeals / totalDeals) * 100;

  // Calculate average time to close (in days)
  const closedDeals = mockDeals.filter(deal => deal.stage === 'completed');
  const avgTimeToClose = closedDeals.length > 0
    ? closedDeals.reduce((sum, deal) => {
      const timeToClose = (deal.updatedAt.getTime() - deal.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return sum + timeToClose;
    }, 0) / closedDeals.length
    : 0;

  return {
    totalDeals,
    totalValue,
    avgDealValue,
    dealsInProgress,
    completedDeals,
    upcomingDeadlines,
    conversionRate,
    avgTimeToClose
  };
}

// Helper function to get stage metrics
export function getStageMetrics(stage: KanbanStage) {
  const deals = getDealsByStage(stage);
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const count = deals.length;
  const avgValue = count > 0 ? totalValue / count : 0;

  // Calculate average progress for the stage
  const avgProgress = count > 0
    ? deals.reduce((sum, deal) => sum + deal.progress, 0) / count
    : 0;

  // Get high priority deals in this stage
  const highPriorityCount = deals.filter(deal => deal.priority === 'high').length;

  // Get deals with upcoming deadlines (within 7 days)
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingDeadlines = deals.filter(deal =>
    deal.dueDate >= now && deal.dueDate <= sevenDaysFromNow
  ).length;

  return {
    count,
    totalValue,
    avgValue,
    avgProgress,
    highPriorityCount,
    upcomingDeadlines,
    deals
  };
}
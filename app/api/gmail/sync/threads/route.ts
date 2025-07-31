import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { KanbanStage, GmailMessage, GmailThread } from '@/lib/types';
import { KANBAN_STAGES } from '@/lib/constants';

// Mock data for development
const mockThreadsByStage: Record<KanbanStage, GmailThread[]> = {
  [KANBAN_STAGES.PROSPECTING]: [
    {
      threadId: 'thread-1',
      messages: [
        {
          id: 'msg-1',
          threadId: 'thread-1',
          from: 'TechGuru <contact@techguru.com>',
          to: ['you@example.com'],
          subject: 'Sponsorship Opportunity for Your Channel',
          snippet: 'Hi, we love your content and would like to discuss...',
          body: 'Full email body here...',
          date: new Date('2024-01-15'),
          labels: ['INBOX', 'Kanban/Prospecting']
        }
      ],
      stage: KANBAN_STAGES.PROSPECTING
    }
  ],
  [KANBAN_STAGES.INITIAL_CONTACT]: [
    {
      threadId: 'thread-2',
      messages: [
        {
          id: 'msg-2',
          threadId: 'thread-2',
          from: 'Gaming Co <partnerships@gamingco.com>',
          to: ['you@example.com'],
          subject: 'Re: Partnership Proposal',
          snippet: 'Thanks for your interest! We\'d love to move forward...',
          body: 'Full email body here...',
          date: new Date('2024-01-10'),
          labels: ['Kanban/Initial Contact']
        }
      ],
      stage: KANBAN_STAGES.INITIAL_CONTACT
    }
  ],
  [KANBAN_STAGES.NEGOTIATION]: [
    {
      threadId: 'thread-3',
      messages: [
        {
          id: 'msg-3',
          threadId: 'thread-3',
          from: 'Fashion Brand <collab@fashionbrand.com>',
          to: ['you@example.com'],
          subject: 'Contract Terms Discussion',
          snippet: 'Here are the proposed terms for our collaboration...',
          body: 'Full email body here...',
          date: new Date('2024-01-08'),
          labels: ['Kanban/Negotiation']
        },
        {
          id: 'msg-4',
          threadId: 'thread-3',
          from: 'you@example.com',
          to: ['collab@fashionbrand.com'],
          subject: 'Re: Contract Terms Discussion',
          snippet: 'I\'ve reviewed the terms and have a few suggestions...',
          body: 'Full email body here...',
          date: new Date('2024-01-09'),
          labels: ['Kanban/Negotiation', 'SENT']
        }
      ],
      stage: KANBAN_STAGES.NEGOTIATION
    }
  ],
  [KANBAN_STAGES.CONTRACT_SENT]: [
    {
      threadId: 'thread-4',
      messages: [
        {
          id: 'msg-5',
          threadId: 'thread-4',
          from: 'Software Inc <deals@software.com>',
          to: ['you@example.com'],
          subject: 'Contract for Review',
          snippet: 'Please find attached the sponsorship contract...',
          body: 'Full email body here...',
          date: new Date('2024-01-05'),
          labels: ['Kanban/Contract Sent']
        }
      ],
      stage: KANBAN_STAGES.CONTRACT_SENT
    }
  ],
  [KANBAN_STAGES.IN_PRODUCTION]: [
    {
      threadId: 'thread-5',
      messages: [
        {
          id: 'msg-6',
          threadId: 'thread-5',
          from: 'Beauty Brand <marketing@beautybrand.com>',
          to: ['you@example.com'],
          subject: 'Content Creation Update',
          snippet: 'How\'s the video coming along? Any updates?',
          body: 'Full email body here...',
          date: new Date('2024-01-03'),
          labels: ['Kanban/In Production']
        }
      ],
      stage: KANBAN_STAGES.IN_PRODUCTION
    }
  ],
  [KANBAN_STAGES.COMPLETED]: [
    {
      threadId: 'thread-6',
      messages: [
        {
          id: 'msg-7',
          threadId: 'thread-6',
          from: 'Fitness App <success@fitnessapp.com>',
          to: ['you@example.com'],
          subject: 'Thank You - Campaign Complete!',
          snippet: 'Great job on the campaign! The results exceeded...',
          body: 'Full email body here...',
          date: new Date('2023-12-28'),
          labels: ['Kanban/Completed']
        }
      ],
      stage: KANBAN_STAGES.COMPLETED
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    // In production, this would check Gmail API authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('gmail-token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated with Gmail' },
        { status: 401 }
      );
    }

    // Collect all threads from all stages
    const allThreads: GmailThread[] = [];

    Object.entries(mockThreadsByStage).forEach(([stage, threads]) => {
      allThreads.push(...threads);
    });

    return NextResponse.json(allThreads);
  } catch (error) {
    console.error('Error fetching Gmail threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Gmail threads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { threadId, fromStage, toStage } = await request.json();

    // In production, this would update Gmail labels
    console.log(`Moving thread ${threadId} from ${fromStage} to ${toStage}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error moving Gmail thread:', error);
    return NextResponse.json(
      { error: 'Failed to move Gmail thread' },
      { status: 500 }
    );
  }
}
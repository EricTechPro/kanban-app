import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { KANBAN_STAGES, GMAIL_CONFIG } from '@/lib/constants';
import { GmailThread, KanbanStage } from '@/lib/types';

interface GmailLabel {
  id: string;
  name: string;
}

interface GmailThreadSummary {
  id: string;
  snippet?: string;
}

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  payload?: {
    headers?: Array<{
      name: string;
      value: string;
    }>;
  };
  internalDate?: string;
}

interface GmailThreadData {
  id: string;
  snippet?: string;
  messages?: GmailMessage[];
}

export async function GET() {
  try {
    console.log('[API] Fetching Gmail threads by labels');

    // Check if we have Gmail tokens
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('gmail_access_token');

    if (!accessToken) {
      console.log('[API] No Gmail access token found');
      return NextResponse.json(
        { error: 'Not authenticated with Gmail' },
        { status: 401 }
      );
    }

    // Get threads organized by stage
    const threadsByStage: Record<KanbanStage, GmailThread[]> = {} as Record<KanbanStage, GmailThread[]>;

    // Initialize empty arrays for each stage
    Object.values(KANBAN_STAGES).forEach((stage) => {
      threadsByStage[stage as KanbanStage] = [];
    });

    // First get all labels
    const labelsResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/labels',
      {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      }
    );

    if (!labelsResponse.ok) {
      console.error('[API] Failed to fetch labels:', labelsResponse.status);
      return NextResponse.json(
        { error: 'Failed to fetch Gmail labels' },
        { status: labelsResponse.status }
      );
    }

    const labelsData = await labelsResponse.json();
    const labels: GmailLabel[] = labelsData.labels || [];

    // Fetch threads for each stage label
    for (const stage of Object.values(KANBAN_STAGES)) {
      const labelName = `${GMAIL_CONFIG.LABEL_PREFIX}/${stage}`;

      try {
        // Find the label ID
        const label = labels.find((l) => l.name === labelName);

        if (!label?.id) {
          console.log(`[API] Label ${labelName} not found, skipping...`);
          continue;
        }

        // Get threads with this label
        const threadsResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/threads?labelIds=${label.id}&maxResults=50`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken.value}`,
            },
          }
        );

        if (!threadsResponse.ok) {
          console.error(`[API] Failed to fetch threads for ${stage}:`, threadsResponse.status);
          continue;
        }

        const threadsData = await threadsResponse.json();
        const threadSummaries: GmailThreadSummary[] = threadsData.threads || [];

        // Fetch full thread details
        const threads: GmailThread[] = [];
        for (const threadSummary of threadSummaries) {
          if (!threadSummary.id) continue;

          const threadResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadSummary.id}`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken.value}`,
              },
            }
          );

          if (!threadResponse.ok) {
            console.error(`[API] Failed to fetch thread ${threadSummary.id}:`, threadResponse.status);
            continue;
          }

          const threadData: GmailThreadData = await threadResponse.json();

          threads.push({
            id: threadData.id,
            snippet: threadData.snippet || '',
            messages: threadData.messages?.map((msg) => ({
              id: msg.id,
              threadId: msg.threadId,
              labelIds: msg.labelIds || [],
              snippet: msg.snippet || '',
              payload: {
                headers: msg.payload?.headers || [],
              },
              internalDate: msg.internalDate || '',
            })) || [],
          });
        }

        threadsByStage[stage as KanbanStage] = threads;
      } catch (error) {
        console.error(`[API] Error fetching threads for stage ${stage}:`, error);
      }
    }

    console.log('[API] Successfully fetched threads by labels');
    return NextResponse.json(threadsByStage);
  } catch (error) {
    console.error('[API] Error fetching Gmail threads by labels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Gmail threads' },
      { status: 500 }
    );
  }
}
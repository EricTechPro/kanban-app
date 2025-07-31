import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { KANBAN_STAGES, GMAIL_CONFIG, STAGE_CONFIG } from '@/lib/constants';
import { GmailThread, KanbanStage } from '@/lib/types';

interface GmailLabel {
  id: string;
  name: string;
  type?: string;
}

interface GmailThreadSummary {
  id: string;
  threadId: string;
  snippet: string;
  historyId: string;
}

interface GmailThreadData {
  id: string;
  snippet: string;
  messages?: {
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
  }[];
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('gmail_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Not authenticated with Gmail' },
        { status: 401 }
      );
    }

    // First, get all labels to find the Kanban labels
    const labelsResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/labels',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!labelsResponse.ok) {
      if (labelsResponse.status === 401) {
        return NextResponse.json(
          { error: 'Gmail authentication expired' },
          { status: 401 }
        );
      }
      throw new Error(`Failed to fetch labels: ${labelsResponse.status}`);
    }

    const labelsData = await labelsResponse.json();
    const labels: GmailLabel[] = labelsData.labels || [];

    console.log('[API] Available Gmail labels:', labels.map(l => l.name));

    // Initialize result object
    const threadsByStage: Record<KanbanStage, GmailThread[]> = {
      [KANBAN_STAGES.PROSPECTING]: [],
      [KANBAN_STAGES.INITIAL_CONTACT]: [],
      [KANBAN_STAGES.NEGOTIATION]: [],
      [KANBAN_STAGES.CONTRACT_SENT]: [],
      [KANBAN_STAGES.CONTRACT_SIGNED]: [],
      [KANBAN_STAGES.IN_PRODUCTION]: [],
      [KANBAN_STAGES.COMPLETED]: [],
    };

    // For each stage, find threads with that label
    for (const stage of Object.values(KANBAN_STAGES)) {
      try {
        const labelName = `${GMAIL_CONFIG.LABELS.PREFIX}${GMAIL_CONFIG.LABELS.SEPARATOR}${STAGE_CONFIG[stage as KanbanStage].label}`;

        // Find the label ID
        const label = labels.find((l) => l.name === labelName);

        console.log(`[API] Looking for label: ${labelName}`);
        console.log(`[API] Found label:`, label);

        if (!label?.id) {
          console.log(`[API] Label ${labelName} not found, skipping...`);
          continue;
        }

        // Fetch threads with this label
        const threadsResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/threads?labelIds=${label.id}&maxResults=50`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!threadsResponse.ok) {
          console.error(`[API] Failed to fetch threads for label ${labelName}:`, threadsResponse.status);
          continue;
        }

        const threadsData = await threadsResponse.json();
        const threadSummaries: GmailThreadSummary[] = threadsData.threads || [];

        console.log(`[API] Found ${threadSummaries.length} threads for stage ${stage}`);

        // Fetch full thread data for each thread
        const threads: GmailThread[] = [];
        for (const threadSummary of threadSummaries) {
          const threadResponse = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadSummary.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!threadResponse.ok) {
            console.error(`[API] Failed to fetch thread ${threadSummary.id}:`, threadResponse.status);
            continue;
          }

          const threadData: GmailThreadData = await threadResponse.json();

          threads.push({
            threadId: threadData.id,
            messages: threadData.messages?.map((msg) => {
              // Extract headers
              const headers = msg.payload?.headers || [];
              const getHeader = (name: string) =>
                headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

              return {
                id: msg.id,
                threadId: msg.threadId,
                from: getHeader('from'),
                to: getHeader('to').split(',').map(email => email.trim()).filter(Boolean),
                subject: getHeader('subject'),
                snippet: msg.snippet || '',
                date: new Date(parseInt(msg.internalDate || '0')),
                labels: msg.labelIds || [],
              };
            }) || [],
            stage: stage as KanbanStage,
          });
        }

        threadsByStage[stage as KanbanStage] = threads;
      } catch (error) {
        console.error(`[API] Error fetching threads for stage ${stage}:`, error);
      }
    }

    console.log('[API] Successfully fetched threads by labels');
    console.log('[API] Threads by stage:', Object.entries(threadsByStage).map(([stage, threads]) =>
      `${stage}: ${threads.length} threads`
    ));

    return NextResponse.json(threadsByStage);
  } catch (error) {
    console.error('[API] Error fetching Gmail threads by labels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Gmail threads' },
      { status: 500 }
    );
  }
}
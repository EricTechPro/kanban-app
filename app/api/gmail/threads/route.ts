import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { GmailThread, GmailMessage, KanbanStage } from '@/lib/types';
import { KANBAN_STAGES, GMAIL_CONFIG, STAGE_CONFIG } from '@/lib/constants';

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
      body?: {
        size: number;
        data?: string;
      };
      parts?: Array<{
        mimeType: string;
        body?: {
          size: number;
          data?: string;
        };
      }>;
    };
    internalDate?: string;
  }[];
}

interface GmailLabel {
  id: string;
  name: string;
  type?: string;
}

export async function GET(request: Request) {
  try {
    console.log('[API] Fetching Gmail threads');

    // Check if we have Gmail tokens
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('gmail_access_token')?.value;

    if (!accessToken) {
      console.log('[API] No Gmail access token found');
      return NextResponse.json(
        { error: 'Not authenticated with Gmail' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const maxResults = searchParams.get('maxResults') || '50';
    const pageToken = searchParams.get('pageToken');
    const query = searchParams.get('q'); // Gmail search query

    // First, get all labels to map label IDs to stages
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
        // Clear invalid token
        cookieStore.delete('gmail_access_token');
        return NextResponse.json(
          { error: 'Gmail authentication expired' },
          { status: 401 }
        );
      }
      throw new Error(`Failed to fetch labels: ${labelsResponse.status}`);
    }

    const labelsData = await labelsResponse.json();
    const labels: GmailLabel[] = labelsData.labels || [];

    // Create a map of label IDs to Kanban stages
    const labelIdToStage: Record<string, KanbanStage> = {};
    for (const stage of Object.values(KANBAN_STAGES)) {
      const labelName = `${GMAIL_CONFIG.LABELS.PREFIX}${GMAIL_CONFIG.LABELS.SEPARATOR}${STAGE_CONFIG[stage as KanbanStage].label}`;
      const label = labels.find((l) => l.name === labelName);
      if (label?.id) {
        labelIdToStage[label.id] = stage as KanbanStage;
      }
    }

    console.log('[API] Label ID to stage mapping:', labelIdToStage);

    // Build Gmail API URL for threads
    let gmailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=${maxResults}`;
    if (pageToken) {
      gmailUrl += `&pageToken=${pageToken}`;
    }
    if (query) {
      gmailUrl += `&q=${encodeURIComponent(query)}`;
    }

    console.log('[API] Fetching from Gmail API:', gmailUrl);

    // Fetch threads list
    const threadsResponse = await fetch(gmailUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!threadsResponse.ok) {
      console.error('[API] Gmail API error:', threadsResponse.status, threadsResponse.statusText);

      if (threadsResponse.status === 401) {
        // Clear invalid token
        cookieStore.delete('gmail_access_token');
        return NextResponse.json(
          { error: 'Gmail authentication expired' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch threads from Gmail' },
        { status: threadsResponse.status }
      );
    }

    const threadsData = await threadsResponse.json();
    const threadSummaries: GmailThreadSummary[] = threadsData.threads || [];
    const nextPageToken = threadsData.nextPageToken;

    console.log(`[API] Found ${threadSummaries.length} threads`);

    // Fetch full thread data for each thread
    const threads: GmailThread[] = [];

    for (const threadSummary of threadSummaries) {
      try {
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

        // Determine the stage based on labels
        let stage: KanbanStage = KANBAN_STAGES.PROSPECTING; // Default stage

        if (threadData.messages && threadData.messages.length > 0) {
          // Check the labels of the most recent message
          const latestMessage = threadData.messages[threadData.messages.length - 1];
          const messageLabels = latestMessage.labelIds || [];

          for (const labelId of messageLabels) {
            if (labelIdToStage[labelId]) {
              stage = labelIdToStage[labelId];
              break;
            }
          }
        }

        // Convert thread data to our format
        const messages: GmailMessage[] = threadData.messages?.map((msg) => {
          // Extract headers
          const headers = msg.payload?.headers || [];
          const getHeader = (name: string) =>
            headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

          // Extract body content
          let body = '';
          if (msg.payload?.body?.data) {
            body = Buffer.from(msg.payload.body.data, 'base64').toString('utf-8');
          } else if (msg.payload?.parts) {
            // Look for text/plain or text/html parts
            const textPart = msg.payload.parts.find(part =>
              part.mimeType === 'text/plain' || part.mimeType === 'text/html'
            );
            if (textPart?.body?.data) {
              body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
            }
          }

          return {
            id: msg.id,
            threadId: msg.threadId,
            from: getHeader('from'),
            to: getHeader('to').split(',').map(email => email.trim()).filter(Boolean),
            subject: getHeader('subject'),
            snippet: msg.snippet || '',
            body,
            date: new Date(parseInt(msg.internalDate || '0')),
            labels: msg.labelIds || [],
          };
        }) || [];

        threads.push({
          threadId: threadData.id,
          messages,
          stage,
        });
      } catch (error) {
        console.error(`[API] Error processing thread ${threadSummary.id}:`, error);
      }
    }

    console.log(`[API] Successfully processed ${threads.length} threads`);

    // Return threads with pagination info
    return NextResponse.json({
      threads,
      nextPageToken,
      totalThreads: threads.length,
    });
  } catch (error) {
    console.error('[API] Error fetching Gmail threads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Gmail threads' },
      { status: 500 }
    );
  }
}
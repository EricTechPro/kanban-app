import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface GmailHeader {
  name: string;
  value: string;
}

interface GmailMessagePart {
  headers: GmailHeader[];
}

interface GmailMessage {
  id: string;
  threadId: string;
  snippet?: string;
  labelIds?: string[];
  payload?: GmailMessagePart;
}

interface GmailMessagesListResponse {
  messages?: Array<{ id: string }>;
  nextPageToken?: string;
}

export async function GET(request: Request) {
  try {
    console.log('[API] Fetching Gmail emails');

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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const labelId = searchParams.get('labelId');
    const maxResults = searchParams.get('maxResults') || '20';

    // Build Gmail API URL
    let gmailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
    if (labelId) {
      gmailUrl += `&labelIds=${labelId}`;
    }

    console.log('[API] Fetching from Gmail API:', gmailUrl);

    // Fetch messages list
    const listResponse = await fetch(gmailUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken.value}`,
      },
    });

    if (!listResponse.ok) {
      console.error('[API] Gmail API error:', listResponse.status, listResponse.statusText);

      if (listResponse.status === 401) {
        // Clear invalid token
        cookieStore.delete('gmail_access_token');
        return NextResponse.json(
          { error: 'Gmail authentication expired' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch emails from Gmail' },
        { status: listResponse.status }
      );
    }

    const data: GmailMessagesListResponse = await listResponse.json();
    const messages = data.messages || [];

    // Fetch details for each message
    const emailPromises = messages.map(async (message) => {
      const detailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken.value}`,
          },
        }
      );

      if (!detailResponse.ok) {
        console.error('[API] Failed to fetch message details:', message.id);
        return null;
      }

      const messageData: GmailMessage = await detailResponse.json();

      // Extract email details
      const headers = messageData.payload?.headers || [];
      const subject = headers.find((h) => h.name === 'Subject')?.value || 'No Subject';
      const from = headers.find((h) => h.name === 'From')?.value || 'Unknown';
      const date = headers.find((h) => h.name === 'Date')?.value || '';

      return {
        id: messageData.id,
        threadId: messageData.threadId,
        subject,
        from,
        date,
        snippet: messageData.snippet || '',
        labelIds: messageData.labelIds || [],
      };
    });

    const emails = (await Promise.all(emailPromises)).filter(Boolean);

    console.log('[API] Fetched', emails.length, 'emails');

    return NextResponse.json(emails);
  } catch (error) {
    console.error('[API] Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
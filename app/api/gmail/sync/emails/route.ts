import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { corsHeaders } from '@/lib/cors';

const KANBAN_STAGES: Record<string, string> = {
  'kanban/prospecting': 'prospecting',
  'kanban/initial-contact': 'initial-contact',
  'kanban/negotiation': 'negotiation',
  'kanban/contract-sent': 'contract-sent',
  'kanban/contract-signed': 'contract-signed',
  'kanban/content-creation': 'content-creation',
  'kanban/content-review': 'content-review',
  'kanban/published': 'published',
  'kanban/completed': 'completed'
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  });
}

export async function GET(request: NextRequest) {
  console.log('=== Gmail Emails Sync Started ===');

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('gmail_access_token')?.value;
    const refreshToken = cookieStore.get('gmail_refresh_token')?.value;

    if (!accessToken) {
      console.log('[GET] No access token found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Initialize Gmail API
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Get all emails with kanban labels
    console.log('[GET] Fetching emails with kanban labels...');
    const messages = await gmail.users.messages.list({
      userId: 'me',
      q: 'label:kanban',
      maxResults: 100,
    });

    if (!messages.data.messages || messages.data.messages.length === 0) {
      console.log('[GET] No emails found with kanban labels');
      return NextResponse.json([], { headers: corsHeaders });
    }

    console.log(`[GET] Found ${messages.data.messages.length} emails with kanban labels`);

    // Fetch full details for each message
    const deals = [];

    for (const message of messages.data.messages) {
      try {
        const fullMessage = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
        });

        // Extract email details
        const headers = fullMessage.data.payload?.headers || [];
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown';
        const date = headers.find(h => h.name === 'Date')?.value || '';

        // Extract sender name and email
        const fromMatch = from.match(/^(.*?)\s*<(.+?)>$/);
        const senderName = fromMatch ? fromMatch[1].replace(/"/g, '') : from.split('@')[0];
        const senderEmail = fromMatch ? fromMatch[2] : from;

        // Get the stage from labels
        const labels = fullMessage.data.labelIds || [];
        let stage = 'prospecting'; // default stage

        for (const labelId of labels) {
          // Get label details to find the name
          const labelDetails = await gmail.users.labels.get({
            userId: 'me',
            id: labelId,
          });

          const labelName = labelDetails.data.name;
          if (labelName && KANBAN_STAGES[labelName]) {
            stage = KANBAN_STAGES[labelName];
            break;
          }
        }

        // Extract body preview
        let bodyPreview = '';
        const parts = fullMessage.data.payload?.parts || [];
        for (const part of parts) {
          if (part.mimeType === 'text/plain' && part.body?.data) {
            const decoded = Buffer.from(part.body.data, 'base64').toString('utf-8');
            bodyPreview = decoded.substring(0, 200) + (decoded.length > 200 ? '...' : '');
            break;
          }
        }

        // If no parts, check the main body
        if (!bodyPreview && fullMessage.data.payload?.body?.data) {
          const decoded = Buffer.from(fullMessage.data.payload.body.data, 'base64').toString('utf-8');
          bodyPreview = decoded.substring(0, 200) + (decoded.length > 200 ? '...' : '');
        }

        deals.push({
          id: message.id!,
          messageId: message.id!,
          threadId: message.threadId!,
          title: subject,
          company: senderName,
          email: senderEmail,
          stage: stage,
          value: 0, // You can extract this from email content if needed
          description: bodyPreview,
          createdAt: new Date(date).toISOString(),
          updatedAt: new Date(date).toISOString(),
          source: 'gmail',
          labels: labels,
        });
      } catch (error) {
        console.error(`[GET] Error processing message ${message.id}:`, error);
      }
    }

    console.log(`[GET] Successfully processed ${deals.length} deals`);
    console.log('=== Gmail Emails Sync Completed ===');

    return NextResponse.json(deals, { headers: corsHeaders });
  } catch (error) {
    console.error('[GET] Error syncing emails:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
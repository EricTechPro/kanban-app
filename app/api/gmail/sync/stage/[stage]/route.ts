import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { corsHeaders } from '@/lib/cors';

const STAGE_TO_LABEL = {
  'prospecting': 'kanban/prospecting',
  'initial-contact': 'kanban/initial-contact',
  'negotiation': 'kanban/negotiation',
  'contract-sent': 'kanban/contract-sent',
  'contract-signed': 'kanban/contract-signed',
  'content-creation': 'kanban/content-creation',
  'content-review': 'kanban/content-review',
  'published': 'kanban/published',
  'completed': 'kanban/completed'
};

export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: corsHeaders
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { stage: string } }
) {
  console.log(`=== Gmail Get Emails by Stage: ${params.stage} ===`);
  
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

    const labelName = STAGE_TO_LABEL[params.stage as keyof typeof STAGE_TO_LABEL];
    if (!labelName) {
      return NextResponse.json(
        { error: 'Invalid stage' },
        { status: 400, headers: corsHeaders }
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

    // Get emails with specific stage label
    console.log(`[GET] Fetching emails with label: ${labelName}`);
    const messages = await gmail.users.messages.list({
      userId: 'me',
      q: `label:"${labelName}"`,
      maxResults: 50,
    });

    if (!messages.data.messages || messages.data.messages.length === 0) {
      console.log(`[GET] No emails found for stage: ${params.stage}`);
      return NextResponse.json([], { headers: corsHeaders });
    }

    console.log(`[GET] Found ${messages.data.messages.length} emails for stage: ${params.stage}`);

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
          stage: params.stage,
          value: 0,
          description: bodyPreview,
          createdAt: new Date(date).toISOString(),
          updatedAt: new Date(date).toISOString(),
          source: 'gmail',
          labels: fullMessage.data.labelIds || [],
        });
      } catch (error) {
        console.error(`[GET] Error processing message ${message.id}:`, error);
      }
    }

    console.log(`[GET] Successfully processed ${deals.length} deals for stage: ${params.stage}`);
    
    return NextResponse.json(deals, { headers: corsHeaders });
  } catch (error) {
    console.error('[GET] Error fetching emails by stage:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
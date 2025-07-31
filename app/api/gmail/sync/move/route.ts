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

export async function POST(request: NextRequest) {
  console.log('=== Gmail Move Email Started ===');
  
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('gmail_access_token')?.value;
    const refreshToken = cookieStore.get('gmail_refresh_token')?.value;

    if (!accessToken) {
      console.log('[POST] No access token found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401, headers: corsHeaders }
      );
    }

    const { messageId, fromStage, toStage } = await request.json();
    console.log(`[POST] Moving message ${messageId} from ${fromStage} to ${toStage}`);

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

    // Get all labels to find the IDs
    const labelsResponse = await gmail.users.labels.list({
      userId: 'me',
    });

    const labels = labelsResponse.data.labels || [];
    
    // Find label IDs
    const fromLabelName = STAGE_TO_LABEL[fromStage as keyof typeof STAGE_TO_LABEL];
    const toLabelName = STAGE_TO_LABEL[toStage as keyof typeof STAGE_TO_LABEL];
    
    const fromLabel = labels.find(l => l.name === fromLabelName);
    const toLabel = labels.find(l => l.name === toLabelName);

    if (!toLabel) {
      throw new Error(`Target label ${toLabelName} not found`);
    }

    // Prepare label modifications
    const addLabelIds = [toLabel.id!];
    const removeLabelIds = fromLabel ? [fromLabel.id!] : [];

    // Update message labels
    console.log(`[POST] Updating labels: adding ${toLabelName}, removing ${fromLabelName || 'none'}`);
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: {
        addLabelIds,
        removeLabelIds,
      },
    });

    console.log('=== Gmail Move Email Completed ===');
    
    return NextResponse.json(
      { success: true },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[POST] Error moving email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to move email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
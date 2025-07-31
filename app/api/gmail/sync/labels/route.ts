import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { corsHeaders } from '@/lib/cors';

const KANBAN_STAGES = {
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
  console.log('=== Gmail Labels Sync Started ===');
  
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

    // Get existing labels
    console.log('[POST] Fetching existing labels...');
    const labelsResponse = await gmail.users.labels.list({
      userId: 'me',
    });

    const existingLabels = labelsResponse.data.labels || [];
    console.log(`[POST] Found ${existingLabels.length} existing labels`);

    // Check if parent "kanban" label exists
    let kanbanLabel = existingLabels.find(label => label.name === 'kanban');
    
    if (!kanbanLabel) {
      console.log('[POST] Creating parent "kanban" label...');
      const createResponse = await gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          name: 'kanban',
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
        },
      });
      kanbanLabel = createResponse.data;
      console.log('[POST] Created parent label:', kanbanLabel.name);
    } else {
      console.log('[POST] Parent "kanban" label already exists');
    }

    // Track results
    const results = {
      created: [] as string[],
      existing: [] as string[],
      failed: [] as { label: string; error: string }[],
    };

    // Create or verify stage labels
    const stageLabels: Record<string, any> = {};
    
    for (const [stage, labelName] of Object.entries(KANBAN_STAGES)) {
      const existingStageLabel = existingLabels.find(label => label.name === labelName);
      
      if (existingStageLabel) {
        console.log(`[POST] Label already exists: ${labelName}`);
        stageLabels[stage] = existingStageLabel;
        results.existing.push(labelName);
      } else {
        console.log(`[POST] Creating label: ${labelName}`);
        try {
          const createResponse = await gmail.users.labels.create({
            userId: 'me',
            requestBody: {
              name: labelName,
              labelListVisibility: 'labelShow',
              messageListVisibility: 'show',
              color: getColorForStage(stage),
            },
          });
          stageLabels[stage] = createResponse.data;
          results.created.push(labelName);
          console.log(`[POST] Successfully created label: ${labelName}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[POST] Failed to create label ${labelName}:`, errorMessage);
          results.failed.push({ label: labelName, error: errorMessage });
        }
      }
    }

    // Summary
    console.log('[POST] Label sync summary:', {
      created: results.created.length,
      existing: results.existing.length,
      failed: results.failed.length,
    });

    console.log('=== Gmail Labels Sync Completed ===');
    
    return NextResponse.json(
      {
        parentLabel: kanbanLabel,
        stageLabels: stageLabels,
        summary: {
          totalLabels: Object.keys(KANBAN_STAGES).length,
          created: results.created,
          existing: results.existing,
          failed: results.failed,
        },
        message: results.failed.length > 0 
          ? `Completed with ${results.failed.length} errors` 
          : 'All kanban labels are ready!',
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('[POST] Error in labels sync:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync labels',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

function getColorForStage(stage: string): any {
  const colors: Record<string, any> = {
    'prospecting': {
      backgroundColor: '#10b981', // Green
      textColor: '#ffffff'
    },
    'initial-contact': {
      backgroundColor: '#3b82f6', // Blue
      textColor: '#ffffff'
    },
    'negotiation': {
      backgroundColor: '#f59e0b', // Amber
      textColor: '#ffffff'
    },
    'contract-sent': {
      backgroundColor: '#8b5cf6', // Violet
      textColor: '#ffffff'
    },
    'contract-signed': {
      backgroundColor: '#ec4899', // Pink
      textColor: '#ffffff'
    },
    'content-creation': {
      backgroundColor: '#06b6d4', // Cyan
      textColor: '#ffffff'
    },
    'content-review': {
      backgroundColor: '#f97316', // Orange
      textColor: '#ffffff'
    },
    'published': {
      backgroundColor: '#84cc16', // Lime
      textColor: '#ffffff'
    },
    'completed': {
      backgroundColor: '#6b7280', // Gray
      textColor: '#ffffff'
    }
  };
  
  return colors[stage] || {
    backgroundColor: '#666666',
    textColor: '#ffffff'
  };
}
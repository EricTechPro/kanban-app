import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { KANBAN_STAGES, STAGE_CONFIG, GMAIL_CONFIG } from '@/lib/constants';

interface GmailLabel {
  id: string;
  name: string;
  type?: string;
  messageListVisibility?: string;
  labelListVisibility?: string;
}

interface GmailLabelsResponse {
  labels: GmailLabel[];
}

interface CreateLabelResponse {
  id: string;
  name: string;
  messageListVisibility: string;
  labelListVisibility: string;
}

export async function POST() {
  try {
    console.log('[API] Ensuring Kanban labels exist in Gmail');

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

    // First, fetch existing labels
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

      if (labelsResponse.status === 401) {
        // Clear invalid token
        cookieStore.delete('gmail_access_token');
        return NextResponse.json(
          { error: 'Gmail authentication expired' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch existing labels' },
        { status: labelsResponse.status }
      );
    }

    const labelsData: GmailLabelsResponse = await labelsResponse.json();
    const existingLabels = labelsData.labels || [];

    // Create a map of existing label names
    const existingLabelNames = new Set(
      existingLabels.map(label => label.name.toLowerCase())
    );

    // Prepare the labels we need
    const parentLabelName = GMAIL_CONFIG.LABELS.PREFIX;
    const requiredLabels = [
      parentLabelName,
      ...Object.values(KANBAN_STAGES).map(
        stage => `${parentLabelName}${GMAIL_CONFIG.LABELS.SEPARATOR}${STAGE_CONFIG[stage].label}`
      )
    ];

    const summary = {
      totalLabels: requiredLabels.length,
      created: [] as string[],
      existing: [] as string[],
      failed: [] as { label: string; error: string }[],
    };

    // Create labels that don't exist
    for (const labelName of requiredLabels) {
      if (existingLabelNames.has(labelName.toLowerCase())) {
        console.log(`[API] Label already exists: ${labelName}`);
        summary.existing.push(labelName);
        continue;
      }

      try {
        console.log(`[API] Creating label: ${labelName}`);

        const createResponse = await fetch(
          'https://gmail.googleapis.com/gmail/v1/users/me/labels',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken.value}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: labelName,
              messageListVisibility: 'show',
              labelListVisibility: 'labelShow',
            }),
          }
        );

        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error(`[API] Failed to create label ${labelName}:`, errorText);

          // Check if it's a "label already exists" error
          if (createResponse.status === 409 || errorText.includes('already exists')) {
            summary.existing.push(labelName);
          } else {
            summary.failed.push({
              label: labelName,
              error: `HTTP ${createResponse.status}: ${errorText}`,
            });
          }
          continue;
        }

        const createdLabel: CreateLabelResponse = await createResponse.json();
        console.log(`[API] Created label: ${labelName} (ID: ${createdLabel.id})`);
        summary.created.push(labelName);

      } catch (error) {
        console.error(`[API] Error creating label ${labelName}:`, error);
        summary.failed.push({
          label: labelName,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Fetch the updated labels to return the complete structure
    const updatedLabelsResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/labels',
      {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      }
    );

    if (!updatedLabelsResponse.ok) {
      console.error('[API] Failed to fetch updated labels');
      return NextResponse.json({
        summary,
        message: 'Labels processed but failed to fetch updated list',
      });
    }

    const updatedLabelsData: GmailLabelsResponse = await updatedLabelsResponse.json();
    const updatedLabels = updatedLabelsData.labels || [];

    // Find the parent label and stage labels
    const parentLabel = updatedLabels.find(
      label => label.name.toLowerCase() === parentLabelName.toLowerCase()
    );

    const stageLabels: Record<string, GmailLabel> = {};

    Object.values(KANBAN_STAGES).forEach((stage) => {
      const labelName = `${parentLabelName}${GMAIL_CONFIG.LABELS.SEPARATOR}${STAGE_CONFIG[stage].label}`;
      const label = updatedLabels.find(
        l => l.name.toLowerCase() === labelName.toLowerCase()
      );
      if (label) {
        stageLabels[stage] = label;
      }
    });

    console.log('[API] Label setup complete:', summary);

    return NextResponse.json({
      parentLabel,
      stageLabels,
      summary,
      message: summary.failed.length === 0
        ? 'All labels are ready!'
        : 'Some labels failed to create',
    });

  } catch (error) {
    console.error('[API] Error ensuring labels:', error);
    return NextResponse.json(
      {
        error: 'Failed to ensure labels',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

export async function GET() {
  try {
    console.log('[API] Fetching Gmail labels');

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

    // Fetch labels from Gmail API
    const response = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/labels',
      {
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
      }
    );

    if (!response.ok) {
      console.error('[API] Gmail API error:', response.status, response.statusText);

      if (response.status === 401) {
        // Clear invalid token
        cookieStore.delete('gmail_access_token');
        return NextResponse.json(
          { error: 'Gmail authentication expired' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch labels from Gmail' },
        { status: response.status }
      );
    }

    const data: GmailLabelsResponse = await response.json();
    const labels = data.labels || [];

    // Filter and format labels
    const formattedLabels = labels
      .filter((label) => label.type === 'user' || label.name.includes('INBOX'))
      .map((label) => ({
        id: label.id,
        name: label.name,
      }));

    console.log('[API] Fetched', formattedLabels.length, 'labels');

    return NextResponse.json(formattedLabels);
  } catch (error) {
    console.error('[API] Error fetching labels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch labels' },
      { status: 500 }
    );
  }
}
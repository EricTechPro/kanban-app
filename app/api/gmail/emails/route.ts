import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('gmail_tokens')?.value;

    if (!tokensCookie) {
      return NextResponse.json(
        { error: 'Not authenticated with Gmail' },
        { status: 401 }
      );
    }

    const tokens = JSON.parse(tokensCookie);

    if (!tokens.access_token) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 401 }
      );
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const labelIds = searchParams.get('labelIds')?.split(',') || [];
    const q = searchParams.get('q') || '';

    // Fetch emails
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      labelIds: labelIds.length > 0 ? labelIds : undefined,
      q: q || undefined
    });

    const messages = response.data.messages || [];

    // Fetch full email details
    const emails = await Promise.all(
      messages.map(async (message) => {
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full'
        });
        return msg.data;
      })
    );

    return NextResponse.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);

    // If token expired, try to refresh
    if (error instanceof Error && 'response' in error &&
      typeof error.response === 'object' && error.response !== null &&
      'status' in error.response && error.response.status === 401) {
      return NextResponse.json(
        { error: 'Authentication expired. Please re-authenticate.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
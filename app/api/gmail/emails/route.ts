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
    console.log('[Gmail Emails API] Request received');
    
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('gmail_access_token')?.value;
    const refreshToken = cookieStore.get('gmail_refresh_token')?.value;
    const tokenExpiry = cookieStore.get('gmail_token_expiry')?.value;

    console.log('[Gmail Emails API] Token status:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasExpiry: !!tokenExpiry
    });

    if (!accessToken) {
      console.log('[Gmail Emails API] No access token found');
      return NextResponse.json(
        { error: 'Not authenticated with Gmail' },
        { status: 401 }
      );
    }

    // Check if token is expired
    if (tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      const now = new Date();
      if (expiryDate < now) {
        console.log('[Gmail Emails API] Token is expired');
        return NextResponse.json(
          { error: 'Token expired', needsRefresh: true },
          { status: 401 }
        );
      }
    }

    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const labelIds = searchParams.get('labelIds')?.split(',') || [];
    const q = searchParams.get('q') || '';

    console.log('[Gmail Emails API] Query params:', { maxResults, labelIds, q });

    // Fetch emails
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      labelIds: labelIds.length > 0 ? labelIds : undefined,
      q: q || undefined
    });

    const messages = response.data.messages || [];
    console.log('[Gmail Emails API] Found messages:', messages.length);

    // Fetch details for each message
    const emailPromises = messages.map(async (message) => {
      const detail = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!
      });

      const headers = detail.data.payload?.headers || [];
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';
      const date = headers.find(h => h.name === 'Date')?.value || '';

      return {
        id: message.id,
        threadId: message.threadId,
        subject,
        from,
        date,
        snippet: detail.data.snippet || '',
        labelIds: detail.data.labelIds || []
      };
    });

    const emails = await Promise.all(emailPromises);
    console.log('[Gmail Emails API] Processed emails:', emails.length);

    return NextResponse.json({ emails });
  } catch (error) {
    console.error('[Gmail Emails API] Error:', error);
    console.error('[Gmail Emails API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
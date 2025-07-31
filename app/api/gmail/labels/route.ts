import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

export async function GET() {
  try {
    console.log('[Gmail Labels API] Request received');

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('gmail_access_token')?.value;
    const refreshToken = cookieStore.get('gmail_refresh_token')?.value;
    const tokenExpiry = cookieStore.get('gmail_token_expiry')?.value;

    console.log('[Gmail Labels API] Token status:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasExpiry: !!tokenExpiry
    });

    if (!accessToken) {
      console.log('[Gmail Labels API] No access token found');
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
        console.log('[Gmail Labels API] Token is expired');
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

    // Fetch labels
    const response = await gmail.users.labels.list({
      userId: 'me'
    });

    const labels = response.data.labels || [];
    console.log('[Gmail Labels API] Found labels:', labels.length);

    // Filter and format labels
    const formattedLabels = labels
      .filter(label => label.name && label.id)
      .map(label => ({
        id: label.id,
        name: label.name
      }));

    return NextResponse.json({ labels: formattedLabels });
  } catch (error) {
    console.error('[Gmail Labels API] Error:', error);
    console.error('[Gmail Labels API] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // If token expired, try to refresh
    if (
      error instanceof Error &&
      'response' in error &&
      typeof error.response === 'object' &&
      error.response !== null &&
      'status' in error.response &&
      error.response.status === 401
    ) {
      return NextResponse.json(
        { error: 'Authentication expired. Please re-authenticate.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch labels' },
      { status: 500 }
    );
  }
}
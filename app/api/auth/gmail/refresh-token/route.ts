import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

export async function POST() {
  try {
    const cookieStore = await cookies();
    const tokensCookie = cookieStore.get('gmail_tokens')?.value;

    if (!tokensCookie) {
      return NextResponse.json(
        { error: 'No tokens available' },
        { status: 401 }
      );
    }

    const tokens = JSON.parse(tokensCookie);

    if (!tokens.refresh_token) {
      return NextResponse.json(
        { error: 'No refresh token available' },
        { status: 401 }
      );
    }

    // Set the refresh token and refresh the access token
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update tokens in cookie
    const newTokens = {
      ...tokens,
      ...credentials
    };

    cookieStore.set('gmail_tokens', JSON.stringify(newTokens), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: newTokens.expiry_date ? Math.floor((newTokens.expiry_date - Date.now()) / 1000) : 3600,
      sameSite: 'lax'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
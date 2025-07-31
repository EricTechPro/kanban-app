import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3001/auth/callback';

export async function GET() {
  try {
    console.log('[API] Generating Gmail auth URL');

    if (!GOOGLE_CLIENT_ID) {
      console.error('[API] Google Client ID not configured');
      return NextResponse.json(
        { error: 'Google OAuth not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your environment variables.' },
        { status: 500 }
      );
    }

    // Build Google OAuth URL
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.labels',
        'https://www.googleapis.com/auth/gmail.modify',
        'email',
        'profile'
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    console.log('[API] Auth URL generated');

    return NextResponse.json({ url: authUrl });
  } catch (error) {
    console.error('[API] Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
}
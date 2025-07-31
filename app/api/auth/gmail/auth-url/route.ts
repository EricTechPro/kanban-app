import { NextResponse } from 'next/server';

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  console.log('[OPTIONS] Preflight request received for /api/auth/gmail/auth-url');
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    console.log('=== Gmail Auth URL Generation Started ===');

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Log the configuration
    console.log('[GET] OAuth Configuration:', {
      clientId: clientId ? `${clientId.substring(0, 10)}...` : 'Missing',
      redirectUri,
      appUrl,
      nodeEnv: process.env.NODE_ENV
    });

    // Check if we're in demo mode (placeholder credentials)
    if (!clientId || clientId === 'your_google_client_id_here') {
      console.log('[GET] Demo mode detected - Google OAuth not configured');
      // Return a demo mode response
      return NextResponse.json({
        authUrl: null,
        demoMode: true,
        message: 'Google OAuth not configured. Please set up your Google Cloud credentials to connect Gmail.'
      }, { headers: corsHeaders });
    }

    // Gmail API scopes
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.labels',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    console.log('[GET] Requested scopes:', scopes);

    // Generate OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopes.join(' '));
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    console.log('[GET] Generated auth URL:', authUrl.toString());
    console.log('=== Gmail Auth URL Generation Completed ===');

    return NextResponse.json({
      authUrl: authUrl.toString(),
      demoMode: false,
      redirectUri // Include in response for debugging
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('=== Error generating auth URL ===');
    console.error('[GET] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[GET] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[GET] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[GET] Full error object:', error);

    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500, headers: corsHeaders }
    );
  }
}
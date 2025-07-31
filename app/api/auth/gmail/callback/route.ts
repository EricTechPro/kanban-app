import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  console.log('[OPTIONS] Preflight request received for /api/auth/gmail/callback');
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Gmail OAuth Callback Started ===');
    console.log('[POST] Request headers:', Object.fromEntries(request.headers.entries()));

    const { code } = await request.json();
    console.log('[POST] Authorization code received:', code ? `${code.substring(0, 10)}...` : 'No');

    if (!code) {
      console.error('[POST] No authorization code provided');
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

    console.log('[POST] OAuth Configuration:', {
      clientId: clientId ? `${clientId.substring(0, 10)}...` : 'Missing',
      clientSecret: clientSecret ? 'Set' : 'Missing',
      redirectUri,
      appUrl: process.env.NEXT_PUBLIC_APP_URL
    });

    if (!clientId || !clientSecret) {
      console.error('[POST] Missing OAuth credentials');
      return NextResponse.json(
        { error: 'Google OAuth not configured properly. Please check your environment variables.' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Exchange authorization code for tokens
    console.log('[POST] Exchanging code for tokens...');
    console.log('[POST] Token exchange URL: https://oauth2.googleapis.com/token');

    const tokenRequestBody = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    console.log('[POST] Token request body (without secrets):', {
      code: `${code.substring(0, 10)}...`,
      client_id: `${clientId.substring(0, 10)}...`,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody,
    });

    console.log('[POST] Token response status:', tokenResponse.status);
    console.log('[POST] Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('[POST] Token exchange failed:', error);
      console.error('[POST] Full error response:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error
      });

      // Parse the error to provide more specific feedback
      let errorMessage = 'Failed to exchange authorization code for tokens';
      let errorDetails = error;

      try {
        const errorData = JSON.parse(error);
        if (errorData.error === 'invalid_client') {
          errorMessage = 'OAuth configuration error';
          errorDetails = 'The client credentials are invalid. Please check your Google OAuth configuration.';
          console.error('[POST] Invalid client error - possible causes:');
          console.error('1. Client secret is incorrect');
          console.error('2. Client ID is incorrect');
          console.error('3. OAuth app is disabled or deleted in Google Console');
        } else if (errorData.error === 'invalid_grant') {
          errorMessage = 'Authorization code expired or invalid';
          errorDetails = 'The authorization code has expired or was already used. Please try connecting again.';
        } else if (errorData.error === 'redirect_uri_mismatch') {
          errorMessage = 'Redirect URI mismatch';
          errorDetails = `The redirect URI doesn\'t match. Expected: ${redirectUri}`;
        }
      } catch (e) {
        // If error is not JSON, use the raw error
        console.error('[POST] Could not parse error response as JSON');
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: errorDetails,
          status: tokenResponse.status
        },
        { status: 401, headers: corsHeaders }
      );
    }

    const tokens = await tokenResponse.json();
    console.log('[POST] Tokens received:', {
      access_token: tokens.access_token ? 'Yes' : 'No',
      refresh_token: tokens.refresh_token ? 'Yes' : 'No',
      expires_in: tokens.expires_in,
      token_type: tokens.token_type,
      scope: tokens.scope
    });

    // Get user info
    console.log('[POST] Fetching user info...');
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    console.log('[POST] User info response status:', userResponse.status);

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('[POST] Failed to get user info:', errorText);
      console.error('[POST] User info error details:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: 'Failed to get user information' },
        { status: 500, headers: corsHeaders }
      );
    }

    const userInfo = await userResponse.json();
    console.log('[POST] User info received:', {
      email: userInfo.email,
      name: userInfo.name,
      id: userInfo.id,
      verified_email: userInfo.verified_email,
      picture: userInfo.picture ? 'Yes' : 'No'
    });

    // Set cookies
    console.log('[POST] Setting authentication cookies...');
    const cookieStore = await cookies();

    // Set access token
    cookieStore.set('gmail_access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
    });
    console.log('[POST] Access token cookie set');

    // Set refresh token if available
    if (tokens.refresh_token) {
      cookieStore.set('gmail_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      console.log('[POST] Refresh token saved');
    } else {
      console.log('[POST] No refresh token received (user may have already authorized the app)');
    }

    // Set user email
    cookieStore.set('gmail_email', userInfo.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    console.log('[POST] User email cookie set');

    // Set token expiry
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + tokens.expires_in);
    cookieStore.set('gmail_token_expiry', expiryDate.toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
    });
    console.log('[POST] Token expiry cookie set:', expiryDate.toISOString());

    console.log('=== Gmail OAuth Callback Completed Successfully ===');
    console.log(`[POST] User ${userInfo.email} authenticated successfully`);

    return NextResponse.json({
      success: true,
      email: userInfo.email,
      name: userInfo.name,
      message: `Successfully connected Gmail account: ${userInfo.email}`
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('=== OAuth callback error ===');
    console.error('[POST] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[POST] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[POST] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[POST] Full error object:', error);

    return NextResponse.json(
      { error: 'Failed to complete authentication', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  console.log('[OPTIONS] Preflight request received for /api/auth/gmail/status');
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    console.log('=== Gmail Auth Status Check Started ===');
    
    const cookieStore = await cookies();
    const token = cookieStore.get('gmail_access_token');
    const email = cookieStore.get('gmail_email');
    const expiry = cookieStore.get('gmail_token_expiry');
    const refreshToken = cookieStore.get('gmail_refresh_token');

    console.log('[GET] Cookie status:', {
      hasAccessToken: !!token,
      hasEmail: !!email,
      hasExpiry: !!expiry,
      hasRefreshToken: !!refreshToken,
      email: email?.value || 'Not set'
    });

    if (!token) {
      console.log('[GET] No access token found - user not connected');
      return NextResponse.json({ connected: false }, { headers: corsHeaders });
    }

    // Check if token is expired
    if (expiry) {
      const expiryDate = new Date(expiry.value);
      const now = new Date();
      const isExpired = expiryDate < now;
      
      console.log('[GET] Token expiry check:', {
        expiryDate: expiryDate.toISOString(),
        currentTime: now.toISOString(),
        isExpired,
        timeUntilExpiry: isExpired ? 'Expired' : `${Math.round((expiryDate.getTime() - now.getTime()) / 1000 / 60)} minutes`
      });

      if (isExpired) {
        console.log('[GET] Token is expired - needs refresh');
        return NextResponse.json({
          connected: false,
          needsRefresh: true,
          email: email?.value
        }, { headers: corsHeaders });
      }
    }

    console.log('[GET] User is connected:', email?.value);
    console.log('=== Gmail Auth Status Check Completed ===');

    return NextResponse.json({
      connected: true,
      email: email?.value,
      tokenExpiry: expiry?.value
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('=== Error checking auth status ===');
    console.error('[GET] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[GET] Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[GET] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[GET] Full error object:', error);
    
    return NextResponse.json(
      { error: 'Failed to check authentication status' },
      { status: 500, headers: corsHeaders }
    );
  }
}
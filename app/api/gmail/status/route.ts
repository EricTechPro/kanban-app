import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('[API] Checking Gmail authentication status');

    // Check if we have Gmail tokens in cookies
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('gmail_access_token');
    const userEmail = cookieStore.get('gmail_user_email');

    const isAuthenticated = !!accessToken;

    console.log('[API] Gmail authenticated:', isAuthenticated);

    return NextResponse.json({
      isAuthenticated,
      email: userEmail?.value || undefined,
    });
  } catch (error) {
    console.error('[API] Error checking Gmail status:', error);
    return NextResponse.json(
      {
        error: 'Failed to check Gmail status',
        isAuthenticated: false
      },
      { status: 500 }
    );
  }
}
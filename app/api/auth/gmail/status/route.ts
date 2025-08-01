import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    console.log('[API] Gmail status check');

    // Check if we have Gmail tokens in cookies
    const cookieStore = await cookies();
    const gmailToken = cookieStore.get('gmail_access_token');

    const isConnected = !!gmailToken;

    console.log('[API] Gmail connected:', isConnected);

    return NextResponse.json({
      connected: isConnected,
      hasToken: !!gmailToken,
    });
  } catch (error) {
    console.error('[API] Error checking Gmail status:', error);
    return NextResponse.json(
      {
        error: 'Failed to check Gmail status',
        connected: false
      },
      { status: 500 }
    );
  }
}
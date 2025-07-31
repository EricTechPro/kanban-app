import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('gmail_access_token')?.value;
    const userEmail = cookieStore.get('gmail_user_email')?.value;

    return NextResponse.json({
      connected: !!accessToken,
      email: userEmail || null
    });
  } catch (error) {
    console.error('Error checking Gmail status:', error);
    return NextResponse.json(
      { error: 'Failed to check Gmail status' },
      { status: 500 }
    );
  }
}
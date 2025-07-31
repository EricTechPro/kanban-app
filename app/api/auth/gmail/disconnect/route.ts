import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    // Clear all Gmail-related cookies
    cookieStore.delete('gmail_access_token');
    cookieStore.delete('gmail_refresh_token');
    cookieStore.delete('gmail_user_email');

    return NextResponse.json({
      success: true,
      message: 'Gmail disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting Gmail:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect Gmail' },
      { status: 500 }
    );
  }
}
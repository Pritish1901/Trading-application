import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { apiResponse } from '@/lib/middleware';

export async function POST() {
  try {
    const response = NextResponse.json(
      apiResponse({ message: 'Logged out successfully' }, null, 200),
      { status: 200 }
    );

    // Clear auth cookie
    response.headers.set('Set-Cookie', clearAuthCookie());

    return response;
  } catch (error) {
    console.error('[v0] Logout error:', error);
    return NextResponse.json(
      apiResponse(null, 'Logout failed', 500),
      { status: 500 }
    );
  }
}

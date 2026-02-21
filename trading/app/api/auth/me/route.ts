import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { apiResponse } from '@/lib/middleware';

export async function GET(request: Request) {
  try {
    const { user, error } = await withAuth(request);

    if (error || !user) {
      return NextResponse.json(
        apiResponse(null, error || 'Unauthorized', 401),
        { status: 401 }
      );
    }

    // TODO: Fetch user from database for current data
    // const userData = await db.users.findUnique({ where: { id: user.id } });

    return NextResponse.json(
      apiResponse(user, null, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get user error:', error);
    return NextResponse.json(
      apiResponse(null, 'Failed to fetch user', 500),
      { status: 500 }
    );
  }
}

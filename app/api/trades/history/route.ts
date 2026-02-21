import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { apiResponse } from '@/lib/middleware';

export async function GET(request: Request) {
  try {
    const { user, error } = await withAuth(request);

    if (error || !user) {
      return NextResponse.json(
        apiResponse(null, 'Unauthorized', 401),
        { status: 401 }
      );
    }

    // TODO: Fetch trades from database
    // const trades = await db.trades.findMany({
    //   where: { user_id: user.id },
    //   orderBy: { created_at: 'desc' },
    //   take: 100,
    // });

    const trades: any[] = [];

    return NextResponse.json(
      apiResponse(trades, null, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get trades error:', error);
    return NextResponse.json(
      apiResponse(null, 'Failed to fetch trades', 500),
      { status: 500 }
    );
  }
}

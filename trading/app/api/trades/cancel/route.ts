import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { apiResponse } from '@/lib/middleware';

export async function POST(request: Request) {
  try {
    const { user, error } = await withAuth(request);

    if (error || !user) {
      return NextResponse.json(
        apiResponse(null, 'Unauthorized', 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { trade_id } = body;

    if (!trade_id) {
      return NextResponse.json(
        apiResponse(null, 'Trade ID required', 400),
        { status: 400 }
      );
    }

    // TODO: Find trade and cancel it
    // TODO: Update portfolio

    return NextResponse.json(
      apiResponse({ message: 'Trade cancelled' }, null, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Cancel trade error:', error);
    return NextResponse.json(
      apiResponse(null, 'Failed to cancel trade', 500),
      { status: 500 }
    );
  }
}

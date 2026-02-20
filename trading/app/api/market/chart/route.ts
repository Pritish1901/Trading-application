import { NextResponse } from 'next/server';
import { getPriceHistory } from '@/lib/crypto-api';
import { apiResponse } from '@/lib/middleware';
import { isValidSymbol } from '@/lib/validators';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol')?.toUpperCase();
    const period = (searchParams.get('period') || '7d') as '24h' | '7d' | '30d' | '1y';

    if (!symbol || !isValidSymbol(symbol)) {
      return NextResponse.json(
        apiResponse(null, 'Invalid symbol', 400),
        { status: 400 }
      );
    }

    if (!['24h', '7d', '30d', '1y'].includes(period)) {
      return NextResponse.json(
        apiResponse(null, 'Invalid period', 400),
        { status: 400 }
      );
    }

    const history = await getPriceHistory(symbol, period);

    if (!history) {
      return NextResponse.json(
        apiResponse(null, 'Failed to fetch price history', 503),
        { status: 503 }
      );
    }

    return NextResponse.json(
      apiResponse(history, null, 200),
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      }
    );
  } catch (error) {
    console.error('[v0] Get chart error:', error);
    return NextResponse.json(
      apiResponse(null, 'Failed to fetch chart data', 500),
      { status: 500 }
    );
  }
}

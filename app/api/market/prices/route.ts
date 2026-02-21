import { NextResponse } from 'next/server';
import { getCryptoPrices, getTopCryptos } from '@/lib/crypto-api';
import { apiResponse } from '@/lib/middleware';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols')?.split(',') || [];

    let prices;

    if (symbols.length > 0) {
      // Get specific symbols
      prices = await getCryptoPrices(symbols);
    } else {
      // Get top 20 cryptocurrencies by market cap
      prices = await getTopCryptos(20);
    }

    if (!prices || prices.length === 0) {
      return NextResponse.json(
        apiResponse(null, 'Failed to fetch prices', 503),
        { status: 503 }
      );
    }

    return NextResponse.json(
      apiResponse(prices, null, 200),
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60', // Cache for 60 seconds
        },
      }
    );
  } catch (error) {
    console.error('[v0] Get prices error:', error);
    return NextResponse.json(
      apiResponse(null, 'Failed to fetch prices', 500),
      { status: 500 }
    );
  }
}

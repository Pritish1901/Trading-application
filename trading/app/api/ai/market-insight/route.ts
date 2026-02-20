import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { apiResponse } from '@/lib/middleware';
import { analyzeMarketSentiment } from '@/lib/llm';
import { isValidSymbol } from '@/lib/validators';

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
    const { symbol, timeframe = '24h', market_data } = body;

    // Validation
    if (!isValidSymbol(symbol)) {
      return NextResponse.json(
        apiResponse(null, 'Invalid symbol', 400),
        { status: 400 }
      );
    }

    if (!['24h', '7d', '30d'].includes(timeframe)) {
      return NextResponse.json(
        apiResponse(null, 'Invalid timeframe', 400),
        { status: 400 }
      );
    }

    // Call AI sentiment analysis
    const sentiment = await analyzeMarketSentiment(symbol, timeframe, market_data);

    if (!sentiment) {
      return NextResponse.json(
        apiResponse(null, 'Failed to analyze sentiment', 503),
        { status: 503 }
      );
    }

    return NextResponse.json(
      apiResponse(sentiment, null, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Market sentiment error:', error);
    return NextResponse.json(
      apiResponse(null, 'Sentiment analysis failed', 500),
      { status: 500 }
    );
  }
}

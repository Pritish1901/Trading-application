import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { apiResponse } from '@/lib/middleware';
import { analyzeTradeWithAI } from '@/lib/llm';
import { isValidSymbol, isValidNumberString } from '@/lib/validators';

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
    const { symbol, current_price, trade_type, quantity, market_context } = body;

    // Validation
    if (!isValidSymbol(symbol)) {
      return NextResponse.json(
        apiResponse(null, 'Invalid symbol', 400),
        { status: 400 }
      );
    }

    if (!isValidNumberString(String(current_price))) {
      return NextResponse.json(
        apiResponse(null, 'Invalid price', 400),
        { status: 400 }
      );
    }

    if (!['BUY', 'SELL'].includes(trade_type)) {
      return NextResponse.json(
        apiResponse(null, 'Invalid trade type', 400),
        { status: 400 }
      );
    }

    if (!isValidNumberString(String(quantity))) {
      return NextResponse.json(
        apiResponse(null, 'Invalid quantity', 400),
        { status: 400 }
      );
    }

    // Call AI analysis
    const analysis = await analyzeTradeWithAI(
      symbol,
      current_price,
      trade_type,
      quantity,
      market_context
    );

    if (!analysis) {
      return NextResponse.json(
        apiResponse(null, 'Failed to analyze trade', 503),
        { status: 503 }
      );
    }

    // TODO: Store in chat_history table
    // await db.chatHistory.create({
    //   user_id: user.id,
    //   message_type: 'trade_analysis',
    //   user_message: JSON.stringify(body),
    //   ai_response: JSON.stringify(analysis),
    //   context: { symbol, current_price, trade_type, quantity }
    // });

    return NextResponse.json(
      apiResponse(analysis, null, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Trade analyze error:', error);
    return NextResponse.json(
      apiResponse(null, 'Analysis failed', 500),
      { status: 500 }
    );
  }
}

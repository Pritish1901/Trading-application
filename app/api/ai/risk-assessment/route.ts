import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { apiResponse } from '@/lib/middleware';
import { assessTradeRisk } from '@/lib/llm';
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
    const { symbol, quantity, price, trade_type, portfolio_context } = body;

    // Validation
    if (!isValidSymbol(symbol)) {
      return NextResponse.json(
        apiResponse(null, 'Invalid symbol', 400),
        { status: 400 }
      );
    }

    if (!isValidNumberString(String(quantity)) || !isValidNumberString(String(price))) {
      return NextResponse.json(
        apiResponse(null, 'Invalid quantity or price', 400),
        { status: 400 }
      );
    }

    if (!['BUY', 'SELL'].includes(trade_type)) {
      return NextResponse.json(
        apiResponse(null, 'Invalid trade type', 400),
        { status: 400 }
      );
    }

    // Call AI risk assessment
    const assessment = await assessTradeRisk(
      symbol,
      quantity,
      price,
      trade_type,
      portfolio_context
    );

    if (!assessment) {
      return NextResponse.json(
        apiResponse(null, 'Failed to assess risk', 503),
        { status: 503 }
      );
    }

    return NextResponse.json(
      apiResponse(assessment, null, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Risk assessment error:', error);
    return NextResponse.json(
      apiResponse(null, 'Risk assessment failed', 500),
      { status: 500 }
    );
  }
}

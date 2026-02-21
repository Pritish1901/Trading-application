import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware';
import { apiResponse } from '@/lib/middleware';
import { validateTradeRequest } from '@/lib/validators';

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
    const { symbol, type, quantity, price } = body;

    // Validation
    const validationError = validateTradeRequest(symbol, String(quantity), String(price));
    if (validationError) {
      return NextResponse.json(
        apiResponse(null, validationError, 400),
        { status: 400 }
      );
    }

    if (!['BUY', 'SELL'].includes(type)) {
      return NextResponse.json(
        apiResponse(null, 'Invalid trade type', 400),
        { status: 400 }
      );
    }

    // TODO: Check user balance for BUY orders
    // TODO: Check user holdings for SELL orders
    // TODO: Create trade record in database
    // TODO: Update portfolio

    const trade = {
      id: Math.random(),
      user_id: user.id,
      symbol,
      type,
      quantity,
      price,
      total_value: quantity * price,
      status: 'COMPLETED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(
      apiResponse(trade, null, 201),
      { status: 201 }
    );
  } catch (error) {
    console.error('[v0] Execute trade error:', error);
    return NextResponse.json(
      apiResponse(null, 'Trade execution failed', 500),
      { status: 500 }
    );
  }
}

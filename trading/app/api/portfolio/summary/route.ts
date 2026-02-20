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

    // TODO: Fetch portfolio summary from database
    // const portfolio = await db.portfolios.findUnique({
    //   where: { user_id: user.id },
    // });

    const portfolio = {
      total_balance: 10000,
      total_invested: 8500,
      total_gains: 1500,
      total_gain_percent: 17.65,
      holdings: [
        {
          symbol: 'BTC',
          quantity: 0.5,
          average_price: 45000,
          current_price: 52000,
          total_value: 26000,
          gain_loss: 3500,
          gain_loss_percent: 15.46,
        },
        {
          symbol: 'ETH',
          quantity: 5,
          average_price: 1700,
          current_price: 1900,
          total_value: 9500,
          gain_loss: 1000,
          gain_loss_percent: 11.76,
        },
      ],
    };

    return NextResponse.json(
      apiResponse(portfolio, null, 200),
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get portfolio error:', error);
    return NextResponse.json(
      apiResponse(null, 'Failed to fetch portfolio', 500),
      { status: 500 }
    );
  }
}

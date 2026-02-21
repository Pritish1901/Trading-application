import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';

interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
}

export const OrderBook: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [bids, setBids] = useState<OrderBookItem[]>([]);
  const [asks, setAsks] = useState<OrderBookItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate order book data
    const mockBids: OrderBookItem[] = [
      { price: 44999, amount: 2.5, total: 112497.5 },
      { price: 44998, amount: 1.2, total: 53997.6 },
      { price: 44997, amount: 3.1, total: 139490.7 },
      { price: 44996, amount: 0.8, total: 35996.8 },
      { price: 44995, amount: 5.2, total: 233974 },
    ];

    const mockAsks: OrderBookItem[] = [
      { price: 45001, amount: 1.8, total: 81001.8 },
      { price: 45002, amount: 2.3, total: 103504.6 },
      { price: 45003, amount: 1.5, total: 67504.5 },
      { price: 45004, amount: 4.0, total: 180016 },
      { price: 45005, amount: 2.2, total: 99011 },
    ];

    setBids(mockBids);
    setAsks(mockAsks);
    setLoading(false);
  }, [symbol]);

  if (loading) {
    return <Card title="Order Book" subtitle={`${symbol} Market Orders`}>Loading...</Card>;
  }

  return (
    <Card title="Order Book" subtitle={`${symbol} Market Orders`}>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-red-400 mb-2">Asks (Sell Orders)</h4>
          <div className="space-y-1">
            {asks.map((ask, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-red-400">${ask.price.toFixed(2)}</span>
                <span className="text-neutral-400">{ask.amount}</span>
                <span className="text-neutral-500">${ask.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-700 pt-4">
          <h4 className="text-sm font-semibold text-green-400 mb-2">Bids (Buy Orders)</h4>
          <div className="space-y-1">
            {bids.map((bid, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-green-400">${bid.price.toFixed(2)}</span>
                <span className="text-neutral-400">{bid.amount}</span>
                <span className="text-neutral-500">${bid.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

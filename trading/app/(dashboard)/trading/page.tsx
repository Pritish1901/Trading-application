'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { apiCall } from '@/lib/api';

export default function TradingPage() {
  const [symbol, setSymbol] = useState('BTC');
  const [quantity, setQuantity] = useState('0.1');
  const [price, setPrice] = useState('52000');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [loading, setLoading] = useState(false);

  const { data: prices, error: pricesError } = useSWR('/api/market/prices', async (url) => {
    const response = await apiCall(url);
    return response.data || [];
  }, { refreshInterval: 30000 });

  const handleExecuteTrade = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/api/trades/execute', {
        method: 'POST',
        body: {
          symbol,
          type: tradeType,
          quantity: parseFloat(quantity),
          price: parseFloat(price),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (response.error) {
        alert(`Error: ${response.error}`);
      } else {
        alert('Trade executed successfully!');
        setQuantity('0.1');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to execute trade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Trading Dashboard</h1>
        <p className="text-neutral-400">Buy and sell cryptocurrencies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Overview */}
        <div className="lg:col-span-2 bg-neutral-800 rounded-lg p-6 border border-neutral-700">
          <h2 className="text-xl font-semibold mb-4">Market Prices</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-400 border-b border-neutral-700">
                <tr>
                  <th className="text-left py-2">Symbol</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700">
                {prices?.slice(0, 5).map((crypto: any) => (
                  <tr key={crypto.symbol} className="hover:bg-neutral-700/50 cursor-pointer">
                    <td className="py-3 font-medium">{crypto.symbol}</td>
                    <td className="text-right">${crypto.current_price.toLocaleString()}</td>
                    <td className={`text-right ${crypto.price_24h_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.price_24h_change >= 0 ? '+' : ''}{crypto.price_24h_change.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade Form */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 h-fit">
          <h2 className="text-xl font-semibold mb-4">Execute Trade</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleExecuteTrade(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Symbol</label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-600 focus:border-indigo-500 focus:outline-none"
                placeholder="BTC"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2 rounded-lg font-semibold transition ${
                  tradeType === 'BUY'
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2 rounded-lg font-semibold transition ${
                  tradeType === 'SELL'
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                }`}
              >
                Sell
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                step="0.001"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-600 focus:border-indigo-500 focus:outline-none"
                placeholder="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-600 focus:border-indigo-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition"
            >
              {loading ? 'Processing...' : 'Execute Trade'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

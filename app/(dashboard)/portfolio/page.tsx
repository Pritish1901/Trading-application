'use client';

import useSWR from 'swr';
import { apiCall } from '@/lib/api';

export default function PortfolioPage() {
  const { data: portfolio } = useSWR('/api/portfolio/summary', async (url) => {
    const response = await apiCall(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
    });
    return response.data;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
        <p className="text-neutral-400">Your cryptocurrency holdings</p>
      </div>

      {portfolio && (
        <>
          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Total Balance</p>
              <p className="text-2xl font-bold">${portfolio.total_balance?.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Total Invested</p>
              <p className="text-2xl font-bold">${portfolio.total_invested?.toLocaleString()}</p>
            </div>
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <p className="text-neutral-400 text-sm mb-1">Total Gains</p>
              <p className={`text-2xl font-bold ${(portfolio.total_gains || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${portfolio.total_gains?.toLocaleString()} ({portfolio.total_gain_percent?.toFixed(2)}%)
              </p>
            </div>
          </div>

          {/* Holdings */}
          <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
            <h2 className="text-xl font-semibold mb-4">Holdings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-neutral-400 border-b border-neutral-700">
                  <tr>
                    <th className="text-left py-2">Symbol</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Current Price</th>
                    <th className="text-right py-2">Total Value</th>
                    <th className="text-right py-2">Gain/Loss</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-700">
                  {portfolio.holdings?.map((holding: any) => (
                    <tr key={holding.symbol} className="hover:bg-neutral-700/50">
                      <td className="py-3 font-medium">{holding.symbol}</td>
                      <td className="text-right">{holding.quantity.toFixed(6)}</td>
                      <td className="text-right">${holding.current_price.toLocaleString()}</td>
                      <td className="text-right">${holding.total_value.toLocaleString()}</td>
                      <td className={`text-right ${holding.gain_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${holding.gain_loss.toLocaleString()} ({holding.gain_loss_percent.toFixed(2)}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

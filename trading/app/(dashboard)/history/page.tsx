'use client';

import useSWR from 'swr';
import { apiCall } from '@/lib/api';

export default function HistoryPage() {
  const { data: trades } = useSWR('/api/trades/history', async (url) => {
    const response = await apiCall(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
    });
    return response.data || [];
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Trade History</h1>
        <p className="text-neutral-400">Your past trades and transactions</p>
      </div>

      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-neutral-400 border-b border-neutral-700">
              <tr>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Symbol</th>
                <th className="text-left py-2">Type</th>
                <th className="text-right py-2">Quantity</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {trades && trades.length > 0 ? (
                trades.map((trade: any) => (
                  <tr key={trade.id} className="hover:bg-neutral-700/50">
                    <td className="py-3">{new Date(trade.created_at).toLocaleDateString()}</td>
                    <td className="py-3 font-medium">{trade.symbol}</td>
                    <td className={`py-3 font-semibold ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.type}
                    </td>
                    <td className="text-right">{trade.quantity.toFixed(6)}</td>
                    <td className="text-right">${trade.price.toLocaleString()}</td>
                    <td className="text-right">${trade.total_value.toLocaleString()}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          trade.status === 'COMPLETED'
                            ? 'bg-green-900/30 text-green-400'
                            : trade.status === 'PENDING'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {trade.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-neutral-400">
                    No trades yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

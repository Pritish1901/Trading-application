import React from 'react';

interface TradingChartProps {
  symbol: string;
  currentPrice: number;
  change24h: number;
}

export const TradingChart: React.FC<TradingChartProps> = ({ symbol, currentPrice, change24h }) => {
  const isPositive = change24h >= 0;

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">{symbol}</h3>
          <p className="text-neutral-400 text-sm">Price Chart</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">${currentPrice.toLocaleString()}</p>
          <p className={`text-lg font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{change24h.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Simple placeholder chart - in production, use TradingView Lightweight Charts */}
      <div className="bg-neutral-700/50 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400">Interactive chart loading...</p>
          <p className="text-sm text-neutral-500 mt-2">Integration with TradingView Lightweight Charts recommended</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-neutral-700/50 rounded-lg p-3">
          <p className="text-neutral-400 text-xs">24H High</p>
          <p className="text-white font-semibold">$50,234</p>
        </div>
        <div className="bg-neutral-700/50 rounded-lg p-3">
          <p className="text-neutral-400 text-xs">24H Low</p>
          <p className="text-white font-semibold">$44,123</p>
        </div>
        <div className="bg-neutral-700/50 rounded-lg p-3">
          <p className="text-neutral-400 text-xs">24H Volume</p>
          <p className="text-white font-semibold">$24.5B</p>
        </div>
      </div>
    </div>
  );
};

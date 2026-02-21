import React, { useMemo } from 'react';
import { Card } from '@/components/common/Card';

interface Holding {
  symbol: string;
  amount: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface AssetAllocationProps {
  holdings: Holding[];
  totalPortfolioValue: number;
}

export const AssetAllocation: React.FC<AssetAllocationProps> = ({ holdings, totalPortfolioValue }) => {
  const sortedHoldings = useMemo(() => {
    return [...holdings].sort((a, b) => b.totalValue - a.totalValue);
  }, [holdings]);

  return (
    <Card title="Asset Allocation" subtitle="Portfolio Breakdown by Value">
      <div className="space-y-4">
        {sortedHoldings.map((holding) => {
          const percentage = (holding.totalValue / totalPortfolioValue) * 100;
          const isPositive = holding.profitLoss >= 0;

          return (
            <div key={holding.symbol} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="font-semibold text-white">{holding.symbol}</p>
                  <p className="text-xs text-neutral-400">
                    {holding.amount.toFixed(8)} {holding.symbol}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    ${holding.totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </p>
                  <p className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}{holding.profitLossPercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-neutral-400 text-right">{percentage.toFixed(1)}% of portfolio</p>
            </div>
          );
        })}

        {holdings.length === 0 && (
          <div className="text-center py-8">
            <p className="text-neutral-400">No holdings yet. Start by placing a trade!</p>
          </div>
        )}
      </div>
    </Card>
  );
};

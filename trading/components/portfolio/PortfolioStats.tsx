import React from 'react';
import { Card } from '@/components/common/Card';

interface PortfolioStatsProps {
  totalValue: number;
  totalInvested: number;
  profitLoss: number;
  profitLossPercent: number;
}

export const PortfolioStats: React.FC<PortfolioStatsProps> = ({
  totalValue,
  totalInvested,
  profitLoss,
  profitLossPercent,
}) => {
  const isPositive = profitLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <div className="space-y-1">
          <p className="text-neutral-400 text-sm font-medium">Portfolio Value</p>
          <p className="text-2xl font-bold text-white">${totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-1">
          <p className="text-neutral-400 text-sm font-medium">Total Invested</p>
          <p className="text-2xl font-bold text-white">${totalInvested.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-1">
          <p className="text-neutral-400 text-sm font-medium">Profit/Loss (USD)</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{profitLoss.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </Card>

      <Card>
        <div className="space-y-1">
          <p className="text-neutral-400 text-sm font-medium">Profit/Loss (%)</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{profitLossPercent.toFixed(2)}%
          </p>
        </div>
      </Card>
    </div>
  );
};

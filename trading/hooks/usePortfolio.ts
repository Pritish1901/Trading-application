import { useEffect, useState } from 'react';

interface Holding {
  symbol: string;
  amount: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercent: number;
}

interface PortfolioData {
  totalValue: number;
  totalInvested: number;
  profitLoss: number;
  profitLossPercent: number;
  holdings: Holding[];
}

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/portfolio/summary');
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      const data = await response.json();
      setPortfolio(data.portfolio);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // Refresh every minute
    const interval = setInterval(fetchPortfolio, 60000);
    return () => clearInterval(interval);
  }, []);

  return { portfolio, loading, error, refetch: fetchPortfolio };
};

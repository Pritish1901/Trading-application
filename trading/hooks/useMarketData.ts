import { useEffect, useState } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export const useMarketData = (symbols: string[]) => {
  const [data, setData] = useState<Record<string, MarketData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (symbols.length === 0) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/market/prices?symbols=${symbols.join(',')}`);
        if (!response.ok) throw new Error('Failed to fetch market data');
        const result = await response.json();
        setData(result.data || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch market data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [symbols]);

  return { data, loading, error };
};

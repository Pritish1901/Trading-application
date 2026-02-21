import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

interface MarketInsightProps {
  crypto: string;
}

export const MarketInsight: React.FC<MarketInsightProps> = ({ crypto }) => {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGetInsight = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/market-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crypto }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsight(data.insight);
      }
    } catch (err) {
      console.error('Failed to get market insight:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Market Insight" subtitle={`AI Analysis for ${crypto}`}>
      {!insight ? (
        <Button onClick={handleGetInsight} isLoading={loading} size="lg" className="w-full">
          Get Market Sentiment
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="bg-neutral-700/50 rounded-lg p-4">
            <p className="text-neutral-300 font-medium mb-2">Sentiment:</p>
            <p
              className={`text-lg font-semibold ${
                insight.sentiment === 'bullish'
                  ? 'text-green-400'
                  : insight.sentiment === 'bearish'
                    ? 'text-red-400'
                    : 'text-yellow-400'
              }`}
            >
              {insight.sentiment?.toUpperCase()}
            </p>
          </div>

          <div className="bg-neutral-700/50 rounded-lg p-4">
            <p className="text-neutral-300 font-medium mb-2">Analysis:</p>
            <p className="text-neutral-400 text-sm">{insight.analysis}</p>
          </div>

          <Button
            onClick={() => setInsight(null)}
            variant="secondary"
            size="md"
            className="w-full"
          >
            Clear
          </Button>
        </div>
      )}
    </Card>
  );
};

import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Alert } from '@/components/common/Alert';

interface TradeAnalysisProps {
  crypto: string;
  amount: number;
  currentPrice: number;
}

export const TradeAnalysisComponent: React.FC<TradeAnalysisProps> = ({
  crypto,
  amount,
  currentPrice,
}) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crypto,
          amount,
          currentPrice,
          tradeType: 'buy',
        }),
      });

      if (!response.ok) throw new Error('Failed to get analysis');
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="AI Trade Analysis" subtitle="Get intelligent insights before trading">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {!analysis ? (
        <div className="space-y-4">
          <p className="text-neutral-300 text-sm">
            Get AI-powered analysis for your potential trade of {amount} {crypto} at ${currentPrice}
          </p>
          <Button onClick={handleAnalyze} isLoading={loading} size="lg" className="w-full">
            Analyze Trade
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-neutral-700/50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-neutral-300 font-medium">Recommendation:</span>
              <span
                className={`px-3 py-1 rounded font-semibold ${
                  analysis.recommendation === 'BUY'
                    ? 'bg-green-900/30 text-green-400'
                    : analysis.recommendation === 'SELL'
                      ? 'bg-red-900/30 text-red-400'
                      : 'bg-yellow-900/30 text-yellow-400'
                }`}
              >
                {analysis.recommendation}
              </span>
            </div>
            <p className="text-neutral-400 text-sm">
              Confidence: {(analysis.confidence * 100).toFixed(0)}%
            </p>
          </div>

          <div className="bg-neutral-700/50 rounded-lg p-4">
            <p className="text-neutral-300 font-medium mb-2">Reasoning:</p>
            <p className="text-neutral-400 text-sm">{analysis.reasoning}</p>
          </div>

          {analysis.risks && analysis.risks.length > 0 && (
            <div className="bg-red-900/10 border border-red-700 rounded-lg p-4">
              <p className="text-red-400 font-medium mb-2">Risk Factors:</p>
              <ul className="text-neutral-400 text-sm space-y-1">
                {analysis.risks.map((risk: string, idx: number) => (
                  <li key={idx} className="flex gap-2">
                    <span className="flex-shrink-0">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            onClick={() => setAnalysis(null)}
            variant="secondary"
            size="md"
            className="w-full"
          >
            New Analysis
          </Button>
        </div>
      )}
    </Card>
  );
};

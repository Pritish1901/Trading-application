'use client';

import { useState } from 'react';
import { apiCall } from '@/lib/api';

export default function AIInsightsPage() {
  const [symbol, setSymbol] = useState('BTC');
  const [price, setPrice] = useState('52000');
  const [quantity, setQuantity] = useState('0.1');
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [analysis, setAnalysis] = useState<any>(null);
  const [risk, setRisk] = useState<any>(null);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analysis');

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      // Get trade analysis
      const analysisRes = await apiCall('/api/ai/analyze', {
        method: 'POST',
        body: {
          symbol,
          current_price: parseFloat(price),
          trade_type: tradeType,
          quantity: parseFloat(quantity),
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (analysisRes.data) setAnalysis(analysisRes.data);

      // Get risk assessment
      const riskRes = await apiCall('/api/ai/risk-assessment', {
        method: 'POST',
        body: {
          symbol,
          quantity: parseFloat(quantity),
          price: parseFloat(price),
          trade_type: tradeType,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (riskRes.data) setRisk(riskRes.data);

      // Get market sentiment
      const sentimentRes = await apiCall('/api/ai/market-insight', {
        method: 'POST',
        body: {
          symbol,
          timeframe: '24h',
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (sentimentRes.data) setSentiment(sentimentRes.data);
    } catch (err) {
      console.error(err);
      alert('Failed to get AI insights');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Insights</h1>
        <p className="text-neutral-400">Get AI-powered analysis for your trades</p>
      </div>

      {/* Input Form */}
      <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
        <h2 className="text-xl font-semibold mb-4">Analyze Trade</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-600 focus:border-indigo-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-600 focus:border-indigo-500 focus:outline-none"
          />
          <input
            type="number"
            step="0.001"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-600 focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setTradeType('BUY')}
              className={`flex-1 py-2 rounded-lg font-semibold ${
                tradeType === 'BUY' ? 'bg-green-600' : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType('SELL')}
              className={`flex-1 py-2 rounded-lg font-semibold ${
                tradeType === 'SELL' ? 'bg-red-600' : 'bg-neutral-700 hover:bg-neutral-600'
              }`}
            >
              Sell
            </button>
          </div>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 text-white font-semibold rounded-lg transition"
        >
          {loading ? 'Analyzing...' : 'Get AI Analysis'}
        </button>
      </div>

      {/* Results */}
      {(analysis || risk || sentiment) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Trade Analysis */}
          {analysis && (
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4">Trade Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-400">Recommendation:</span>
                  <span
                    className={`font-bold text-lg ${
                      analysis.recommendation === 'BUY'
                        ? 'text-green-400'
                        : analysis.recommendation === 'SELL'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                    }`}
                  >
                    {analysis.recommendation}
                  </span>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-1">Confidence</p>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(analysis.confidence || 0) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm mt-1">{((analysis.confidence || 0) * 100).toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-2">Reasoning</p>
                  <p className="text-sm">{analysis.reasoning}</p>
                </div>
                {analysis.risks?.length > 0 && (
                  <div>
                    <p className="text-neutral-400 text-sm mb-2">Risks</p>
                    <ul className="text-sm space-y-1">
                      {analysis.risks.map((risk: string, i: number) => (
                        <li key={i} className="text-red-400">• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {risk && (
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-neutral-400 text-sm mb-1">Risk Level</p>
                  <p
                    className={`text-lg font-bold ${
                      risk.risk_level === 'LOW'
                        ? 'text-green-400'
                        : risk.risk_level === 'MEDIUM'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }`}
                  >
                    {risk.risk_level}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-1">Risk Score</p>
                  <p className="text-lg font-bold">{risk.risk_score}/10</p>
                </div>
                {risk.identified_risks?.length > 0 && (
                  <div>
                    <p className="text-neutral-400 text-sm mb-2">Identified Risks</p>
                    <ul className="text-sm space-y-1">
                      {risk.identified_risks.map((r: string, i: number) => (
                        <li key={i} className="text-red-400">• {r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Market Sentiment */}
          {sentiment && (
            <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
              <h3 className="text-lg font-semibold mb-4">Market Sentiment</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-400">Sentiment:</span>
                  <span
                    className={`font-bold text-lg ${
                      sentiment.sentiment === 'BULLISH'
                        ? 'text-green-400'
                        : sentiment.sentiment === 'BEARISH'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                    }`}
                  >
                    {sentiment.sentiment}
                  </span>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-1">Confidence</p>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(sentiment.confidence || 0) * 100}%` }}
                    />
                  </div>
                </div>
                {sentiment.key_drivers?.length > 0 && (
                  <div>
                    <p className="text-neutral-400 text-sm mb-2">Key Drivers</p>
                    <ul className="text-sm space-y-1">
                      {sentiment.key_drivers.map((driver: string, i: number) => (
                        <li key={i} className="text-blue-400">• {driver}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="text-neutral-400 text-sm mb-2">Outlook</p>
                  <p className="text-sm">{sentiment.outlook}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

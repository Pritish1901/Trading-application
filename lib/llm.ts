import type {
  OpenRouterRequest,
  OpenRouterResponse,
  TradeAnalysisResponse,
  RiskAssessmentResponse,
  MarketSentimentResponse,
  ChatResponse,
} from './types/llm';

const OPENROUTER_API = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

interface LLMOptions {
  temperature?: number;
  max_tokens?: number;
  response_format?: 'json' | 'text';
}

async function callOpenRouter(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: LLMOptions = {}
): Promise<string | null> {
  try {
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    const request: OpenRouterRequest = {
      model: 'openrouter/auto',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1000,
      ...(options.response_format === 'json' && {
        response_format: { type: 'json_object' },
      }),
    };

    const response = await fetch(OPENROUTER_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://crypto-trading-app.example.com',
        'X-Title': 'Crypto Trading App',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.message || response.statusText}`);
    }

    const data = (await response.json()) as OpenRouterResponse;
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('[v0] LLM API Error:', error);
    return null;
  }
}

// Trade Analysis: Recommend BUY/SELL/HOLD based on current market conditions
export async function analyzeTradeWithAI(
  symbol: string,
  currentPrice: number,
  tradeType: 'BUY' | 'SELL',
  quantity: number,
  marketContext?: string
): Promise<TradeAnalysisResponse | null> {
  const systemPrompt = `You are an expert cryptocurrency trading analyst. Analyze trades based on technical and fundamental factors. 
Always respond with valid JSON only, no markdown or extra text. Structure:
{
  "recommendation": "BUY|SELL|HOLD",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation",
  "risks": ["risk1", "risk2"],
  "target_price": number or null
}`;

  const userPrompt = `Analyze this trade opportunity:
- Symbol: ${symbol}
- Current Price: $${currentPrice}
- Trade Type: ${tradeType}
- Quantity: ${quantity}
${marketContext ? `- Market Context: ${marketContext}` : ''}

Provide JSON response with recommendation (BUY/SELL/HOLD), confidence score, reasoning, identified risks, and optional target price.`;

  const response = await callOpenRouter(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { response_format: 'json', max_tokens: 500 }
  );

  if (!response) return null;

  try {
    const parsed = JSON.parse(response);
    return {
      recommendation: parsed.recommendation || 'HOLD',
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
      reasoning: parsed.reasoning || 'No reasoning provided',
      risks: Array.isArray(parsed.risks) ? parsed.risks : [],
      target_price: parsed.target_price,
    };
  } catch {
    return null;
  }
}

// Risk Assessment: Evaluate risk level of a trade
export async function assessTradeRisk(
  symbol: string,
  quantity: number,
  price: number,
  tradeType: 'BUY' | 'SELL',
  portfolioContext?: string
): Promise<RiskAssessmentResponse | null> {
  const systemPrompt = `You are a risk management expert for cryptocurrency trading. Evaluate trade risks on a 0-10 scale.
Always respond with valid JSON only. Structure:
{
  "risk_score": 0-10,
  "risk_level": "LOW|MEDIUM|HIGH",
  "identified_risks": ["risk1", "risk2"],
  "recommendations": ["rec1", "rec2"]
}`;

  const userPrompt = `Assess the risk of this trade:
- Symbol: ${symbol}
- Quantity: ${quantity}
- Price: $${price}
- Type: ${tradeType}
${portfolioContext ? `- Portfolio Context: ${portfolioContext}` : ''}

Provide a risk assessment with score (0-10), level, identified risks, and recommendations.`;

  const response = await callOpenRouter(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { response_format: 'json', max_tokens: 600 }
  );

  if (!response) return null;

  try {
    const parsed = JSON.parse(response);
    return {
      risk_score: Math.min(10, Math.max(0, parsed.risk_score || 5)),
      risk_level: (parsed.risk_level as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM',
      identified_risks: Array.isArray(parsed.identified_risks) ? parsed.identified_risks : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    };
  } catch {
    return null;
  }
}

// Market Sentiment Analysis: Get bullish/bearish analysis
export async function analyzeMarketSentiment(
  symbol: string,
  timeframe: '24h' | '7d' | '30d' = '24h',
  marketData?: string
): Promise<MarketSentimentResponse | null> {
  const systemPrompt = `You are a cryptocurrency market sentiment analyst. Provide sentiment analysis based on market data.
Always respond with valid JSON only. Structure:
{
  "sentiment": "BULLISH|NEUTRAL|BEARISH",
  "confidence": 0.0-1.0,
  "key_drivers": ["driver1", "driver2"],
  "outlook": "brief market outlook"
}`;

  const userPrompt = `Analyze market sentiment for ${symbol} over the ${timeframe} timeframe.
${marketData ? `Market Data: ${marketData}` : ''}

Provide sentiment analysis (BULLISH/NEUTRAL/BEARISH), confidence, key drivers, and market outlook.`;

  const response = await callOpenRouter(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { response_format: 'json', max_tokens: 500 }
  );

  if (!response) return null;

  try {
    const parsed = JSON.parse(response);
    return {
      sentiment: (parsed.sentiment as 'BULLISH' | 'NEUTRAL' | 'BEARISH') || 'NEUTRAL',
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
      key_drivers: Array.isArray(parsed.key_drivers) ? parsed.key_drivers : [],
      outlook: parsed.outlook || 'No outlook provided',
    };
  } catch {
    return null;
  }
}

// Trading Chatbot: Interactive Q&A with trading context
export async function chatWithAI(
  userMessage: string,
  chatHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
  context?: string
): Promise<ChatResponse | null> {
  const systemPrompt = `You are a helpful cryptocurrency trading assistant. Answer questions about trading, markets, and portfolio management.
Be concise and provide actionable advice. ${context ? `User context: ${context}` : ''}`;

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
    ...(chatHistory || []),
    { role: 'user', content: userMessage },
  ];

  const response = await callOpenRouter(messages, {
    temperature: 0.7,
    max_tokens: 800,
  });

  if (!response) return null;

  return {
    response,
    suggestions: [
      'Analyze next trade',
      'Check market sentiment',
      'Review portfolio',
    ],
  };
}

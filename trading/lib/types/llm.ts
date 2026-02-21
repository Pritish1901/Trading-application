// LLM and AI types
export interface TradeAnalysisRequest {
  symbol: string;
  current_price: number;
  trade_type: 'BUY' | 'SELL';
  quantity: number;
  user_context?: string;
}

export interface TradeAnalysisResponse {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number; // 0-1
  reasoning: string;
  risks: string[];
  target_price?: number;
}

export interface RiskAssessmentRequest {
  symbol: string;
  quantity: number;
  price: number;
  trade_type: 'BUY' | 'SELL';
  user_portfolio?: string;
}

export interface RiskAssessmentResponse {
  risk_score: number; // 0-10
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  identified_risks: string[];
  recommendations: string[];
}

export interface MarketSentimentRequest {
  symbol: string;
  timeframe: '24h' | '7d' | '30d';
  market_context?: string;
}

export interface MarketSentimentResponse {
  sentiment: 'BULLISH' | 'NEUTRAL' | 'BEARISH';
  confidence: number; // 0-1
  key_drivers: string[];
  outlook: string;
}

export interface ChatMessage {
  id: number;
  user_id: number;
  message_type: 'trade_analysis' | 'market_insight' | 'risk_assessment' | 'chat';
  user_message: string;
  ai_response: string;
  context?: Record<string, any>;
  created_at: string;
}

export interface ChatRequest {
  message: string;
  chat_history?: ChatMessage[];
  context?: Record<string, any>;
}

export interface ChatResponse {
  response: string;
  suggestions?: string[];
}

export interface OpenRouterRequest {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

export interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

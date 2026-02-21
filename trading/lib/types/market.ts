// Market data types
export interface CryptoPrice {
  symbol: string;
  name: string;
  current_price: number;
  price_24h_change: number; // percentage
  market_cap?: number;
  volume_24h?: number;
  timestamp: string;
}

export interface Candle {
  time: number; // Unix timestamp
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketData {
  symbol: string;
  prices: CryptoPrice;
  candles: Candle[];
}

export interface PriceHistory {
  symbol: string;
  period: '24h' | '7d' | '30d' | '1y';
  candles: Candle[];
}

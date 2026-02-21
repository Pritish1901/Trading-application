// Crypto API wrapper for market data
import type { CryptoPrice, Candle, PriceHistory } from './types/market';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Map of common crypto symbols to CoinGecko IDs
const SYMBOL_TO_COINGECKO: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  SOL: 'solana',
  DOGE: 'dogecoin',
  USDT: 'tether',
  USDC: 'usd-coin',
  LTC: 'litecoin',
};

export async function getCryptoPrice(symbol: string): Promise<CryptoPrice | null> {
  try {
    const id = SYMBOL_TO_COINGECKO[symbol.toUpperCase()] || symbol.toLowerCase();
    
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
    );
    
    if (!response.ok) return null;

    const data = await response.json();
    const prices = data[id];

    if (!prices) return null;

    return {
      symbol: symbol.toUpperCase(),
      name: symbol,
      current_price: prices.usd,
      price_24h_change: prices.usd_24h_change || 0,
      market_cap: prices.usd_market_cap,
      volume_24h: prices.usd_24h_vol,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

export async function getCryptoPrices(symbols: string[]): Promise<CryptoPrice[]> {
  const prices = await Promise.all(
    symbols.map((symbol) => getCryptoPrice(symbol))
  );
  return prices.filter((p) => p !== null) as CryptoPrice[];
}

// Get historical price data
export async function getPriceHistory(
  symbol: string,
  period: '24h' | '7d' | '30d' | '1y' = '7d'
): Promise<PriceHistory | null> {
  try {
    const id = SYMBOL_TO_COINGECKO[symbol.toUpperCase()] || symbol.toLowerCase();
    const days = period === '24h' ? 1 : period === '7d' ? 7 : period === '30d' ? 30 : 365;

    const response = await fetch(
      `${COINGECKO_API}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const prices = data.prices as [number, number][];

    const candles: Candle[] = prices.map(([timestamp, price]) => ({
      time: timestamp / 1000, // Convert to seconds for TradingView
      open: price,
      high: price * 1.02, // Mock high/low
      low: price * 0.98,
      close: price,
      volume: Math.random() * 1000000, // Mock volume
    }));

    return {
      symbol: symbol.toUpperCase(),
      period,
      candles,
    };
  } catch (error) {
    console.error(`Error fetching price history for ${symbol}:`, error);
    return null;
  }
}

// Get top cryptocurrencies by market cap
export async function getTopCryptos(limit = 20): Promise<CryptoPrice[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&sparkline=false`
    );

    if (!response.ok) return [];

    const data = await response.json();

    return data.map((coin: any) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_24h_change: coin.price_change_percentage_24h || 0,
      market_cap: coin.market_cap,
      volume_24h: coin.total_volume,
      timestamp: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching top cryptos:', error);
    return [];
  }
}

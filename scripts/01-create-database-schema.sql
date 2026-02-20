-- Drop existing tables if they exist (for clean slate)
DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS trades CASCADE;
DROP TABLE IF EXISTS watchlist CASCADE;
DROP TABLE IF EXISTS portfolios CASCADE;
DROP TABLE IF EXISTS market_cache CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table for authentication
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio table to store user holdings
CREATE TABLE portfolios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_balance DECIMAL(20, 8) DEFAULT 0,
  total_invested DECIMAL(20, 8) DEFAULT 0,
  total_gains DECIMAL(20, 8) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trades table to log all buy/sell transactions
CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL, -- e.g., BTC, ETH
  type VARCHAR(10) NOT NULL, -- 'BUY' or 'SELL'
  quantity DECIMAL(20, 8) NOT NULL,
  price DECIMAL(20, 8) NOT NULL,
  total_value DECIMAL(20, 8) NOT NULL, -- quantity * price
  status VARCHAR(20) DEFAULT 'COMPLETED', -- PENDING, COMPLETED, CANCELLED
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Watchlist table for tracked cryptocurrencies
CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, symbol)
);

-- Market cache table for storing cryptocurrency prices
CREATE TABLE market_cache (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20) UNIQUE NOT NULL,
  current_price DECIMAL(20, 8) NOT NULL,
  price_24h_change DECIMAL(10, 2), -- percentage
  market_cap DECIMAL(20, 0),
  volume_24h DECIMAL(20, 8),
  cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Chat history table for storing user-LLM conversations
CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_type VARCHAR(50), -- 'trade_analysis', 'market_insight', 'risk_assessment', 'chat'
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context JSONB, -- Store trade/market context
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_created_at ON trades(created_at DESC);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_market_cache_expires ON market_cache(expires_at);

-- Sample data (optional - for testing)
-- INSERT INTO users (email, password_hash, username) VALUES ('test@example.com', 'hashed_password', 'testuser');
-- INSERT INTO portfolios (user_id, total_balance) VALUES (1, 10000.00);

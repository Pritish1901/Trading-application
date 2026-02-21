// Portfolio types
export interface Portfolio {
  id: number;
  user_id: number;
  total_balance: number;
  total_invested: number;
  total_gains: number;
  created_at: string;
  updated_at: string;
}

export interface Holding {
  symbol: string;
  quantity: number;
  average_price: number;
  current_price: number;
  total_value: number;
  gain_loss: number;
  gain_loss_percent: number;
}

export interface PortfolioSummary {
  total_balance: number;
  total_invested: number;
  total_gains: number;
  total_gain_percent: number;
  holdings: Holding[];
}

export interface AssetAllocation {
  symbol: string;
  percentage: number;
  value: number;
}


export interface Market {
  id: string;
  question: string;
  description: string;
  category: MarketCategory;
  yesPrice: number;
  noPrice: number;
  volume: number;
  liquidity: number;
  closeDate: string;
  status: MarketStatus;
  priceHistory: PricePoint[];
  totalBets: number;
}

export interface PricePoint {
  timestamp: string;
  yesPrice: number;
  noPrice: number;
}

export type MarketCategory = 
  | "politics" 
  | "crypto" 
  | "stocks" 
  | "sports" 
  | "entertainment" 
  | "technology" 
  | "economy";

export type MarketStatus = 
  | "open" // Trading allowed
  | "resolved_yes" // Resolved as YES
  | "resolved_no" // Resolved as NO
  | "closed" // No more trading, not yet resolved
  | "cancelled"; // Market cancelled, bets refunded

export interface UserPosition {
  marketId: string;
  question: string;
  position: "yes" | "no";
  shares: number;
  averagePrice: number;
  potentialProfit: number;
  status: MarketStatus;
}

export interface Transaction {
  id: string;
  timestamp: string;
  marketId: string;
  question: string;
  type: "buy" | "sell" | "resolve" | "deposit";
  position?: "yes" | "no";
  shares?: number;
  price?: number;
  amount: number;
  balance: number;
}

export interface MarketRequest {
  id: string;
  question: string;
  description: string;
  category: string;
  close_date: string;
  requested_by: string;
  created_at: string;
  status?: string;
  rejection_reason?: string;
  market_id?: string;
  upvotes_count?: number;
  upvotes?: number;
  has_user_upvoted?: boolean;
  has_upvoted?: boolean;
  profiles?: { 
    username?: string;
  } | null;
}

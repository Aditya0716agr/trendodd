
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

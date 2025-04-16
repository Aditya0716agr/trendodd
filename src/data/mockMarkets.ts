
import { Market, MarketCategory } from "@/types/market";

// Helper function to generate random price history
const generatePriceHistory = (daysBack: number, startYesPrice: number, volatility: number = 0.05) => {
  const priceHistory = [];
  let yesPrice = startYesPrice;
  const now = new Date();
  
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random walk for yes price (with boundaries)
    const change = (Math.random() - 0.5) * 2 * volatility;
    yesPrice = Math.max(0.01, Math.min(0.99, yesPrice + change));
    
    priceHistory.push({
      timestamp: date.toISOString(),
      yesPrice,
      noPrice: 1 - yesPrice
    });
  }
  
  return priceHistory;
};

// Generate a future date for market close
const futureDate = (daysAhead: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString();
};

export const mockMarkets: Market[] = [
  {
    id: "market-1",
    question: "Will Bitcoin exceed $100,000 by the end of the year?",
    description: "This market resolves to YES if the price of Bitcoin (BTC) exceeds $100,000 USD on any major exchange before midnight December 31st.",
    category: "crypto",
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 250000,
    liquidity: 75000,
    closeDate: futureDate(60),
    status: "open",
    priceHistory: generatePriceHistory(30, 0.55, 0.04),
    totalBets: 430
  },
  {
    id: "market-2",
    question: "Will the Federal Reserve cut interest rates in the next meeting?",
    description: "This market resolves to YES if the Federal Reserve announces an interest rate cut at their next scheduled meeting.",
    category: "economy",
    yesPrice: 0.72,
    noPrice: 0.28,
    volume: 180000,
    liquidity: 52000,
    closeDate: futureDate(15),
    status: "open",
    priceHistory: generatePriceHistory(30, 0.45, 0.03),
    totalBets: 290
  },
  {
    id: "market-3",
    question: "Will Tesla deliver more than 500,000 vehicles in Q3?",
    description: "This market resolves to YES if Tesla officially reports delivering more than 500,000 vehicles in Q3 of the current year.",
    category: "stocks",
    yesPrice: 0.58,
    noPrice: 0.42,
    volume: 120000,
    liquidity: 35000,
    closeDate: futureDate(45),
    status: "open",
    priceHistory: generatePriceHistory(30, 0.62, 0.02),
    totalBets: 210
  },
  {
    id: "market-4",
    question: "Will the USA win the most gold medals at the Olympics?",
    description: "This market resolves to YES if the USA wins the most gold medals at the upcoming Olympics. If tied with another country, market resolves NO.",
    category: "sports",
    yesPrice: 0.81,
    noPrice: 0.19,
    volume: 320000,
    liquidity: 95000,
    closeDate: futureDate(30),
    status: "open",
    priceHistory: generatePriceHistory(30, 0.75, 0.01),
    totalBets: 520
  },
  {
    id: "market-5",
    question: "Will Apple announce a new iPhone model in September?",
    description: "This market resolves to YES if Apple announces a new iPhone model (any variant) during the month of September this year.",
    category: "technology",
    yesPrice: 0.93,
    noPrice: 0.07,
    volume: 280000,
    liquidity: 42000,
    closeDate: futureDate(20),
    status: "open",
    priceHistory: generatePriceHistory(30, 0.88, 0.01),
    totalBets: 340
  },
  {
    id: "market-6",
    question: "Will the next major Marvel movie gross over $1 billion worldwide?",
    description: "This market resolves to YES if the next major Marvel Studios theatrical release grosses over $1 billion USD in worldwide box office.",
    category: "entertainment",
    yesPrice: 0.39,
    noPrice: 0.61,
    volume: 95000,
    liquidity: 28000,
    closeDate: futureDate(90),
    status: "open",
    priceHistory: generatePriceHistory(30, 0.45, 0.03),
    totalBets: 180
  },
  {
    id: "market-7",
    question: "Will Ethereum complete its major upgrade before October?",
    description: "This market resolves to YES if Ethereum successfully completes its next major protocol upgrade before October 1st.",
    category: "crypto",
    yesPrice: 0.28,
    noPrice: 0.72,
    volume: 150000,
    liquidity: 48000,
    closeDate: futureDate(40),
    status: "open",
    priceHistory: generatePriceHistory(30, 0.35, 0.04),
    totalBets: 260
  },
  {
    id: "market-8",
    question: "Will unemployment rate fall below 3.5% next quarter?",
    description: "This market resolves to YES if the officially reported unemployment rate falls below 3.5% at any point during the next fiscal quarter.",
    category: "economy",
    yesPrice: 0.17,
    noPrice: 0.83,
    volume: 110000,
    liquidity: 32000,
    closeDate: futureDate(80),
    status: "open",
    priceHistory: generatePriceHistory(30, 0.22, 0.02),
    totalBets: 190
  }
];

// Generate more data for market filters
export const marketCategories: {id: MarketCategory; name: string}[] = [
  { id: "politics", name: "Politics" },
  { id: "crypto", name: "Cryptocurrency" },
  { id: "stocks", name: "Stock Market" },
  { id: "sports", name: "Sports" },
  { id: "entertainment", name: "Entertainment" },
  { id: "technology", name: "Technology" },
  { id: "economy", name: "Economy" }
];

// Mock authentication data
export const mockUserData = {
  walletBalance: 10000, // Starting amount of virtual currency
  positions: [
    {
      marketId: "market-1",
      question: "Will Bitcoin exceed $100,000 by the end of the year?",
      position: "yes",
      shares: 100,
      averagePrice: 0.62,
      potentialProfit: 3800,
      status: "open"
    },
    {
      marketId: "market-4",
      question: "Will the USA win the most gold medals at the Olympics?",
      position: "yes",
      shares: 50,
      averagePrice: 0.77,
      potentialProfit: 1150,
      status: "open"
    }
  ],
  transactions: [
    {
      id: "tx-1",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      marketId: "market-1",
      question: "Will Bitcoin exceed $100,000 by the end of the year?",
      type: "buy",
      position: "yes",
      shares: 100,
      price: 0.62,
      amount: -6200,
      balance: 3800
    },
    {
      id: "tx-2",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      marketId: "market-4",
      question: "Will the USA win the most gold medals at the Olympics?",
      type: "buy",
      position: "yes",
      shares: 50,
      price: 0.77,
      amount: -3850,
      balance: 10000
    }
  ]
};


import { supabase } from "@/integrations/supabase/client";
import { Market, MarketCategory, MarketStatus, PricePoint } from "@/types/market";
import { toast } from "@/hooks/use-toast";

export async function getMarkets() {
  try {
    const { data, error } = await supabase
      .from("markets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching markets",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    // For each market, fetch its price history
    const marketsWithPriceHistory = await Promise.all(
      data.map(async (market) => {
        const { data: priceHistoryData, error: priceHistoryError } = await supabase
          .from("price_history")
          .select("*")
          .eq("market_id", market.id)
          .order("timestamp", { ascending: true });

        if (priceHistoryError) {
          console.error("Error fetching price history:", priceHistoryError);
          return {
            ...market,
            priceHistory: [],
          };
        }

        const priceHistory: PricePoint[] = priceHistoryData.map((item) => ({
          timestamp: item.timestamp,
          yesPrice: item.yes_price,
          noPrice: item.no_price,
        }));

        // Calculate total bets
        const { count, error: countError } = await supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("market_id", market.id);

        const totalBets = countError ? 0 : count || 0;

        return {
          id: market.id,
          question: market.question,
          description: market.description || "",
          category: market.category as MarketCategory,
          yesPrice: market.yes_price,
          noPrice: market.no_price,
          volume: market.volume,
          liquidity: market.liquidity,
          closeDate: market.close_date,
          status: market.status as MarketStatus,
          priceHistory,
          totalBets,
        };
      })
    );

    return marketsWithPriceHistory;
  } catch (error) {
    console.error("Error in getMarkets:", error);
    return [];
  }
}

export async function getMarketById(id: string): Promise<Market | null> {
  try {
    const { data, error } = await supabase
      .from("markets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast({
        title: "Error fetching market",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    // Fetch price history for this market
    const { data: priceHistoryData, error: priceHistoryError } = await supabase
      .from("price_history")
      .select("*")
      .eq("market_id", id)
      .order("timestamp", { ascending: true });

    if (priceHistoryError) {
      console.error("Error fetching price history:", priceHistoryError);
      return null;
    }

    const priceHistory: PricePoint[] = priceHistoryData.map((item) => ({
      timestamp: item.timestamp,
      yesPrice: item.yes_price,
      noPrice: item.no_price,
    }));

    // Calculate total bets
    const { count, error: countError } = await supabase
      .from("transactions")
      .select("*", { count: "exact", head: true })
      .eq("market_id", id);

    const totalBets = countError ? 0 : count || 0;

    return {
      id: data.id,
      question: data.question,
      description: data.description || "",
      category: data.category as MarketCategory,
      yesPrice: data.yes_price,
      noPrice: data.no_price,
      volume: data.volume,
      liquidity: data.liquidity,
      closeDate: data.close_date,
      status: data.status as MarketStatus,
      priceHistory,
      totalBets,
    };
  } catch (error) {
    console.error("Error in getMarketById:", error);
    return null;
  }
}

export async function createMarket(market: Omit<Market, 'id' | 'priceHistory' | 'totalBets'>) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a market.",
        variant: "destructive",
      });
      return null;
    }
    
    // Create a market with today as start date and the specified close date
    const { data, error } = await supabase
      .from("markets")
      .insert([
        {
          question: market.question,
          description: market.description,
          category: market.category,
          yes_price: market.yesPrice,
          no_price: market.noPrice,
          volume: market.volume,
          liquidity: market.liquidity,
          close_date: market.closeDate,
          status: market.status,
          created_by: user.user.id
        },
      ])
      .select()
      .single();

    if (error) {
      toast({
        title: "Error creating market",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }

    // Also create initial price history entry
    const { error: priceHistoryError } = await supabase
      .from("price_history")
      .insert([
        {
          market_id: data.id,
          yes_price: market.yesPrice,
          no_price: market.noPrice,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (priceHistoryError) {
      console.error("Error creating initial price history:", priceHistoryError);
    }

    toast({
      title: "Market created",
      description: "Your market has been created successfully.",
    });

    return data;
  } catch (error) {
    console.error("Error in createMarket:", error);
    return null;
  }
}

// Seed 5 active markets for testing
export async function seedMarkets() {
  try {
    // Check if we already have markets
    const { count, error: countError } = await supabase
      .from("markets")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      console.error("Error checking markets count:", countError);
      return;
    }
    
    // Only seed if we have less than 5 markets
    if (count && count >= 5) {
      console.log("Already have enough markets, skipping seed");
      return;
    }
    
    const today = new Date();
    
    const markets = [
      {
        question: "Will Bitcoin exceed $100,000 by the end of the year?",
        description: "This market resolves to YES if the price of Bitcoin (BTC) exceeds $100,000 USD on any major exchange before December 31, 2025.",
        category: "crypto",
        yes_price: 0.65,
        no_price: 0.35,
        volume: 25000,
        liquidity: 10000,
        close_date: new Date(today.getFullYear(), 11, 31).toISOString(), // December 31 of current year
        status: "open"
      },
      {
        question: "Will Tesla stock outperform the S&P 500 this quarter?",
        description: "This market resolves to YES if Tesla (TSLA) stock price percentage gain exceeds the S&P 500 index percentage gain for the current quarter.",
        category: "stocks",
        yes_price: 0.48,
        no_price: 0.52,
        volume: 15000,
        liquidity: 7500,
        close_date: new Date(today.getFullYear(), today.getMonth() + 3, 1).toISOString(), // 3 months from now
        status: "open"
      },
      {
        question: "Will the US Federal Reserve cut interest rates in the next meeting?",
        description: "This market resolves to YES if the Federal Reserve announces an interest rate cut at their next scheduled meeting.",
        category: "economy",
        yes_price: 0.72,
        no_price: 0.28,
        volume: 30000,
        liquidity: 15000,
        close_date: new Date(today.getFullYear(), today.getMonth() + 1, 15).toISOString(), // ~1 month from now
        status: "open"
      },
      {
        question: "Will Apple release a new iPhone model before September?",
        description: "This market resolves to YES if Apple officially announces a new iPhone model before September 1, 2025.",
        category: "technology",
        yes_price: 0.30,
        no_price: 0.70,
        volume: 20000,
        liquidity: 8000,
        close_date: new Date(today.getFullYear(), 8, 1).toISOString(), // September 1
        status: "open"
      },
      {
        question: "Will the Democrats win the 2024 US Presidential Election?",
        description: "This market resolves to YES if the Democratic candidate wins the 2024 US Presidential Election.",
        category: "politics",
        yes_price: 0.55,
        no_price: 0.45,
        volume: 50000,
        liquidity: 25000,
        close_date: new Date(2024, 10, 15).toISOString(), // November 15, 2024
        status: "open"
      }
    ];
    
    // Insert each market and create initial price history
    for (const market of markets) {
      const { data, error } = await supabase
        .from("markets")
        .insert([market])
        .select()
        .single();
        
      if (error) {
        console.error("Error creating seed market:", error);
        continue;
      }
      
      // Create initial price history entry
      await supabase
        .from("price_history")
        .insert([
          {
            market_id: data.id,
            yes_price: market.yes_price,
            no_price: market.no_price,
            timestamp: new Date().toISOString(),
          },
        ]);
      
      console.log("Created seed market:", data.id);
    }
    
    toast({
      title: "Markets seeded",
      description: "Test markets have been created successfully.",
    });
    
  } catch (error) {
    console.error("Error in seedMarkets:", error);
  }
}

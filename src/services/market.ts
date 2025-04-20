
import { supabase } from "@/integrations/supabase/client";
import { Market, MarketCategory, MarketStatus, PricePoint } from "@/types/market";
import { toast } from "sonner";
import { addDays } from "date-fns";

const enableRealtimeForMarkets = async () => {
  try {
    await supabase
      .channel('price-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'markets'
      }, (payload) => {
        console.log('Market updated:', payload);
      })
      .subscribe();
      
    await supabase
      .channel('price-history-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'price_history'
      }, (payload) => {
        console.log('Price history updated:', payload);
      })
      .subscribe();
  } catch (error) {
    console.error('Error enabling realtime for markets:', error);
  }
};

enableRealtimeForMarkets();

export async function getMarkets() {
  try {
    const { data, error } = await supabase
      .from("markets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching markets: " + error.message);
      throw error;
    }

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
      toast.error("Error fetching market: " + error.message);
      throw error;
    }

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
      toast.error("Please sign in to create a market.");
      return null;
    }
    
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
      toast.error("Error creating market: " + error.message);
      throw error;
    }

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

    toast.success("Your market has been created successfully.");

    return data;
  } catch (error) {
    console.error("Error in createMarket:", error);
    return null;
  }
}

export async function seedMarkets() {
  try {
    const { count, error: countError } = await supabase
      .from("markets")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      console.error("Error checking markets count:", countError);
      return;
    }
    
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
        close_date: new Date(today.getFullYear(), 11, 31).toISOString(),
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
        close_date: new Date(today.getFullYear(), today.getMonth() + 3, 1).toISOString(),
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
        close_date: new Date(today.getFullYear(), today.getMonth() + 1, 15).toISOString(),
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
        close_date: new Date(today.getFullYear(), 8, 1).toISOString(),
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
        close_date: new Date(2024, 10, 15).toISOString(),
        status: "open"
      }
    ];
    
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
    
    toast.success("Test markets have been created successfully.");
    
  } catch (error) {
    console.error("Error in seedMarkets:", error);
  }
}

export async function resolveMarket(marketId: string, resolution: "yes" | "no") {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("Please sign in to resolve markets.");
      return null;
    }
    
    const { data: market, error: marketError } = await supabase
      .from("markets")
      .select("*")
      .eq("id", marketId)
      .single();
      
    if (marketError) {
      toast.error("Error fetching market: " + marketError.message);
      return null;
    }
    
    const status = resolution === "yes" ? "resolved_yes" as MarketStatus : "resolved_no" as MarketStatus;
    
    const { error: updateError } = await supabase
      .from("markets")
      .update({ status })
      .eq("id", marketId);
      
    if (updateError) {
      toast.error("Error resolving market: " + updateError.message);
      return null;
    }
    
    const { data: positions, error: positionsError } = await supabase
      .from("positions")
      .select("*")
      .eq("market_id", marketId);
      
    if (positionsError) {
      toast.error("Error fetching positions: " + positionsError.message);
      return null;
    }
    
    for (const position of positions) {
      const isWinning = (position.position === "yes" && resolution === "yes") || 
                        (position.position === "no" && resolution === "no");
      
      if (isWinning) {
        const winnings = position.shares;
        
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("wallet_balance")
          .eq("id", position.user_id)
          .single();
          
        if (!profileError && profile) {
          const newBalance = profile.wallet_balance + winnings;
          
          await supabase
            .from("profiles")
            .update({ wallet_balance: newBalance })
            .eq("id", position.user_id);
            
          await supabase
            .from("transactions")
            .insert([
              {
                user_id: position.user_id,
                market_id: marketId,
                type: "resolve",
                position: position.position,
                shares: position.shares,
                amount: winnings,
                balance: newBalance
              }
            ]);
        }
      }
      
      // Remove all positions after market resolution
      await supabase
        .from("positions")
        .delete()
        .eq("id", position.id);
    }
    
    toast.success(`The market has been resolved as ${resolution.toUpperCase()}.`);
    
    return { success: true };
  } catch (error) {
    console.error("Error resolving market:", error);
    toast.error("An unexpected error occurred while resolving the market.");
    return null;
  }
}

export async function submitMarketRequest(
  question: string, 
  description: string, 
  category: MarketCategory,
  closeDate: string
) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("Please sign in to submit a market request.");
      return null;
    }
    
    const { data, error } = await supabase
      .from("market_requests")
      .insert([
        {
          question,
          description,
          category,
          close_date: closeDate,
          requested_by: user.user.id,
          status: "pending"
        },
      ])
      .select()
      .single();

    if (error) {
      toast.error("Error submitting market request: " + error.message);
      throw error;
    }

    toast.success("Your market request has been submitted for review.");

    return data;
  } catch (error) {
    console.error("Error in submitMarketRequest:", error);
    return null;
  }
}

export async function upvoteMarketRequest(requestId: string) {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("Please sign in to upvote");
      return null;
    }
    
    const { data, error } = await supabase
      .from("market_request_upvotes")
      .insert({ 
        request_id: requestId, 
        user_id: user.user.id 
      });
    
    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation means user already upvoted
        // So we'll remove the upvote instead
        const { error: deleteError } = await supabase
          .from("market_request_upvotes")
          .delete()
          .eq("request_id", requestId)
          .eq("user_id", user.user.id);
        
        if (deleteError) {
          toast.error("Error removing upvote");
          return null;
        }
        
        toast.info("Upvote removed");
        return false;
      }
      
      toast.error("Error upvoting request");
      return null;
    }
    
    toast.success("Request upvoted");
    return true;
  } catch (error) {
    console.error("Error upvoting market request:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
}

export async function getUserMarketRequests() {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from("market_requests_with_votes")
      .select("*")
      .eq("requested_by", user.user.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching market requests:", error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error("Error in getUserMarketRequests:", error);
    return [];
  }
}

export async function getPendingMarketRequests() {
  try {
    const { data, error } = await supabase
      .from("market_requests_with_votes")
      .select(`
        *,
        profiles:requested_by (
          username
        )
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching pending market requests:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getPendingMarketRequests:", error);
    return [];
  }
}

export async function approveMarketRequest(requestId: string) {
  try {
    const { data: request, error: requestError } = await supabase
      .from("market_requests")
      .select("*")
      .eq("id", requestId)
      .single();
    
    if (requestError) {
      toast.error("Error fetching market request: " + requestError.message);
      return null;
    }
    
    const market = {
      question: request.question,
      description: request.description,
      category: request.category as MarketCategory,
      yesPrice: 0.5,
      noPrice: 0.5,
      volume: 0,
      liquidity: 1000,
      closeDate: request.close_date,
      status: "open" as MarketStatus,
    };
    
    const createdMarket = await createMarket(market);
    
    if (createdMarket) {
      const { error: updateError } = await supabase
        .from("market_requests")
        .update({ 
          status: "approved",
          market_id: createdMarket.id
        })
        .eq("id", requestId);
      
      if (updateError) {
        console.error("Error updating market request:", updateError);
      }
      
      toast.success("The market has been created successfully.");
      
      return createdMarket;
    }
    
    return null;
  } catch (error) {
    console.error("Error in approveMarketRequest:", error);
    return null;
  }
}

export async function rejectMarketRequest(requestId: string, reason: string) {
  try {
    const { error } = await supabase
      .from("market_requests")
      .update({ 
        status: "rejected",
        rejection_reason: reason
      })
      .eq("id", requestId);
    
    if (error) {
      toast.error("Error rejecting market request: " + error.message);
      return false;
    }
    
    toast.success("The market request has been rejected.");
    
    return true;
  } catch (error) {
    console.error("Error in rejectMarketRequest:", error);
    return false;
  }
}

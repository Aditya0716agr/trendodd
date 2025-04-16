
import { supabase } from "@/integrations/supabase/client";
import { Market, MarketCategory, PricePoint } from "@/types/market";
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
          status: market.status,
          priceHistory,
          totalBets: 0, // Will be calculated later if needed
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
      status: data.status,
      priceHistory,
      totalBets: 0, // Will be calculated later if needed
    };
  } catch (error) {
    console.error("Error in getMarketById:", error);
    return null;
  }
}

export async function createMarket(market: Omit<Market, 'id' | 'priceHistory' | 'totalBets'>) {
  try {
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

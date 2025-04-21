
import { supabase } from "@/integrations/supabase/client";
import { Transaction, UserPosition, MarketStatus } from "@/types/market";
import { toast } from "@/hooks/use-toast";

export interface TradeParams {
  marketId: string;
  position: "yes" | "no";
  shares: number;
  price: number;
  type: "buy" | "sell";
}

export async function executeTrade({ marketId, position, shares, price, type }: TradeParams) {
  try {
    // Start a transaction
    const amount = Number((shares * price * (type === "buy" ? -1 : 1)).toFixed(2));
    
    // Get user's profile to check balance
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to trade.",
        variant: "destructive",
      });
      return null;
    }
    
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", user.user.id)
      .single();
    
    if (profileError) {
      toast({
        title: "Error fetching profile",
        description: profileError.message,
        variant: "destructive",
      });
      return null;
    }
    
    // Check if user has enough balance for buy
    if (type === "buy" && profile.wallet_balance < (shares * price)) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance to execute this trade.",
        variant: "destructive",
      });
      return null;
    }
    
    // Update user's balance - Fix potential floating point issues
    const newBalance = Number((profile.wallet_balance + amount).toFixed(2));
    const { error: updateBalanceError } = await supabase
      .from("profiles")
      .update({ wallet_balance: newBalance })
      .eq("id", user.user.id);
    
    if (updateBalanceError) {
      toast({
        title: "Error updating balance",
        description: updateBalanceError.message,
        variant: "destructive",
      });
      return null;
    }
    
    // Record the transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("transactions")
      .insert([
        {
          user_id: user.user.id,
          market_id: marketId,
          type,
          position,
          shares,
          price,
          amount: Number(Math.abs(amount).toFixed(2)),
          balance: newBalance,
        },
      ])
      .select()
      .single();
    
    if (transactionError) {
      toast({
        title: "Error recording transaction",
        description: transactionError.message,
        variant: "destructive",
      });
      // Revert balance change if transaction recording fails
      await supabase
        .from("profiles")
        .update({ wallet_balance: profile.wallet_balance })
        .eq("id", user.user.id);
      return null;
    }
    
    // Update or create position
    const { data: existingPosition, error: positionError } = await supabase
      .from("positions")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("market_id", marketId)
      .eq("position", position)
      .maybeSingle();
    
    if (positionError && positionError.code !== "PGRST116") {
      toast({
        title: "Error fetching position",
        description: positionError.message,
        variant: "destructive",
      });
      return null;
    }
    
    if (existingPosition) {
      // Update existing position
      const newShares = type === "buy" 
        ? existingPosition.shares + shares 
        : existingPosition.shares - shares;
      
      // Calculate new average price for buys
      let newAveragePrice = existingPosition.average_price;
      if (type === "buy" && newShares > 0) {
        const totalValue = existingPosition.shares * existingPosition.average_price + shares * price;
        newAveragePrice = Number((totalValue / newShares).toFixed(4));
      }
      
      // If selling all shares, delete the position
      if (newShares <= 0) {
        await supabase
          .from("positions")
          .delete()
          .eq("id", existingPosition.id);
      } else {
        // Otherwise update it
        await supabase
          .from("positions")
          .update({ 
            shares: newShares,
            average_price: newAveragePrice,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingPosition.id);
      }
    } else if (type === "buy") {
      // Create new position for buys only
      await supabase
        .from("positions")
        .insert([
          {
            user_id: user.user.id,
            market_id: marketId,
            position,
            shares,
            average_price: price,
          },
        ]);
    }
    
    // Get current market data
    const { data: market, error: marketError } = await supabase
      .from("markets")
      .select("yes_price, no_price, volume")
      .eq("id", marketId)
      .single();
    
    if (marketError) {
      toast({
        title: "Error fetching market",
        description: marketError.message,
        variant: "destructive",
      });
      return null;
    }
    
    // Calculate price impact based on share amount and market depth
    // Use a more sophisticated price impact model that considers order size
    const marketDepth = 1000; // Base liquidity parameter
    const priceImpactFactor = Math.min(shares / marketDepth, 0.1); // Cap at 10% max impact
    
    // Apply asymmetric price changes based on position and action
    let newYesPrice = market.yes_price;
    let newNoPrice = market.no_price;
    
    if (type === "buy") {
      if (position === "yes") {
        // Buying YES increases YES price and decreases NO price
        newYesPrice = Math.min(market.yes_price + market.yes_price * priceImpactFactor, 0.99);
        newNoPrice = Math.max(market.no_price - market.no_price * priceImpactFactor, 0.01);
      } else {
        // Buying NO increases NO price and decreases YES price
        newNoPrice = Math.min(market.no_price + market.no_price * priceImpactFactor, 0.99);
        newYesPrice = Math.max(market.yes_price - market.yes_price * priceImpactFactor, 0.01);
      }
    } else if (type === "sell") {
      if (position === "yes") {
        // Selling YES decreases YES price and increases NO price
        newYesPrice = Math.max(market.yes_price - market.yes_price * priceImpactFactor, 0.01);
        newNoPrice = Math.min(market.no_price + market.no_price * priceImpactFactor, 0.99);
      } else {
        // Selling NO decreases NO price and increases YES price
        newNoPrice = Math.max(market.no_price - market.no_price * priceImpactFactor, 0.01);
        newYesPrice = Math.min(market.yes_price + market.yes_price * priceImpactFactor, 0.99);
      }
    }
    
    // Ensure the sum is close to 1 (accounting for rounding errors)
    const sum = newYesPrice + newNoPrice;
    if (Math.abs(sum - 1) > 0.01) {
      const adjustmentFactor = 1 / sum;
      newYesPrice = Math.min(newYesPrice * adjustmentFactor, 0.99);
      newNoPrice = Math.min(newNoPrice * adjustmentFactor, 0.99);
    }
    
    // Fix potential floating point issues in volume
    const newVolume = Number((market.volume + (shares * price)).toFixed(2));
    
    // Update market prices and volume
    const { error: updateMarketError } = await supabase
      .from("markets")
      .update({ 
        yes_price: Number(newYesPrice.toFixed(4)),
        no_price: Number(newNoPrice.toFixed(4)),
        volume: newVolume,
        updated_at: new Date().toISOString()
      })
      .eq("id", marketId);
      
    if (updateMarketError) {
      toast({
        title: "Error updating market prices",
        description: updateMarketError.message,
        variant: "destructive",
      });
    }
    
    toast({
      title: "Trade executed",
      description: `Successfully ${type === "buy" ? "bought" : "sold"} ${shares} ${position.toUpperCase()} shares.`,
    });
    
    return transaction;
  } catch (error) {
    console.error("Error executing trade:", error);
    toast({
      title: "Trade failed",
      description: "An unexpected error occurred during trade execution.",
      variant: "destructive",
    });
    return null;
  }
}

export async function getUserPositions(): Promise<UserPosition[]> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from("positions")
      .select(`
        *,
        markets:market_id (
          question,
          status
        )
      `)
      .eq("user_id", user.user.id);
    
    if (error) {
      toast({
        title: "Error fetching positions",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    return data.map(position => ({
      marketId: position.market_id,
      question: position.markets.question,
      position: position.position as "yes" | "no",
      shares: position.shares,
      averagePrice: position.average_price,
      potentialProfit: Number((position.position === "yes" 
        ? position.shares * (1 - position.average_price)
        : position.shares * (1 - (1 - position.average_price))).toFixed(2)),
      status: position.markets.status as MarketStatus,
    }));
  } catch (error) {
    console.error("Error in getUserPositions:", error);
    return [];
  }
}

export async function getUserTransactions(): Promise<Transaction[]> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        *,
        markets:market_id (
          question
        )
      `)
      .eq("user_id", user.user.id)
      .order("created_at", { ascending: false });
    
    if (error) {
      toast({
        title: "Error fetching transactions",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    return data.map(tx => ({
      id: tx.id,
      timestamp: tx.created_at,
      marketId: tx.market_id,
      question: tx.markets.question,
      type: tx.type as "buy" | "sell" | "resolve" | "deposit",
      position: tx.position as "yes" | "no" | undefined,
      shares: tx.shares,
      price: tx.price,
      amount: tx.amount,
      balance: Number(tx.balance.toFixed(2)),
    }));
  } catch (error) {
    console.error("Error in getUserTransactions:", error);
    return [];
  }
}

export async function getUserWalletBalance(): Promise<number> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return 0;
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .select("wallet_balance")
      .eq("id", user.user.id)
      .single();
    
    if (error) {
      console.error("Error fetching wallet balance:", error);
      return 0;
    }
    
    return Number(data.wallet_balance.toFixed(2));
  } catch (error) {
    console.error("Error in getUserWalletBalance:", error);
    return 0;
  }
}

import { supabase } from "@/integrations/supabase/client";
import { Transaction, UserPosition } from "@/types/market";
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
    const amount = shares * price * (type === "buy" ? -1 : 1);
    
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
    
    // Update user's balance
    const newBalance = profile.wallet_balance + amount;
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
          amount: Math.abs(amount),
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
        newAveragePrice = totalValue / newShares;
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
    
    // Update market prices and volume
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
    
    // Simple market impact calculation (this would be more sophisticated in real life)
    const impact = shares * 0.0005; // 0.05% price impact per share
    const newYesPrice = position === "yes"
      ? type === "buy" 
        ? Math.min(market.yes_price + impact, 0.99) 
        : Math.max(market.yes_price - impact, 0.01)
      : market.yes_price;
    
    const newNoPrice = position === "no"
      ? type === "buy" 
        ? Math.min(market.no_price + impact, 0.99) 
        : Math.max(market.no_price - impact, 0.01)
      : market.no_price;
    
    const newVolume = market.volume + (shares * price);
    
    await supabase
      .from("markets")
      .update({ 
        yes_price: newYesPrice,
        no_price: newNoPrice,
        volume: newVolume,
        updated_at: new Date().toISOString()
      })
      .eq("id", marketId);
    
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
      potentialProfit: position.position === "yes" 
        ? position.shares * (1 - position.average_price)
        : position.shares * (1 - (1 - position.average_price)),
      status: position.markets.status,
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
      type: tx.type,
      position: tx.position,
      shares: tx.shares,
      price: tx.price,
      amount: tx.amount,
      balance: tx.balance,
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
    
    return data.wallet_balance;
  } catch (error) {
    console.error("Error in getUserWalletBalance:", error);
    return 0;
  }
}

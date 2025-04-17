
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Market } from "@/types/market";
import { Users, DollarSign, ArrowLeftRight, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { getMarketById } from "@/services/market";
import { executeTrade, getUserWalletBalance } from "@/services/trading";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

const MarketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [market, setMarket] = useState<Market | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState<"yes" | "no">("yes");
  const [shares, setShares] = useState("1");
  const [cost, setCost] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  
  // Fetch market data
  useEffect(() => {
    const fetchMarket = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const marketData = await getMarketById(id);
        
        if (marketData) {
          setMarket(marketData);
        } else {
          setError("Market not found");
          toast.error("Market not found");
        }
      } catch (error) {
        console.error("Error fetching market:", error);
        setError("Failed to load market data");
        toast.error("Failed to load market data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarket();
  }, [id]);
  
  // Fetch wallet balance if user is logged in
  useEffect(() => {
    const fetchBalance = async () => {
      if (user) {
        try {
          const balance = await getUserWalletBalance();
          setWalletBalance(balance);
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        }
      }
    };
    
    fetchBalance();
  }, [user]);
  
  // Calculate cost when shares or position changes
  useEffect(() => {
    if (market && shares) {
      const price = position === "yes" ? market.yesPrice : market.noPrice;
      const sharesNum = parseFloat(shares);
      
      if (!isNaN(sharesNum) && sharesNum > 0) {
        setCost(sharesNum * price);
      } else {
        setCost(0);
      }
    }
  }, [market, position, shares]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };
  
  // Format chart data
  const formatChartData = () => {
    if (!market || !market.priceHistory || market.priceHistory.length === 0) return [];
    
    return market.priceHistory.map(point => ({
      date: format(parseISO(point.timestamp), "MMM d"),
      yes: parseFloat((point.yesPrice * 100).toFixed(0)),
      no: parseFloat((point.noPrice * 100).toFixed(0))
    }));
  };
  
  // Handle buy action
  const handleBuy = async () => {
    if (!user) {
      toast.error("Please log in to trade");
      navigate("/login");
      return;
    }
    
    if (!market || !id) {
      toast.error("Market data not available");
      return;
    }
    
    const sharesNum = parseFloat(shares);
    
    if (isNaN(sharesNum) || sharesNum <= 0) {
      toast.error("Please enter a valid number of shares");
      return;
    }
    
    if (cost > walletBalance) {
      toast.error("Insufficient balance");
      return;
    }
    
    try {
      toast.loading("Processing your trade...");
      
      const result = await executeTrade({
        marketId: id,
        position,
        shares: sharesNum,
        price: position === "yes" ? market.yesPrice : market.noPrice,
        type: "buy"
      });
      
      if (result) {
        toast.dismiss();
        toast.success("Trade executed successfully");
        
        // Update wallet balance after successful trade
        const newBalance = await getUserWalletBalance();
        setWalletBalance(newBalance);
        
        // Refresh market data to show updated prices
        const updatedMarket = await getMarketById(id);
        if (updatedMarket) {
          setMarket(updatedMarket);
        }
        
        // Reset shares to 1
        setShares("1");
      }
    } catch (error) {
      console.error("Error executing trade:", error);
      toast.dismiss();
      toast.error("Failed to execute trade");
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6" 
            onClick={() => navigate("/markets")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full mb-8" />
              <Skeleton className="h-64 w-full mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !market) {
    return (
      <Layout>
        <div className="container py-8 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Market Not Found</h1>
          <p className="text-muted-foreground mb-6">The market you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/markets")}>Back to Markets</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={() => navigate("/markets")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Markets
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Market Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium capitalize">
                {market.category}
              </span>
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Clock className="h-3 w-3" />
                <span>Closes: {formatDate(market.closeDate)}</span>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{market.question}</h1>
            <p className="text-muted-foreground mb-8">{market.description}</p>
            
            {/* Price Chart */}
            <div className="bg-card rounded-lg border p-4 mb-8">
              <h2 className="text-lg font-semibold mb-4">Price History</h2>
              <div className="h-64">
                {market.priceHistory && market.priceHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} unit="¢" />
                      <Tooltip 
                        formatter={(value) => [`${value}¢`, '']}
                        labelFormatter={(label) => `Date: ${label}`} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="yes" 
                        stroke="#10B981" 
                        name="YES"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="no" 
                        stroke="#EF4444" 
                        name="NO"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No price history available
                  </div>
                )}
              </div>
            </div>
            
            {/* Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground mr-1" />
                  <h3 className="font-medium">Volume</h3>
                </div>
                <p className="text-2xl font-bold">{market.volume > 1000 ? (market.volume / 1000).toFixed(1) + 'K' : market.volume.toFixed(0)}</p>
              </div>
              
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <ArrowLeftRight className="h-5 w-5 text-muted-foreground mr-1" />
                  <h3 className="font-medium">Liquidity</h3>
                </div>
                <p className="text-2xl font-bold">{market.liquidity > 1000 ? (market.liquidity / 1000).toFixed(1) + 'K' : market.liquidity.toFixed(0)}</p>
              </div>
              
              <div className="bg-card rounded-lg border p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-muted-foreground mr-1" />
                  <h3 className="font-medium">Total Bets</h3>
                </div>
                <p className="text-2xl font-bold">{market.totalBets}</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Trading Interface */}
          <div>
            <div className="bg-card rounded-lg border p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Trade</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Current Prices</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-500/10 p-3 rounded-md text-center">
                    <div className="text-xs mb-1">YES</div>
                    <div className="text-2xl font-bold text-green-600">{Math.round(market.yesPrice * 100)}¢</div>
                  </div>
                  <div className="bg-red-500/10 p-3 rounded-md text-center">
                    <div className="text-xs mb-1">NO</div>
                    <div className="text-2xl font-bold text-red-600">{Math.round(market.noPrice * 100)}¢</div>
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="buy" className="mb-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell" disabled>Sell</TabsTrigger>
                </TabsList>
                
                <TabsContent value="buy" className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <RadioGroup 
                      id="position" 
                      className="flex gap-4 mt-2" 
                      defaultValue="yes"
                      value={position}
                      onValueChange={(value) => setPosition(value as "yes" | "no")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes" className="font-medium cursor-pointer">YES</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no" className="font-medium cursor-pointer">NO</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div>
                    <Label htmlFor="shares">Number of Shares</Label>
                    <Input 
                      id="shares" 
                      type="number" 
                      min="1" 
                      step="1"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cost</span>
                      <span className="font-medium">{cost.toFixed(2)} coins</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span>If correct, you'll get</span>
                      <span className="font-medium">{shares && !isNaN(parseFloat(shares)) ? (parseFloat(shares)).toFixed(0) : 0} coins</span>
                    </div>
                    
                    {user && (
                      <div className="text-sm text-muted-foreground mb-4">
                        Your balance: {walletBalance.toFixed(2)} coins
                      </div>
                    )}
                    
                    <Button 
                      className={`w-full ${position === "yes" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                      onClick={handleBuy}
                      disabled={!user || isNaN(parseFloat(shares)) || parseFloat(shares) <= 0 || cost > walletBalance}
                    >
                      Buy {position.toUpperCase()} Shares
                    </Button>
                    
                    {!user && (
                      <p className="text-xs text-muted-foreground mt-3 text-center">
                        Please <a href="/login" className="text-primary hover:underline">log in</a> to trade on this market
                      </p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="sell">
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      Selling functionality will be available soon
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketDetail;

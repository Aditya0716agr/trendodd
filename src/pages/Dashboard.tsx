
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Wallet, 
  Clock, 
  TrendingUp, 
  History, 
  ChevronRight, 
  LogOut,
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { UserPosition, Transaction } from "@/types/market";
import { getUserPositions, getUserTransactions, getUserWalletBalance } from "@/services/trading";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/services/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user, loading } = useAuth();
  
  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      
      if (!user) {
        toast.error("Please log in to access the dashboard");
        navigate("/login");
        return;
      }
      
      try {
        setIsLoading(true);
        const [positionsData, transactionsData, balance] = await Promise.all([
          getUserPositions(),
          getUserTransactions(),
          getUserWalletBalance()
        ]);
        
        setPositions(positionsData);
        setTransactions(transactionsData);
        setWalletBalance(balance);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, loading, navigate]);
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d, yyyy");
    } catch (e) {
      return dateStr;
    }
  };
  
  const formatTimestamp = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d, h:mm a");
    } catch (e) {
      return dateStr;
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your predictions and track your performance</p>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        {/* Wallet Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Wallet Balance
              </CardTitle>
              <CardDescription>Your virtual currency for trading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <div className="text-3xl font-bold">{walletBalance.toLocaleString()}</div>
                <div className="ml-2 text-muted-foreground">coins</div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button className="gap-2" disabled>
                  <PlusCircle className="h-4 w-4" />
                  Add More Coins
                </Button>
                <Link to="/markets">
                  <Button variant="outline" className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trade Markets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Active Positions
              </CardTitle>
              <CardDescription>Your open predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{positions.length}</div>
              <div className="text-muted-foreground">open positions</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="positions" className="mb-4">
          <TabsList className="mb-6">
            <TabsTrigger value="positions">My Positions</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>
          
          {/* Positions Tab */}
          <TabsContent value="positions">
            <Card>
              <CardHeader>
                <CardTitle>Your Market Positions</CardTitle>
                <CardDescription>Your active predictions across all markets</CardDescription>
              </CardHeader>
              <CardContent>
                {positions.length > 0 ? (
                  <div className="space-y-4">
                    {positions.map((position) => (
                      <div key={position.marketId} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">{position.question}</div>
                          <Link to={`/market/${position.marketId}`}>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Position</div>
                            <div className={position.position === "yes" ? "price-yes font-medium" : "price-no font-medium"}>
                              {position.position.toUpperCase()}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Shares</div>
                            <div className="font-medium">{position.shares}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Avg Price</div>
                            <div className="font-medium">{(position.averagePrice * 100).toFixed(0)}¢</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Potential Profit</div>
                            <div className="font-medium text-market-yes">+{position.potentialProfit}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No positions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't made any predictions yet. Explore markets to start trading.
                    </p>
                    <Link to="/markets">
                      <Button>Explore Markets</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Record of your trading activity</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{tx.question}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatTimestamp(tx.timestamp)}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className={tx.amount > 0 ? "text-market-yes font-medium" : "text-market-no font-medium"}>
                              {tx.amount > 0 ? "+" : ""}{tx.amount}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Balance: {tx.balance}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center gap-2">
                          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full 
                            ${tx.type === "buy" ? "bg-primary/10 text-primary" : 
                              tx.type === "sell" ? "bg-market-yes/10 text-market-yes" : 
                              "bg-muted text-muted-foreground"}`}
                          >
                            {tx.type === "buy" ? (
                              <ArrowDownRight className="h-3 w-3" />
                            ) : (
                              <ArrowUpRight className="h-3 w-3" />
                            )}
                            {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </div>
                          
                          {tx.position && (
                            <div className={`text-xs px-2 py-1 rounded-full 
                              ${tx.position === "yes" ? "bg-market-yes/10 text-market-yes" : 
                              "bg-market-no/10 text-market-no"}`}
                            >
                              {tx.position.toUpperCase()}
                            </div>
                          )}
                          
                          {tx.shares && (
                            <div className="text-xs text-muted-foreground">
                              {tx.shares} shares
                            </div>
                          )}
                          
                          {tx.price && (
                            <div className="text-xs text-muted-foreground">
                              @ {(tx.price * 100).toFixed(0)}¢
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't made any trades yet. Start trading to see your transaction history.
                    </p>
                    <Link to="/markets">
                      <Button>Start Trading</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;

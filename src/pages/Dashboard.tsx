import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BarChart, LineChart, AreaChart, Clock, Plus, AlertCircle, Users, Trophy } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Transaction, UserPosition } from "@/types/market";
import { getUserPositions, getUserTransactions } from "@/services/trading";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { ForumCard, ForumPost } from "@/components/community/ForumCard";
import { Leaderboard, LeaderboardUser } from "@/components/gamification/Leaderboard";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

const mockForumPosts: ForumPost[] = [
  {
    id: "1",
    title: "Bitcoin's price movement after ETF approval",
    author: { name: "CryptoExpert" },
    content: "What do you think about Bitcoin's price action following the ETF approval? I believe we'll see a strong uptrend as institutional investors enter the market.",
    likes: 24,
    comments: 7,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    category: "Crypto"
  },
  {
    id: "2",
    title: "Tesla Q2 Earnings - Beat or Miss?",
    author: { name: "StockTrader21" },
    content: "Looking at Tesla's production numbers and delivery estimates, I'm predicting a slight earnings beat but cautious guidance for Q3. What's your take?",
    likes: 18,
    comments: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    category: "Stocks"
  },
  {
    id: "3",
    title: "Federal Reserve meeting predictions",
    author: { name: "EconomistPro" },
    content: "With inflation trending down but still above target, I'm betting the Fed holds rates steady this meeting. Any thoughts on their forward guidance?",
    likes: 31,
    comments: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    category: "Economy"
  }
];

const mockLeaderboardUsers: LeaderboardUser[] = [
  {
    id: "1",
    name: "MarketMaster",
    rank: 1,
    score: 1250,
    winRate: 68,
    badges: ["Analyst", "Streak: 5"],
    change: 0
  },
  {
    id: "2",
    name: "PredictionPro",
    rank: 2,
    score: 1120,
    winRate: 65,
    badges: ["Consistent"],
    change: 1
  },
  {
    id: "3",
    name: "TradingGuru",
    rank: 3,
    score: 980,
    winRate: 60,
    badges: ["Volume"],
    change: -1
  },
  {
    id: "4",
    name: "FutureForecaster",
    rank: 4,
    score: 860,
    winRate: 55,
    badges: ["Newcomer"],
    change: 2
  },
  {
    id: "5",
    name: "OddsExpert",
    rank: 5,
    score: 790,
    winRate: 52,
    badges: ["Comeback"],
    change: 0
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [positions, setPositions] = useState<UserPosition[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  const calculateMetrics = () => {
    const totalProfitLoss = transactions
      .filter(t => t.type === "resolve")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const resolvedBets = transactions.filter(t => t.type === "resolve");
    const winRate = resolvedBets.length > 0
      ? (resolvedBets.filter(t => t.amount > 0).length / resolvedBets.length) * 100
      : 0;
    
    const activePositions = positions.filter(p => 
      p.status !== "resolved_yes" && p.status !== "resolved_no" && p.status !== "cancelled"
    ).length;
    
    const resolvedPositions = positions.filter(p => 
      p.status === "resolved_yes" || p.status === "resolved_no"
    ).length;
    
    return {
      totalProfitLoss,
      winRate,
      activePositions,
      resolvedPositions
    };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user && !loading) {
        navigate("/login");
        return;
      }
      
      if (user) {
        setIsLoading(true);
        try {
          const [userPositions, userTransactions] = await Promise.all([
            getUserPositions(),
            getUserTransactions()
          ]);
          
          setPositions(userPositions);
          setTransactions(userTransactions);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [user, loading, navigate]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  const { totalProfitLoss, winRate, activePositions, resolvedPositions } = calculateMetrics();

  if (loading || (isLoading && user)) {
    return (
      <Layout>
        <div className="container py-8 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-[400px] bg-muted rounded"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-8">
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please sign in to view your dashboard.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
        
        <Tabs defaultValue="analytics">
          <TabsList className="mb-6">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="positions" className="flex items-center gap-2">
              <AreaChart className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>Positions</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>Activity</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>Community</span>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className={isMobile ? "sr-only" : ""}>Leaderboard</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics">
            <AnalyticsDashboard 
              transactions={transactions}
              profitLoss={totalProfitLoss}
              winRate={winRate}
              activePositions={activePositions}
              resolvedPositions={resolvedPositions}
            />
          </TabsContent>
          
          <TabsContent value="positions">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Your Positions</h2>
                <Button size="sm" onClick={() => navigate("/markets")}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Position
                </Button>
              </div>
              
              {positions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {positions.map((position) => (
                    <Card key={position.marketId}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{position.question}</CardTitle>
                          <div className={`px-2 py-1 text-xs rounded-full ${
                            position.status === 'open' 
                              ? 'bg-blue-100 text-blue-800' 
                              : position.status === 'resolved_yes' || position.status === 'resolved_no'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {position.status === 'open' ? 'Active' : 'Resolved'}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Position</div>
                            <div className={`font-semibold ${position.position === 'yes' ? 'text-market-yes' : 'text-market-no'}`}>
                              {position.position.toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Shares</div>
                            <div className="font-semibold">{position.shares}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Avg. Price</div>
                            <div className="font-semibold">{(position.averagePrice * 100).toFixed(0)}¢</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Potential Profit</div>
                            <div className="font-semibold text-green-600">+{position.potentialProfit.toFixed(2)}</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2 border-t">
                        <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(`/market/${position.marketId}`)}>
                          View Market
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Positions</CardTitle>
                    <CardDescription>You don't have any active positions yet.</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={() => navigate("/markets")}>Explore Markets</Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.slice(0, 10).map((transaction) => (
                    <Card key={transaction.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{transaction.question}</CardTitle>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(transaction.timestamp)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-xs text-muted-foreground">Type</div>
                            <div className="font-semibold capitalize">{transaction.type}</div>
                          </div>
                          {transaction.position && (
                            <div>
                              <div className="text-xs text-muted-foreground">Position</div>
                              <div className={`font-semibold ${transaction.position === 'yes' ? 'text-market-yes' : 'text-market-no'}`}>
                                {transaction.position.toUpperCase()}
                              </div>
                            </div>
                          )}
                          {transaction.shares && (
                            <div>
                              <div className="text-xs text-muted-foreground">Shares</div>
                              <div className="font-semibold">{transaction.shares}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-xs text-muted-foreground">Amount</div>
                            <div className={`font-semibold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Activity</CardTitle>
                    <CardDescription>You don't have any transactions yet.</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button onClick={() => navigate("/markets")}>Start Trading</Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="community">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Community Discussion</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Post
                </Button>
              </div>
              
              {mockForumPosts.map(post => (
                <ForumCard key={post.id} post={post} />
              ))}
              
              <div className="text-center pt-4">
                <Button variant="outline">View More Discussions</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <div className="space-y-6">
              <Leaderboard 
                users={mockLeaderboardUsers} 
                title="Top Traders This Month" 
                description="Traders with the highest profit this month"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Badges</CardTitle>
                  <CardDescription>Achievements you've earned so far</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="px-3 py-1">
                      <Clock className="h-3 w-3 mr-1" />
                      First Trade
                    </Badge>
                    {positions.length >= 5 && (
                      <Badge className="px-3 py-1">
                        <LineChart className="h-3 w-3 mr-1" />
                        Portfolio Builder
                      </Badge>
                    )}
                    {winRate >= 60 && (
                      <Badge className="px-3 py-1">
                        <Trophy className="h-3 w-3 mr-1" />
                        Sharp Predictor
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Keep trading to unlock more badges and climb the leaderboard!
                  </p>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;

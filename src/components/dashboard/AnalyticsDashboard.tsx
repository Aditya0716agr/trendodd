
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ArrowUp, ArrowDown, TrendingUp, Activity, BarChart4, PieChart as PieChartIcon } from "lucide-react";
import { Transaction } from "@/types/market";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnalyticsDashboardProps {
  transactions: Transaction[];
  profitLoss: number;
  winRate: number;
  activePositions: number;
  resolvedPositions: number;
}

export const AnalyticsDashboard = ({
  transactions,
  profitLoss,
  winRate,
  activePositions,
  resolvedPositions,
}: AnalyticsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const isMobile = useIsMobile();
  
  // Process transaction data for charts
  const processTransactionData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const dailyData = last7Days.map(day => {
      const dayTransactions = transactions.filter(t => 
        t.timestamp.split('T')[0] === day
      );
      
      const volume = dayTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const profit = dayTransactions.reduce((sum, t) => 
        t.type === "resolve" ? sum + t.amount : sum, 0
      );
      
      return {
        date: day.slice(5), // MM-DD format
        volume: volume || 0,
        profit: profit || 0
      };
    });
    
    return dailyData;
  };
  
  const transactionData = processTransactionData();
  
  // Distribution of positions by category
  const positionsByCategory = [
    { name: "Crypto", value: 35 },
    { name: "Stocks", value: 25 },
    { name: "Politics", value: 20 },
    { name: "Sports", value: 15 },
    { name: "Other", value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)}
              </div>
              {profitLoss >= 0 ? (
                <ArrowUp className="ml-2 h-4 w-4 text-green-600" />
              ) : (
                <ArrowDown className="ml-2 h-4 w-4 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                {winRate.toFixed(0)}%
              </div>
              <TrendingUp className="ml-2 h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePositions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedPositions}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span className={isMobile ? "sr-only" : ""}>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="volume" className="flex items-center gap-1">
            <BarChart4 className="h-4 w-4" />
            <span className={isMobile ? "sr-only" : ""}>Volume</span>
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-1">
            <PieChartIcon className="h-4 w-4" />
            <span className={isMobile ? "sr-only" : ""}>Distribution</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit/Loss Trend</CardTitle>
              <CardDescription>Your profit and loss over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)}`, 'Profit/Loss']} />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#10B981" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="volume" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Volume</CardTitle>
              <CardDescription>Your daily trading volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)}`, 'Volume']} />
                    <Bar dataKey="volume" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Positions by Category</CardTitle>
              <CardDescription>Distribution of your positions across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={positionsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {positionsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

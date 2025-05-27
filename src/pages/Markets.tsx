import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ArrowUpDown, Search } from "lucide-react";
import { Market, MarketCategory } from "@/types/market";
import { getMarkets } from "@/services/market";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const marketCategories = [
  { id: "crypto", name: "Crypto" },
  { id: "stocks", name: "Stocks" },
  { id: "politics", name: "Politics" },
  { id: "economy", name: "Economy" },
  { id: "technology", name: "Technology" },
  { id: "sports", name: "Sports" },
  { id: "entertainment", name: "Entertainment" },
];

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<MarketCategory | "all">("all");
  const [sortField, setSortField] = useState<"volume" | "closeDate">("volume");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      setIsLoading(true);
      try {
        const marketData = await getMarkets();
        setMarkets(marketData as Market[]);
        toast.success("Markets loaded successfully");
      } catch (error) {
        console.error("Error fetching markets:", error);
        toast.error("Error loading markets. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();

    const marketChannel = supabase
      .channel('market-price-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'markets'
      }, () => {
        fetchMarkets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(marketChannel);
    };
  }, []);

  useEffect(() => {
    let results = [...markets];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(market => 
        market.question.toLowerCase().includes(query) || 
        market.description.toLowerCase().includes(query)
      );
    }
    
    if (activeCategory !== "all") {
      results = results.filter(market => market.category === activeCategory);
    }
    
    results.sort((a, b) => {
      if (sortField === "volume") {
        return sortDirection === "desc" ? b.volume - a.volume : a.volume - b.volume;
      } else {
        return sortDirection === "desc" 
          ? new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime()
          : new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
      }
    });
    
    setFilteredMarkets(results);
  }, [searchQuery, activeCategory, sortField, sortDirection, markets]);

  const toggleSort = (field: "volume" | "closeDate") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatTimeRemaining = (dateString: string) => {
    const closeDate = new Date(dateString);
    const now = new Date();
    const diffTime = closeDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 1 ? `${diffDays} days` : diffDays === 1 ? "1 day" : "< 1 day";
  };

  const MarketCard = ({ market }: { market: Market }) => (
    <Link to={`/market/${market.id}`} key={market.id} className="block hover:no-underline">
      <div className="market-card flex flex-col md:flex-row md:items-center">
        <div className="flex-grow mb-4 md:mb-0 md:mr-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="status-badge status-badge-pending capitalize">
              {market.category}
            </span>
            <div className="flex items-center text-sm text-muted-foreground gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeRemaining(market.closeDate)}</span>
            </div>
          </div>
          <h3 className="heading-3">{market.question}</h3>
        </div>
        
        <div className="flex items-center gap-8">
          <div>
            <div className="text-sm text-muted-foreground mb-2">Current Prices</div>
            <div className="flex gap-4">
              <span className="font-semibold text-green-600">Yes: {Math.round(market.yesPrice * 100)}¢</span>
              <span className="font-semibold text-red-600">No: {Math.round(market.noPrice * 100)}¢</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-2">Volume</div>
            <div className="font-semibold">
              {market.volume > 1000 
                ? `${(market.volume / 1000).toFixed(1)}K` 
                : market.volume.toFixed(0)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  const MarketSkeleton = () => (
    <div className="market-card animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="flex-grow mb-4 md:mb-0 md:mr-6">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-7 w-full max-w-md" />
        </div>
        <div className="flex items-center gap-8">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container section-spacing container-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="heading-2 mb-3">Explore Markets</h1>
            <p className="body-large">Discover and trade on prediction markets</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search markets..."
              className="pl-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setActiveCategory(value as MarketCategory | "all")}>
          <TabsList className="mb-8 flex flex-wrap h-auto bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-background">All Markets</TabsTrigger>
            {marketCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="rounded-lg data-[state=active]:bg-background">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex justify-end mb-6 gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => toggleSort("volume")}
            >
              Volume
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl"
              onClick={() => toggleSort("closeDate")}
            >
              Closing Date
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="single-column-grid">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <MarketSkeleton key={index} />
              ))
            ) : filteredMarkets.length > 0 ? (
              filteredMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))
            ) : (
              <div className="text-center py-16 market-card">
                <p className="body-large">No markets found matching your criteria.</p>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Markets;

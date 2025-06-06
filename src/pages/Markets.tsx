
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Market, MarketCategory } from "@/types/market";
import { getMarkets } from "@/services/market";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MarketCard from "@/components/markets/MarketCard";
import CategoryFilter from "@/components/markets/CategoryFilter";
import SortControls from "@/components/markets/SortControls";

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

  const MarketSkeleton = () => (
    <div className="market-card animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="mb-6">
        <Skeleton className="h-6 w-full max-w-md mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-end justify-between">
        <Skeleton className="h-20 w-64 rounded-lg" />
        <div className="text-right">
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-12" />
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container section-spacing container-padding">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <h1 className="heading-1 mb-6">
              Explore Prediction Markets
            </h1>
            <p className="body-large max-w-3xl mx-auto">
              Trade on real-world events with data-driven insights. Join thousands of traders making predictions on crypto, politics, sports, and more.
            </p>
          </div>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search prediction markets..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Enhanced Category Filter */}
          <div className="mb-12">
            <CategoryFilter 
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Enhanced Sort Controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold">{filteredMarkets.length}</span> markets found
            </div>
            <SortControls
              sortField={sortField}
              sortDirection={sortDirection}
              onSortChange={toggleSort}
            />
          </div>

          {/* Enhanced Markets Grid */}
          <div className="market-grid">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <MarketSkeleton key={index} />
              ))
            ) : filteredMarkets.length > 0 ? (
              filteredMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="market-card p-16 max-w-md mx-auto">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="heading-3 mb-4">No markets found</h3>
                  <p className="body-base mb-6">Try adjusting your search criteria or browse different categories to discover new prediction markets.</p>
                  <Button className="professional-button">
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Markets;

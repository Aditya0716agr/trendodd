
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, parseISO } from "date-fns";
import { Search, Clock, ArrowUpDown } from "lucide-react";
import { mockMarkets, marketCategories } from "@/data/mockMarkets";
import { Market, MarketCategory } from "@/types/market";

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<MarketCategory | "all">("all");
  const [sortField, setSortField] = useState<"volume" | "closeDate">("volume");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>(mockMarkets);

  // Apply filters when any filter parameter changes
  useEffect(() => {
    let results = [...mockMarkets];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(market => 
        market.question.toLowerCase().includes(query) || 
        market.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (activeCategory !== "all") {
      results = results.filter(market => market.category === activeCategory);
    }
    
    // Sort the results
    results.sort((a, b) => {
      if (sortField === "volume") {
        return sortDirection === "desc" ? b.volume - a.volume : a.volume - b.volume;
      } else {
        // Sort by closeDate
        return sortDirection === "desc" 
          ? new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime()
          : new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
      }
    });
    
    setFilteredMarkets(results);
  }, [searchQuery, activeCategory, sortField, sortDirection]);

  // Toggle sort direction
  const toggleSort = (field: "volume" | "closeDate") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Format remaining time
  const formatTimeRemaining = (dateString: string) => {
    const closeDate = new Date(dateString);
    const now = new Date();
    const diffTime = closeDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 1 ? `${diffDays} days` : diffDays === 1 ? "1 day" : "< 1 day";
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Explore Markets</h1>
            <p className="text-muted-foreground">Discover and trade on prediction markets</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search markets..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setActiveCategory(value as MarketCategory | "all")}>
          <TabsList className="mb-6 flex flex-wrap h-auto">
            <TabsTrigger value="all">All Markets</TabsTrigger>
            {marketCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex justify-end mb-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => toggleSort("volume")}
            >
              Volume
              <ArrowUpDown className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => toggleSort("closeDate")}
            >
              Closing Date
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {filteredMarkets.length > 0 ? (
                filteredMarkets.map((market) => (
                  <Link to={`/market/${market.id}`} key={market.id}>
                    <div className="market-card flex flex-col md:flex-row md:items-center">
                      <div className="flex-grow mb-4 md:mb-0 md:mr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium capitalize">
                            {market.category}
                          </span>
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeRemaining(market.closeDate)}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold">{market.question}</h3>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Current Prices</div>
                          <div className="flex gap-3">
                            <div>
                              <span className="price-yes">Yes: {Math.round(market.yesPrice * 100)}¢</span>
                            </div>
                            <div>
                              <span className="price-no">No: {Math.round(market.noPrice * 100)}¢</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground mb-1">Volume</div>
                          <div className="font-medium">{(market.volume / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg bg-muted/50">
                  <p className="text-muted-foreground">No markets found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Create a TabsContent for each category, with the same layout as 'all' */}
          {marketCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 gap-4">
                {filteredMarkets.length > 0 ? (
                  filteredMarkets.map((market) => (
                    <Link to={`/market/${market.id}`} key={market.id}>
                      <div className="market-card flex flex-col md:flex-row md:items-center">
                        <div className="flex-grow mb-4 md:mb-0 md:mr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium capitalize">
                              {market.category}
                            </span>
                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeRemaining(market.closeDate)}</span>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold">{market.question}</h3>
                        </div>
                        
                        <div className="flex items-center gap-8">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Current Prices</div>
                            <div className="flex gap-3">
                              <div>
                                <span className="price-yes">Yes: {Math.round(market.yesPrice * 100)}¢</span>
                              </div>
                              <div>
                                <span className="price-no">No: {Math.round(market.noPrice * 100)}¢</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground mb-1">Volume</div>
                            <div className="font-medium">{(market.volume / 1000).toFixed(0)}K</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-muted/50">
                    <p className="text-muted-foreground">No markets found matching your criteria.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Markets;

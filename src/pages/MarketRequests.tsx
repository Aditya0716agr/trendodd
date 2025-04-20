
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { getPendingMarketRequests, upvoteMarketRequest } from "@/services/market";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, Clock, Search, Calendar } from "lucide-react";

interface MarketRequest {
  id: string;
  question: string;
  description: string;
  category: string;
  close_date: string;
  requested_by: string;
  created_at: string;
  upvotes: number;
  has_upvoted?: boolean;
  profiles?: {
    username?: string;
  }
}

const MarketRequests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [marketRequests, setMarketRequests] = useState<MarketRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MarketRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");

  const categories = [
    { id: "crypto", name: "Crypto" },
    { id: "stocks", name: "Stocks" },
    { id: "politics", name: "Politics" },
    { id: "economy", name: "Economy" },
    { id: "technology", name: "Technology" },
    { id: "sports", name: "Sports" },
    { id: "entertainment", name: "Entertainment" },
  ];

  useEffect(() => {
    fetchMarketRequests();
  }, []);

  useEffect(() => {
    let results = [...marketRequests];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(request => 
        request.question.toLowerCase().includes(query) || 
        request.description.toLowerCase().includes(query)
      );
    }
    
    if (activeCategory !== "all") {
      results = results.filter(request => request.category === activeCategory);
    }
    
    // Sort by upvotes (highest first)
    results.sort((a, b) => b.upvotes - a.upvotes);
    
    setFilteredRequests(results);
  }, [searchQuery, activeCategory, marketRequests]);

  const fetchMarketRequests = async () => {
    setIsLoading(true);
    try {
      const data = await getPendingMarketRequests();
      setMarketRequests(data);
    } catch (error) {
      console.error("Error fetching market requests:", error);
      toast.error("Failed to load market requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (requestId: string) => {
    if (!user) {
      toast.error("Please sign in to upvote");
      navigate("/login");
      return;
    }

    try {
      const result = await upvoteMarketRequest(requestId);
      
      if (result !== null) {
        setMarketRequests(prevRequests => 
          prevRequests.map(request => {
            if (request.id === requestId) {
              return {
                ...request,
                upvotes: result ? request.upvotes + 1 : request.upvotes - 1,
                has_upvoted: result
              };
            }
            return request;
          })
        );
      }
    } catch (error) {
      console.error("Error upvoting request:", error);
      toast.error("Failed to register your vote");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Community Market Requests</h1>
          <p className="text-muted-foreground">
            Browse and upvote market ideas submitted by our community. The most popular ideas may be turned into real markets!
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search requests..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={() => navigate("/request-market")} className="w-full md:w-auto">
            Submit Your Idea
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setActiveCategory(value as string | "all")}>
          <TabsList className="mb-6 flex flex-wrap h-auto">
            <TabsTrigger value="all" className="transition-all duration-200">All Categories</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="transition-all duration-200">
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-16 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                    <Skeleton className="h-6 w-full max-w-md mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full max-w-lg mb-2" />
                    <Skeleton className="h-4 w-full max-w-md" />
                  </CardContent>
                  <CardFooter>
                    <div className="flex justify-between items-center w-full">
                      <Skeleton className="h-4 w-32 rounded" />
                      <Skeleton className="h-9 w-24 rounded" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <motion.div 
              className="text-center py-12 border rounded-lg bg-muted/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-muted-foreground">No market requests match your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredRequests.map((request) => (
                <motion.div key={request.id} variants={item}>
                  <Card className="overflow-hidden border hover:shadow-md transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <Badge className="capitalize">{request.category}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          <span>Closes: {formatDate(request.close_date)}</span>
                        </div>
                      </div>
                      <CardTitle className="mt-2 text-xl">{request.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{request.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t pt-4">
                      <div className="flex items-center text-sm">
                        <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Requested on {formatDate(request.created_at)} by {request.profiles?.username || "Anonymous"}
                        </span>
                      </div>
                      <Button 
                        variant={request.has_upvoted ? "default" : "outline"}
                        size="sm"
                        className="gap-2"
                        onClick={() => handleUpvote(request.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>
                          {request.upvotes} {request.upvotes === 1 ? "vote" : "votes"}
                        </span>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default MarketRequests;

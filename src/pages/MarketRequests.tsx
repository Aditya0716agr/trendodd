import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, ThumbsUp, Clock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MarketRequest } from "@/types/market";

const MarketRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRequests, setFilteredRequests] = useState<MarketRequest[]>([]);

  const { data: marketRequests = [], isLoading, error, refetch } = useQuery({
    queryKey: ['market-requests'],
    queryFn: async (): Promise<MarketRequest[]> => {
      console.log("Fetching market requests...");
      
      const { data, error } = await supabase
        .from('market_requests')
        .select(`
          *,
          profiles!inner(username)
        `);

      if (error) {
        console.error("Error fetching market requests:", error);
        throw error;
      }

      console.log("Market requests data:", data);
      
      // Transform the data to match our MarketRequest type
      return (data || []).map(request => ({
        ...request,
        profiles: Array.isArray(request.profiles) ? request.profiles[0] : request.profiles
      }));
    }
  });

  useEffect(() => {
    if (error) {
      console.error("Market requests query error:", error);
      toast.error("Error loading market requests. Please refresh and try again.");
    }
  }, [error]);

  useEffect(() => {
    if (!marketRequests) return;
    
    let results = [...marketRequests];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(request => 
        request.question.toLowerCase().includes(query) || 
        request.description.toLowerCase().includes(query) ||
        request.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredRequests(results);
  }, [searchQuery, marketRequests]);

  const handleUpvote = async (requestId: string) => {
    try {
      // This would need proper implementation with user authentication
      toast.success("Feature coming soon!");
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error("Error upvoting request");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string = 'pending') => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      approved: { variant: "default" as const, label: "Approved" },
      rejected: { variant: "destructive" as const, label: "Rejected" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'crypto': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
      case 'politics': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
      case 'stocks': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
      case 'sports': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
      case 'technology': return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800';
      case 'entertainment': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
      case 'economy': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="container section-spacing container-padding">
            <div className="text-center mb-12">
              <h1 className="heading-1 mb-4">Market Requests</h1>
              <p className="body-large max-w-2xl mx-auto">
                Loading market requests...
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container section-spacing container-padding">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="heading-1 mb-4">Market Requests</h1>
            <p className="body-large max-w-2xl mx-auto">
              Browse and vote on community-submitted market ideas
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search market requests..."
                className="pl-12 h-12 rounded-2xl border-border text-base shadow-sm focus:border-primary focus:ring-primary bg-card"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Market Requests */}
          <div className="space-y-6">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <Card key={request.id} className="market-card hover:shadow-lg transition-all duration-200 border-border bg-card">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={`${getCategoryColor(request.category)} border`}>
                            {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
                          </Badge>
                          {getStatusBadge(request.status)}
                        </div>
                        <CardTitle className="text-xl font-semibold text-foreground leading-tight">
                          {request.question}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="body-base mb-4 leading-relaxed text-muted-foreground">
                      {request.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{request.profiles?.username || 'Anonymous'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(request.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Closes: {formatDate(request.close_date)}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="upvote-button upvote-button-inactive hover:bg-primary/10 border-border"
                        onClick={() => handleUpvote(request.id)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>0</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-16">
                <Card className="market-card p-12 border-border bg-card">
                  <div className="text-6xl mb-4">💡</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No requests found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria or check back later for new requests.</p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MarketRequests;

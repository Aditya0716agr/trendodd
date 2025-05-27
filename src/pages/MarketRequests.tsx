import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Search, ThumbsUp, User } from "lucide-react";
import { MarketRequest } from "@/types/market";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const MarketRequests = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [requests, setRequests] = useState<MarketRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MarketRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('market_requests')
          .select(`
            *,
            profiles (
              username
            ),
            market_request_upvotes (
              request_id,
              user_id
            )
          `);

        if (error) {
          console.error("Error fetching market requests:", error);
          toast.error("Error loading market requests. Please refresh and try again.");
          return;
        }

        const marketRequests = data as MarketRequest[];

        const enrichedRequests = marketRequests.map(request => ({
          ...request,
          upvotes_count: request.market_request_upvotes?.length || 0,
          has_user_upvoted: user ? request.market_request_upvotes?.some(upvote => upvote.user_id === user.id) : false,
        }));

        setRequests(enrichedRequests);
        toast.success("Market requests loaded successfully");
      } catch (error) {
        console.error("Error fetching market requests:", error);
        toast.error("Error loading market requests. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  useEffect(() => {
    let results = [...requests];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(request =>
        request.question.toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query)
      );
    }

    if (activeTab !== "all") {
      results = results.filter(request => request.category === activeTab);
    }

    setFilteredRequests(results);
  }, [searchQuery, activeTab, requests]);

  const handleUpvote = async (requestId: string, hasUpvoted: boolean) => {
    if (!user) {
      toast.error("Please sign in to upvote");
      return;
    }

    try {
      if (hasUpvoted) {
        await supabase
          .from('market_request_upvotes')
          .delete()
          .eq('request_id', requestId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('market_request_upvotes')
          .insert({
            request_id: requestId,
            user_id: user.id
          });
      }

      setRequests(prevRequests => 
        prevRequests.map(request => {
          if (request.id === requestId) {
            const newUpvotesCount = hasUpvoted 
              ? (request.upvotes_count || 0) - 1 
              : (request.upvotes_count || 0) + 1;
            
            return {
              id: request.id,
              question: request.question,
              description: request.description,
              category: request.category,
              close_date: request.close_date,
              requested_by: request.requested_by,
              created_at: request.created_at,
              status: request.status,
              rejection_reason: request.rejection_reason,
              market_id: request.market_id,
              upvotes_count: newUpvotesCount,
              upvotes: request.upvotes,
              has_user_upvoted: !hasUpvoted,
              has_upvoted: !hasUpvoted,
              profiles: request.profiles
            };
          }
          return request;
        })
      );
      
      toast.success(hasUpvoted ? "Upvote removed" : "Upvoted successfully");
    } catch (error) {
      console.error("Error updating upvote:", error);
      toast.error("Failed to update upvote");
    }
  };

  const formatTimeToClose = (dateString: string) => {
    const closeDate = new Date(dateString);
    const now = new Date();
    const diffTime = closeDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 1 ? `${diffDays} days` : diffDays === 1 ? "1 day" : "< 1 day";
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "approved":
        return <Badge>Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const MarketRequestCard = ({ request }: { request: MarketRequest }) => (
    <div className="market-request-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{request.question}</h3>
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <User className="h-4 w-4" />
            <span>{request.profiles?.username || "Anonymous"}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span>Closes in {formatTimeToClose(request.close_date)}</span>
          </div>
        </div>
        {getStatusBadge(request.status)}
      </div>
      <p className="text-sm text-muted-foreground mb-4">{request.description}</p>
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className={`upvote-button ${request.has_user_upvoted ? "upvote-button-active" : "upvote-button-inactive"}`}
          onClick={() => handleUpvote(request.id, !!request.has_user_upvoted)}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{request.upvotes_count || 0}</span>
        </Button>
        <span className="text-xs text-muted-foreground">
          Requested on {new Date(request.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  const MarketRequestSkeleton = () => (
    <div className="market-request-card animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div>
          <Skeleton className="h-6 w-48 mb-1" />
          <div className="flex items-center text-sm text-muted-foreground gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4 ml-2 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container section-spacing container-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="heading-2 mb-3">Market Requests</h1>
            <p className="body-large">Suggest new markets for our platform</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search requests..."
              className="pl-10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="mb-8 flex flex-wrap h-auto bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-background">All Requests</TabsTrigger>
            <TabsTrigger value="crypto" className="rounded-lg data-[state=active]:bg-background">Crypto</TabsTrigger>
            <TabsTrigger value="stocks" className="rounded-lg data-[state=active]:bg-background">Stocks</TabsTrigger>
            <TabsTrigger value="politics" className="rounded-lg data-[state=active]:bg-background">Politics</TabsTrigger>
            <TabsTrigger value="economy" className="rounded-lg data-[state=active]:bg-background">Economy</TabsTrigger>
            <TabsTrigger value="technology" className="rounded-lg data-[state=active]:bg-background">Technology</TabsTrigger>
            <TabsTrigger value="sports" className="rounded-lg data-[state=active]:bg-background">Sports</TabsTrigger>
            <TabsTrigger value="entertainment" className="rounded-lg data-[state=active]:bg-background">Entertainment</TabsTrigger>
          </TabsList>

          <div className="single-column-grid">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <MarketRequestSkeleton key={index} />
              ))
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <MarketRequestCard key={request.id} request={request} />
              ))
            ) : (
              <div className="text-center py-16 market-card">
                <p className="body-large">No market requests found matching your criteria.</p>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MarketRequests;

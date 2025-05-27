
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { MarketRequest } from "@/types/market";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUp, CalendarDays, Clock, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const MarketRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [marketRequests, setMarketRequests] = useState<MarketRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch market requests
  useEffect(() => {
    const fetchMarketRequests = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('market_requests_with_votes')
          .select('*, profiles:requested_by(username)')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching market requests:', error);
          throw error;
        }

        if (data) {
          const transformedData: MarketRequest[] = data.map(request => {
            // Safely handle profiles data
            let username = "Anonymous";
            if (request.profiles && 
                request.profiles !== null && 
                typeof request.profiles === "object" && 
                'username' in request.profiles && 
                typeof request.profiles.username === 'string') {
              username = request.profiles.username;
            }
            
            return {
              id: request.id || "",
              question: request.question || "",
              description: request.description || "",
              category: request.category || "",
              close_date: request.close_date || new Date().toISOString(),
              requested_by: request.requested_by || "",
              created_at: request.created_at || new Date().toISOString(),
              status: request.status || "pending",
              rejection_reason: request.rejection_reason || null,
              market_id: request.market_id || null,
              upvotes: request.upvotes_count || 0,
              has_upvoted: request.has_user_upvoted || false,
              profiles: { username }
            };
          });
          
          setMarketRequests(transformedData);
        }
      } catch (error) {
        console.error('Error in fetchMarketRequests:', error);
        toast({
          title: "Error",
          description: "Failed to load market requests. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMarketRequests();
  }, [toast]);

  // Handle upvote
  const handleUpvote = async (requestId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upvote market requests",
        variant: "destructive",
      });
      return;
    }

    try {
      const requestToUpdate = marketRequests.find(r => r.id === requestId);
      if (!requestToUpdate) return;

      if (requestToUpdate.has_upvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('market_request_upvotes')
          .delete()
          .eq('market_request_id', requestId)
          .eq('user_id', user.id);

        if (error) throw error;

        setMarketRequests(prev =>
          prev.map(request =>
            request.id === requestId
              ? {
                  ...request,
                  upvotes: Math.max(0, (request.upvotes || 0) - 1),
                  has_upvoted: false
                }
              : request
          )
        );

        toast({
          title: "Upvote removed",
          description: "You've removed your upvote for this market request",
        });
      } else {
        // Add upvote
        const { error } = await supabase
          .from('market_request_upvotes')
          .insert({
            market_request_id: requestId,
            user_id: user.id,
          });

        if (error) throw error;

        setMarketRequests(prev =>
          prev.map(request =>
            request.id === requestId
              ? {
                  ...request,
                  upvotes: (request.upvotes || 0) + 1,
                  has_upvoted: true
                }
              : request
          )
        );

        toast({
          title: "Upvoted!",
          description: "You've upvoted this market request",
        });
      }
    } catch (error) {
      console.error('Error in handleUpvote:', error);
      toast({
        title: "Error",
        description: "Failed to process your upvote. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Helper to get status badge class
  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'rejected':
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200';
      default:
        return 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  // Helper to get status text
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Market Requests
            </h1>
            <p className="text-muted-foreground">
              Browse and upvote community-requested prediction markets
            </p>
          </div>

          <Link to="/request-market">
            <Button className="gap-2 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg">
              <Plus className="h-4 w-4" />
              Submit Request
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 animate-pulse"
              >
                <div className="h-6 w-20 bg-muted rounded mb-3"></div>
                <div className="h-7 w-3/4 bg-muted rounded mb-2"></div>
                <div className="h-4 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-muted rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-5 w-32 bg-muted rounded"></div>
                  <div className="h-8 w-20 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : marketRequests.length === 0 ? (
          <div className="text-center py-12 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm">
            <p className="text-muted-foreground mb-4">No market requests found</p>
            <Link to="/request-market">
              <Button className="bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg transition-all duration-300">
                Submit the first request
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketRequests.map(request => (
              <div 
                key={request.id} 
                className="bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 rounded-xl p-6"
              >
                <div className="flex justify-between mb-3">
                  <span className={getStatusBadgeClass(request.status)}>
                    {getStatusText(request.status)}
                  </span>

                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-foreground">{request.question}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{request.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>Closes: {new Date(request.close_date).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => handleUpvote(request.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                      request.has_upvoted
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="font-medium">{request.upvotes || 0}</span>
                  </button>
                </div>

                {request.status === 'approved' && request.market_id && (
                  <div className="mt-4 text-right">
                    <Link to={`/market/${request.market_id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-primary/10 transition-colors duration-300">
                        View Market
                      </Button>
                    </Link>
                  </div>
                )}

                {request.status === 'rejected' && request.rejection_reason && (
                  <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                    Reason: {request.rejection_reason}
                  </div>
                )}

                <div className="mt-3 text-xs text-muted-foreground">
                  By {request.profiles?.username || "Anonymous"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MarketRequests;

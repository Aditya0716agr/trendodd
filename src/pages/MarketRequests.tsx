
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
            // Safely handle profiles data with proper null checking
            let username = "Anonymous";
            if (request.profiles && request.profiles !== null) {
              if (Array.isArray(request.profiles) && request.profiles.length > 0) {
                username = request.profiles[0]?.username || "Anonymous";
              } else if (typeof request.profiles === "object") {
                const profileObj = request.profiles as { username?: string };
                username = profileObj.username || "Anonymous";
              }
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

  // Handle upvote with simplified state update
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

        // Simplified state update
        setMarketRequests(prev => prev.map(request => 
          request.id === requestId 
            ? { ...request, upvotes: Math.max(0, request.upvotes - 1), has_upvoted: false }
            : request
        ));

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

        // Simplified state update
        setMarketRequests(prev => prev.map(request => 
          request.id === requestId 
            ? { ...request, upvotes: request.upvotes + 1, has_upvoted: true }
            : request
        ));

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

  return (
    <Layout>
      <div className="container section-spacing container-padding">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="heading-2 mb-3">Market Requests</h1>
            <p className="body-large">Browse and upvote community-requested prediction markets</p>
          </div>

          <Link to="/request-market">
            <Button className="professional-button">
              <Plus className="h-4 w-4" />
              Submit Request
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="single-column-grid">
            {[1, 2, 3, 4].map((_, index) => (
              <div
                key={index}
                className="market-card animate-pulse"
              >
                <div className="h-6 w-20 bg-muted rounded mb-4"></div>
                <div className="h-7 w-3/4 bg-muted rounded mb-3"></div>
                <div className="h-4 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-muted rounded mb-6"></div>
                <div className="flex justify-between items-center">
                  <div className="h-5 w-32 bg-muted rounded"></div>
                  <div className="h-8 w-20 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : marketRequests.length === 0 ? (
          <div className="text-center py-16 market-card">
            <p className="body-large mb-6">No market requests found</p>
            <Link to="/request-market">
              <Button className="professional-button">
                Submit the first request
              </Button>
            </Link>
          </div>
        ) : (
          <div className="single-column-grid">
            {marketRequests.map(request => (
              <div 
                key={request.id} 
                className="market-card"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`status-badge ${
                    request.status === 'approved' ? 'status-badge-approved' :
                    request.status === 'rejected' ? 'status-badge-rejected' :
                    'status-badge-pending'
                  }`}>
                    {request.status === 'approved' ? 'Approved' :
                     request.status === 'rejected' ? 'Rejected' : 'Pending'}
                  </span>

                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                  </div>
                </div>

                <h3 className="heading-3 mb-3">{request.question}</h3>
                <p className="body-base mb-6 line-clamp-2">{request.description}</p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Closes: {new Date(request.close_date).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => handleUpvote(request.id)}
                    className={`upvote-button ${
                      request.has_upvoted ? 'upvote-button-active' : 'upvote-button-inactive'
                    }`}
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span className="font-semibold">{request.upvotes || 0}</span>
                  </button>
                </div>

                {request.status === 'approved' && request.market_id && (
                  <div className="mt-6 text-right">
                    <Link to={`/market/${request.market_id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        View Market
                      </Button>
                    </Link>
                  </div>
                )}

                {request.status === 'rejected' && request.rejection_reason && (
                  <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                    <strong>Reason:</strong> {request.rejection_reason}
                  </div>
                )}

                <div className="mt-4 text-sm text-muted-foreground">
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

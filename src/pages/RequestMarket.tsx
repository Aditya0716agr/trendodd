import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { CalendarIcon, ArrowLeft, ThumbsUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { submitMarketRequest, getUserMarketRequests, getPendingMarketRequests, upvoteMarketRequest } from "@/services/market";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MarketCategory } from "@/types/market";

const formSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters").max(200, "Question must be less than 200 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description must be less than 1000 characters"),
  category: z.enum(["politics", "crypto", "stocks", "sports", "entertainment", "technology", "economy"]),
  closeDate: z.date().refine(
    (date) => isBefore(new Date(), date), 
    { message: "Close date must be in the future" }
  ),
});

type FormValues = z.infer<typeof formSchema>;

const RequestMarket = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRequests, setUserRequests] = useState<any[]>([]);
  const [showRequests, setShowRequests] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoadingPendingRequests, setIsLoadingPendingRequests] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      description: "",
      category: "crypto",
      closeDate: addDays(new Date(), 30),
    },
  });

  const loadUserRequests = async () => {
    if (!user) return;
    
    const requests = await getUserMarketRequests();
    setUserRequests(requests);
    setShowRequests(true);
  };

  const loadPendingRequests = async () => {
    setIsLoadingPendingRequests(true);
    try {
      const requests = await getPendingMarketRequests();
      setPendingRequests(requests);
    } catch (error) {
      console.error("Error loading pending requests:", error);
      toast.error("Failed to load pending market requests");
    } finally {
      setIsLoadingPendingRequests(false);
    }
  };

  const handleUpvote = async (requestId: string) => {
    if (!user) {
      toast.error("Please sign in to upvote");
      navigate("/login");
      return;
    }

    const result = await upvoteMarketRequest(requestId);
    
    if (result !== null) {
      loadPendingRequests();
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error("Please sign in to submit a market request");
      navigate("/login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await submitMarketRequest(
        values.question,
        values.description,
        values.category as MarketCategory,
        values.closeDate.toISOString()
      );
      
      if (result) {
        toast.success("Market request submitted successfully");
        form.reset();
        loadUserRequests();
      }
    } catch (error) {
      console.error("Error submitting market request:", error);
      toast.error("Failed to submit market request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "approved":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="flex justify-center items-center h-64">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Request a Prediction Market</h1>
            <p className="mb-6 text-muted-foreground">
              You need to be signed in to request a new prediction market.
            </p>
            <Button onClick={() => navigate("/login")}>Sign In</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6" 
          onClick={() => navigate("/markets")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Markets
        </Button>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Request a Prediction Market</h1>
          <p className="mb-8 text-muted-foreground">
            Don't see a market you're interested in? Submit a request for a new prediction market here.
          </p>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Submit New Request</h2>
            <Button 
              variant="outline" 
              onClick={() => {
                if (showRequests) {
                  setShowRequests(false);
                } else {
                  loadUserRequests();
                }
              }}
            >
              {showRequests ? "Hide My Requests" : "View My Requests"}
            </Button>
          </div>
          
          {showRequests && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Your Recent Requests</h3>
              
              {userRequests.length === 0 ? (
                <p className="text-muted-foreground">You haven't submitted any market requests yet.</p>
              ) : (
                <div className="space-y-4">
                  {userRequests.map((request) => (
                    <Card key={request.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">{request.question}</CardTitle>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </div>
                        <CardDescription>
                          {format(new Date(request.created_at), "MMM d, yyyy")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm">
                        <p className="line-clamp-2">{request.description}</p>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between items-center text-sm">
                        <span>Category: <span className="capitalize">{request.category}</span></span>
                        <span>Closes: {format(new Date(request.close_date), "MMM d, yyyy")}</span>
                      </CardFooter>
                      {request.status === "rejected" && request.rejection_reason && (
                        <CardFooter className="pt-0 text-sm text-red-500">
                          Reason: {request.rejection_reason}
                        </CardFooter>
                      )}
                      {request.status === "approved" && request.market_id && (
                        <CardFooter className="pt-0">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/market/${request.market_id}`)}
                          >
                            View Market
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="border-t my-6"></div>
            </div>
          )}
          
          <div className="mt-8 p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium mb-2">How Market Requests Work</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Submit your request for a prediction market with a clear yes/no question.</li>
              <li>Our team reviews your request for clarity, feasibility, and interest.</li>
              <li>If approved, your market goes live and you'll be notified.</li>
              <li>Markets must have clear resolution criteria by the close date.</li>
            </ol>
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Pending Market Requests</h2>
              <Button 
                variant="outline" 
                onClick={loadPendingRequests}
                disabled={isLoadingPendingRequests}
              >
                {isLoadingPendingRequests ? "Loading..." : "Refresh Requests"}
              </Button>
            </div>
            
            {pendingRequests.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No pending market requests found.
              </p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="hover:bg-accent/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{request.question}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleUpvote(request.id)}
                            disabled={!user}
                            className={cn(
                              "flex items-center space-x-1",
                              request.has_user_upvoted ? "text-primary" : "text-muted-foreground"
                            )}
                          >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{request.upvotes_count}</span>
                          </Button>
                        </div>
                      </div>
                      <CardDescription>
                        By {request.profiles?.username || 'Anonymous'} | {format(new Date(request.created_at), "MMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="line-clamp-2">{request.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between items-center text-sm">
                      <span className="capitalize">Category: {request.category}</span>
                      <span>Closes: {format(new Date(request.close_date), "MMM d, yyyy")}</span>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Will Bitcoin exceed $100,000 by the end of 2025?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the market in detail. Include clear resolution criteria."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="politics">Politics</SelectItem>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="stocks">Stocks</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="economy">Economy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="closeDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Close Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => isBefore(date, new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default RequestMarket;

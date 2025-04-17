
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketCategory } from "@/types/market";
import { Lightbulb, CheckCircle2 } from "lucide-react";

const marketCategories = [
  { id: "crypto", name: "Crypto" },
  { id: "stocks", name: "Stocks" },
  { id: "politics", name: "Politics" },
  { id: "economy", name: "Economy" },
  { id: "technology", name: "Technology" },
  { id: "sports", name: "Sports" },
  { id: "entertainment", name: "Entertainment" },
];

const formSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters long"),
  description: z.string().min(30, "Description must be at least 30 characters long"),
  category: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
});

const RequestMarket = () => {
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      email: user?.email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Since we can't use market_requests directly (it doesn't exist in the database yet),
      // we'll use a table we know exists (markets) but just for storage purposes
      // and add a special status to identify it as a request
      const { error } = await supabase
        .from("markets")
        .insert([
          {
            question: values.title, // Use question field for the market title
            description: values.description,
            category: values.category || "other",
            created_by: user?.id,
            status: "request", // Mark this as a request, not a real market
            yes_price: 0.5,
            no_price: 0.5,
            volume: 0,
            liquidity: 0,
            close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          },
        ]);

      if (error) {
        toast({
          title: "Error submitting request",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Market request submitted!",
        description: "Thank you for your suggestion. Our team will review it soon.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting market request:", error);
      toast({
        title: "Unexpected error",
        description: "Failed to submit market request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container py-12 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-3">Request a Market</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have an interesting prediction in mind? Suggest a new market for the TrendOdds community.
          </p>
        </div>

        {isSubmitted ? (
          <Card className="animate-fade-in">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p className="text-muted-foreground mb-6">
                Your market suggestion has been submitted and will be reviewed by our team.
              </p>
              <div className="space-x-4">
                <Button onClick={() => setIsSubmitted(false)}>Make Another Suggestion</Button>
                <Button variant="outline" asChild>
                  <a href="/markets">Browse Markets</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Market Suggestion Form</CardTitle>
              <CardDescription>
                Fill in the details of your suggested prediction market.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Question</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Will Bitcoin exceed $100,000 by the end of 2025?" {...field} />
                        </FormControl>
                        <FormDescription>
                          Frame your market as a yes/no question that has a definitive outcome.
                        </FormDescription>
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
                            placeholder="Provide details about how this market would be resolved..."
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Explain the conditions for resolving this market as "yes" or "no".
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            {marketCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose the category that best fits your market.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!user && (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Provide your email if you want to be notified when your market is created.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="flex justify-end pt-4">
                    <Button type="submit">Submit Market Request</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        <div className="mt-12 bg-accent/20 p-6 rounded-lg border border-accent/30">
          <div className="flex items-start gap-4">
            <div className="bg-accent/20 p-3 rounded-full">
              <Lightbulb className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What Makes a Good Market?</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Clear yes/no outcome that can be objectively verified</li>
                <li>Specific details about resolution criteria and timeline</li>
                <li>Interesting to a broad audience or a specific community</li>
                <li>Based on public information that will be available at resolution time</li>
                <li>Avoids ambiguous wording that could lead to confusion</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestMarket;

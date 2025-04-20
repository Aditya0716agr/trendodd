
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Coins, Gift, ArrowLeft } from "lucide-react";

interface Voucher {
  id: string;
  brand_name: string;
  description: string;
  image_url: string | null;
  coin_cost: number;
  available_quantity: number;
}

const Redeem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchVouchers();
  }, [user, navigate]);

  const fetchVouchers = async () => {
    try {
      setIsLoading(true);
      console.log("📡 Fetching vouchers...");
  
      const { data, error } = await supabase
        .from("vouchers")
        .select("*")
        .gt("available_quantity", 0)
        .order("coin_cost", { ascending: true });
        if (error) {
          console.error("Error fetching vouchers:", error);
        } else {
          console.log("Fetched vouchers:", data);
        }
  
      console.log("✅ Supabase response data:", data);
      console.log("❌ Supabase error (if any):", error);
  
      if (error) {
        toast.error("Error fetching vouchers: " + error.message);
        return;
      }
  
      if (!data || data.length === 0) {
        toast.warning("No vouchers found with quantity > 0.");
      }
  
      setVouchers(data ?? []);
    } catch (error: any) {
      console.error("🔥 Error in fetchVouchers:", error);
      toast.error("Failed to load vouchers. Please refresh the page.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const createSampleVouchers = async () => {
    try {
      const sampleVouchers = [
        {
          brand_name: "Amazon",
          description: "$10 Amazon Gift Card",
          image_url: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
          coin_cost: 500,
          available_quantity: 10
        },
        {
          brand_name: "Netflix",
          description: "1 Month Netflix Standard Subscription",
          image_url: "https://www.logo.wine/a/logo/Netflix/Netflix-Logo.wine.svg",
          coin_cost: 800,
          available_quantity: 5
        },
        {
          brand_name: "Starbucks",
          description: "$5 Starbucks Gift Card",
          image_url: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/800px-Starbucks_Corporation_Logo_2011.svg.png",
          coin_cost: 300,
          available_quantity: 15
        }
      ];
      
      for (const voucher of sampleVouchers) {
        await supabase.from("vouchers").insert(voucher);
      }
      
      console.log("Sample vouchers created");
    } catch (error) {
      console.error("Error creating sample vouchers:", error);
    }
  };

  const handleRedeem = async (voucher: Voucher) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsRedeeming(true);
    setSelectedVoucher(voucher.id);
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (profile.wallet_balance < voucher.coin_cost) {
        toast.error("Insufficient coins balance");
        return;
      }

      const { error: voucherCheckError, data: voucherCheck } = await supabase
        .from("vouchers")
        .select("available_quantity")
        .eq("id", voucher.id)
        .single();
        
      if (voucherCheckError) throw voucherCheckError;
      
      if (voucherCheck.available_quantity <= 0) {
        toast.error("This voucher is no longer available");
        fetchVouchers(); // Refresh vouchers list
        return;
      }

      const { error: redemptionError } = await supabase
        .from("redemptions")
        .insert({
          user_id: user.id,
          voucher_id: voucher.id,
          coins_spent: voucher.coin_cost
        });

      if (redemptionError) throw redemptionError;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          wallet_balance: profile.wallet_balance - voucher.coin_cost 
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      const { error: voucherError } = await supabase
        .from("vouchers")
        .update({ 
          available_quantity: voucher.available_quantity - 1 
        })
        .eq("id", voucher.id);

      if (voucherError) throw voucherError;

      toast.success("Voucher redeemed successfully!");
      fetchVouchers();

      // Update user metadata
      await supabase.auth.updateUser({
        data: { wallet_balance: profile.wallet_balance - voucher.coin_cost }
      });

    } catch (error) {
      console.error("Error redeeming voucher:", error);
      toast.error("Failed to redeem voucher. Please try again.");
    } finally {
      setIsRedeeming(false);
      setSelectedVoucher(null);
    }
  };

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
console.log("🖼️ Rendering with vouchers:", vouchers);

  return (
    <Layout>
      <div className="container py-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6 hover:scale-105 transition-transform" 
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shine">
            <Gift className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Redeem Your Coins</h1>
          <p className="text-muted-foreground max-w-2xl">
            Exchange your earned coins for exciting rewards and gift cards. The more you predict correctly, the more coins you earn!
          </p>
          {user && (
            <motion.div 
              className="mt-4 px-4 py-2 bg-primary/10 rounded-lg flex items-center gap-2"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-medium">
                Your Balance: <span className="text-primary animate-pulse-light">{user.user_metadata?.wallet_balance || 1000} coins</span>
              </span>
            </motion.div>
          )}
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse voucher-card">
                <div className="h-32 bg-muted"></div>
                <CardContent className="space-y-2 pt-6">
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : vouchers.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No Vouchers Available</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're currently restocking our rewards. Please check back later for exciting new vouchers!
            </p>
            <Button 
              className="mt-6" 
              onClick={fetchVouchers}
            >
              Refresh
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {vouchers.map((voucher) => (
              <motion.div key={voucher.id} variants={item}>
                <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full flex flex-col voucher-card">
                  <CardHeader className="p-0">
                    <div className="voucher-card-image">
                      {voucher.image_url ? (
                        <motion.img
                          src={voucher.image_url}
                          alt={voucher.brand_name}
                          className="h-16 w-auto object-contain"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        />
                      ) : (
                        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                          <Gift className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="px-5 pt-5">
                      <CardTitle className="mt-4 text-xl">{voucher.brand_name}</CardTitle>
                      <CardDescription>{voucher.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow p-5 pb-0">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        {voucher.available_quantity} remaining
                      </div>
                      <div className="font-semibold text-primary">
                        {voucher.coin_cost} coins
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-5">
                    <Button 
                      className="w-full group-hover:bg-primary transition-colors btn-glow"
                      onClick={() => handleRedeem(voucher)}
                      disabled={isRedeeming || !user}
                    >
                      {isRedeeming && selectedVoucher === voucher.id ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Coins className="h-4 w-4" />
                          Redeem Now
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Redeem;

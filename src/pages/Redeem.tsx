
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchVouchers();
  }, [user, navigate]);

  const fetchVouchers = async () => {
    try {
      const { data, error } = await supabase
        .from("vouchers")
        .select("*")
        .gt("available_quantity", 0)
        .order("coin_cost", { ascending: true });

      if (error) throw error;
      setVouchers(data || []);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      toast.error("Failed to load vouchers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async (voucher: Voucher) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsRedeeming(true);
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
      toast.error("Failed to redeem voucher");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Redeem Your Coins</h1>
        <p className="text-muted-foreground mb-8">
          Exchange your earned coins for exciting rewards and gift cards
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-32 bg-muted"></CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-4 w-1/2 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((voucher) => (
              <Card key={voucher.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="relative h-32 flex items-center justify-center bg-background">
                    {voucher.image_url ? (
                      <img
                        src={voucher.image_url}
                        alt={voucher.brand_name}
                        className="h-16 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-muted rounded-full"></div>
                    )}
                  </div>
                  <CardTitle className="mt-4">{voucher.brand_name}</CardTitle>
                  <CardDescription>{voucher.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {voucher.available_quantity} remaining
                    </div>
                    <div className="font-semibold text-primary">
                      {voucher.coin_cost} coins
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={() => handleRedeem(voucher)}
                    disabled={isRedeeming}
                  >
                    {isRedeeming ? "Redeeming..." : "Redeem Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Redeem;

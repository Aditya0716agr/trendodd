
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

const LOCAL_STORAGE_FIRST_LOGIN_KEY = "trendodds_first_login_coins_granted";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);

        // Grant first-time login coins
        if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          await checkAndGrantFirstLoginCoins(newSession.user);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check for first-time login coins for existing session
      if (currentSession?.user) {
        await checkAndGrantFirstLoginCoins(currentSession.user);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Function to check and grant first login coins
  const checkAndGrantFirstLoginCoins = async (user: User) => {
    // Check if we've already granted coins for this user in this browser
    const firstLoginGranted = localStorage.getItem(
      `${LOCAL_STORAGE_FIRST_LOGIN_KEY}_${user.id}`
    );

    if (firstLoginGranted === "true") {
      return; // Already granted, don't grant again
    }

    try {
      // Check if user has a profile - if not, one will be created by the DB trigger
      // with default 1000 coins - no action needed
      
      // Get the current balance
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error checking profile balance:", error);
        return;
      }

      // Add 100 bonus coins for first login
      const newBalance = profile.wallet_balance + 100;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ wallet_balance: newBalance })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating balance:", updateError);
        return;
      }

      // Record the transaction
      await supabase
        .from("transactions")
        .insert([
          {
            user_id: user.id,
            market_id: '00000000-0000-0000-0000-000000000000', // System transaction
            type: "deposit",
            amount: 100,
            balance: newBalance
          }
        ]);

      // Mark as granted in local storage
      localStorage.setItem(`${LOCAL_STORAGE_FIRST_LOGIN_KEY}_${user.id}`, "true");

      toast({
        title: "Welcome bonus!",
        description: "You've received 100 coins for your first login.",
      });
    } catch (error) {
      console.error("Error granting first login coins:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

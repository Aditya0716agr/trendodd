
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { seedMarkets } from "@/services/market";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import MarketDetail from "./pages/MarketDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HowItWorks from "./pages/HowItWorks";
import RequestMarket from "./pages/RequestMarket";
import NotFound from "./pages/NotFound";
import Redeem from "./pages/Redeem";
import Blog from "./pages/Blog";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize app with seed markets
const AppRoutes = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Run initialization once
  useEffect(() => {
    const initializeApp = async () => {
      if (isInitialized) return;
      
      try {
        // Seed markets on first load
        await seedMarkets();
        console.log("Markets seeding completed");
      } catch (error) {
        console.error("Error during app initialization:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeApp();
  }, [isInitialized]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/markets" element={<Markets />} />
      <Route path="/market/:id" element={<MarketDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/request-market" element={<RequestMarket />} />
      <Route path="/redeem" element={<Redeem />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

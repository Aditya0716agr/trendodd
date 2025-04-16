
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PieChart } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    
    // Simulate login request
    setTimeout(() => {
      // For demo, accept any valid-looking email/password
      if (email.includes("@") && password.length >= 6) {
        // Set user token in local storage
        localStorage.setItem("userToken", "demo-token");
        
        toast.success("Login successful! Welcome back.");
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <PieChart className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold">Sign in to TrendOdds</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Or{" "}
              <Link to="/register" className="text-primary hover:underline">
                create a new account
              </Link>
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="text-center text-sm text-muted-foreground">
              For demo purposes, any email with @ and password ≥ 6 characters will work
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

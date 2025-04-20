
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X, Coins } from "lucide-react";
import NavbarBranding from "./NavbarBranding";
import { signOut } from "@/services/auth";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navItems = [
    { path: "/markets", label: "Markets" },
    { path: "/market-requests", label: "Market Requests" },
    { path: "/how-it-works", label: "How It Works" },
    { path: "/blog", label: "Blog" },
    { path: "/request-market", label: "Request Idea" },
  ];

  const authenticatedNavItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/redeem", label: "Redeem" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <NavbarBranding />
          
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`text-sm font-medium transition-colors hover:scale-105 transform duration-300 ${
                  isActive(item.path) ? "text-primary font-semibold" : "hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {user && (
              <>
                {authenticatedNavItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`text-sm font-medium transition-colors hover:scale-105 transform duration-300 ${
                      isActive(item.path) ? "text-primary font-semibold" : "hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ModeToggle />
          
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <motion.div 
                  className="flex items-center mr-2 bg-primary/10 px-3 py-1.5 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-medium mr-2 text-foreground">{user.email}</span>
                  <div className="flex items-center gap-1 text-primary">
                    <Coins className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">
                      {user.user_metadata?.wallet_balance || 1000}
                    </span>
                  </div>
                </motion.div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:scale-105 transform duration-300">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="hover:scale-105 transform duration-300">Register</Button>
                </Link>
              </>
            )}
          </div>
          
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden border-t"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`px-2 py-2 rounded-md transition-colors ${
                  isActive(item.path) ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {user && (
              <>
                {authenticatedNavItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`px-2 py-2 rounded-md transition-colors ${
                      isActive(item.path) ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
            
            <div className="border-t my-2"></div>
            
            {user ? (
              <>
                <div className="px-2 py-2">
                  <div className="font-medium">{user.email}</div>
                  <div className="flex items-center gap-1 mt-1 text-primary">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {user.user_metadata?.wallet_balance || 1000} coins
                    </span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;

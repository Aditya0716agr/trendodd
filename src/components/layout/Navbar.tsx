
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X, Coins, ChevronDown } from "lucide-react";
import NavbarBranding from "./NavbarBranding";
import { signOut } from "@/services/auth";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
                className={`nav-link ${isActive(item.path) ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:scale-105 transform duration-300">
                    More
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/request-market"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium">Request Idea</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Submit your market ideas
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      {user && (
                        <>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/dashboard"
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">Dashboard</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  View your account dashboard
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/redeem"
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium">Redeem</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  Redeem your earned points
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        </>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
            
            <Link 
              to="/request-market"
              className="px-2 py-2 rounded-md transition-colors hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Request Idea
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/dashboard"
                  className={`px-2 py-2 rounded-md transition-colors ${
                    isActive("/dashboard") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/redeem"
                  className={`px-2 py-2 rounded-md transition-colors ${
                    isActive("/redeem") ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Redeem
                </Link>
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

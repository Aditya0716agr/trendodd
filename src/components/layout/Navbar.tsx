
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X, Coins } from "lucide-react";
import NavbarBranding from "./NavbarBranding";
import { signOut } from "@/services/auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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

  const formatBalance = (balance: number) => {
    return Math.floor(balance).toLocaleString();
  };

  return (
    <header className="navbar-sticky">
      <div className="container flex h-16 items-center justify-between container-padding">
        <div className="flex items-center gap-8">
          <NavbarBranding />
          
          <nav className="hidden md:flex items-center gap-1">
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
                  <NavigationMenuTrigger className="nav-link">
                    More
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-3 p-6 bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-lg">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/request-market"
                            className="block select-none space-y-2 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent/50 hover:text-accent-foreground group"
                          >
                            <div className="text-sm font-semibold group-hover:text-primary transition-colors">Request Idea</div>
                            <p className="text-sm leading-snug text-muted-foreground">
                              Submit your market ideas to the community
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
                                className="block select-none space-y-2 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent/50 hover:text-accent-foreground group"
                              >
                                <div className="text-sm font-semibold group-hover:text-primary transition-colors">Dashboard</div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  View your trading dashboard
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/redeem"
                                className="block select-none space-y-2 rounded-xl p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent/50 hover:text-accent-foreground group"
                              >
                                <div className="text-sm font-semibold group-hover:text-primary transition-colors">Redeem</div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  Redeem your earned rewards
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
          
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center mr-4 bg-primary/5 px-4 py-2.5 rounded-xl border border-primary/20 backdrop-blur-sm">
                  <span className="text-sm font-semibold mr-4 text-foreground">{user.email}</span>
                  <div className="flex items-center gap-2 text-primary">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-bold">
                      {formatBalance(user.user_metadata?.wallet_balance || 1000)}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-xl font-medium">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-xl font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="professional-button">Get Started</Button>
                </Link>
              </>
            )}
          </div>
          
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu with enhanced styling */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-md">
          <div className="container container-padding py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? "nav-link-active" : ""} text-base`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <Link 
              to="/request-market"
              className="nav-link text-base"
              onClick={() => setIsMenuOpen(false)}
            >
              Request Idea
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/dashboard"
                  className={`nav-link ${isActive("/dashboard") ? "nav-link-active" : ""} text-base`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/redeem"
                  className={`nav-link ${isActive("/redeem") ? "nav-link-active" : ""} text-base`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Redeem
                </Link>
              </>
            )}
            
            <div className="border-t border-border/50 my-4"></div>
            
            {user ? (
              <>
                <div className="px-4 py-3 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="font-semibold text-base mb-2">{user.email}</div>
                  <div className="flex items-center gap-2 text-primary">
                    <Coins className="h-5 w-5" />
                    <span className="text-base font-bold">
                      {formatBalance(user.user_metadata?.wallet_balance || 1000)} coins
                    </span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="justify-start rounded-xl text-base">
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl text-base">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full professional-button text-base">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;


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

  return (
    <header className="border-b bg-background sticky top-0 z-50 backdrop-blur-sm">
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
                    <ul className="grid w-[240px] gap-2 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/request-market"
                            className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            <div className="text-sm font-semibold">Request Idea</div>
                            <p className="text-sm leading-snug text-muted-foreground">
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
                                className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-semibold">Dashboard</div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  View your account dashboard
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                          <li>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/redeem"
                                className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-semibold">Redeem</div>
                                <p className="text-sm leading-snug text-muted-foreground">
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
          
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center mr-3 bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                  <span className="text-sm font-medium mr-3 text-foreground">{user.email}</span>
                  <div className="flex items-center gap-1 text-primary">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      {user.user_metadata?.wallet_balance || 1000}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-xl">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="professional-button">Register</Button>
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
        <div className="md:hidden border-t bg-background">
          <div className="container container-padding py-4 flex flex-col gap-3">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`nav-link ${isActive(item.path) ? "nav-link-active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <Link 
              to="/request-market"
              className="nav-link"
              onClick={() => setIsMenuOpen(false)}
            >
              Request Idea
            </Link>
            
            {user && (
              <>
                <Link 
                  to="/dashboard"
                  className={`nav-link ${isActive("/dashboard") ? "nav-link-active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/redeem"
                  className={`nav-link ${isActive("/redeem") ? "nav-link-active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Redeem
                </Link>
              </>
            )}
            
            <div className="border-t my-3"></div>
            
            {user ? (
              <>
                <div className="px-3 py-2">
                  <div className="font-semibold text-sm">{user.email}</div>
                  <div className="flex items-center gap-1 mt-1 text-primary">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-semibold">
                      {user.user_metadata?.wallet_balance || 1000} coins
                    </span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="justify-start rounded-xl">
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full professional-button">Register</Button>
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

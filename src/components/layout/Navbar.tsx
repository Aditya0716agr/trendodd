
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  PieChart, 
  Search, 
  User,
  Menu, 
  X 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/services/auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <PieChart className="h-6 w-6" />
            <span>TrendOdds</span>
          </Link>
          
          {!isMobile && (
            <nav className="flex gap-4">
              <Link to="/markets" className="text-foreground/70 hover:text-foreground transition-colors">
                Markets
              </Link>
              <Link to="/how-it-works" className="text-foreground/70 hover:text-foreground transition-colors">
                How It Works
              </Link>
            </nav>
          )}
        </div>
        
        {isMobile ? (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/markets">
              <Button variant="outline" size="sm" className="gap-1">
                <Search className="h-4 w-4" />
                Explore Markets
              </Button>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button size="sm" className="gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="gap-1">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="container pb-4 animate-fade-in">
          <nav className="flex flex-col gap-2">
            <Link to="/markets" className="p-2 hover:bg-muted rounded-md" onClick={toggleMenu}>
              Markets
            </Link>
            <Link to="/how-it-works" className="p-2 hover:bg-muted rounded-md" onClick={toggleMenu}>
              How It Works
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="p-2 hover:bg-muted rounded-md" onClick={toggleMenu}>
                  Dashboard
                </Link>
                <button className="p-2 text-left hover:bg-muted rounded-md" onClick={() => { handleSignOut(); toggleMenu(); }}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="p-2 hover:bg-muted rounded-md" onClick={toggleMenu}>
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

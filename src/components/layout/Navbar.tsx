import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X } from "lucide-react";
import Logo from "@/components/home/Logo";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/markets" className="text-sm font-medium hover:text-primary transition-colors">
              Markets
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
            {user && (
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <ModeToggle />
          
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center mr-2">
                  <div className="text-sm font-medium">{user.email}</div>
                  <div className="ml-2 px-2 py-1 bg-primary/10 rounded-md text-xs font-medium">
                    {user.balance.toLocaleString()} coins
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
          
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col gap-4">
            <Link 
              to="/markets" 
              className="px-2 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Markets
            </Link>
            <Link 
              to="/how-it-works" 
              className="px-2 py-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="px-2 py-2 hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <div className="border-t my-2"></div>
            
            {user ? (
              <>
                <div className="px-2 py-2">
                  <div className="font-medium">{user.email}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Balance: {user.balance.toLocaleString()} coins
                  </div>
                </div>
                <Button variant="ghost" onClick={() => { logout(); setIsMenuOpen(false); }}>
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
        </div>
      )}
    </header>
  );
};

export default Navbar;

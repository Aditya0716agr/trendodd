
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background py-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">TrendOdds</h3>
            <p className="text-muted-foreground mb-4">
              A virtual prediction market platform where you can place bets on future events using virtual currency.
            </p>
          </div>
          
          <div>
            <h4 className="text-base font-medium mb-3">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/markets" className="text-muted-foreground hover:text-foreground transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-base font-medium mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} TrendOdds. All rights reserved. This is a virtual platform with no real money involved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

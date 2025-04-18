import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "@/services/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins } from "lucide-react";
import { useEffect } from "react";
import { getUserWalletBalance } from "@/services/trading";

const NavItems = ({ pathname }: { pathname: string }) => (
  <div className="mx-auto w-full max-w-screen-xl space-x-4 py-4 md:block">
    <Button variant="ghost" size="sm" asChild>
      <a href="/" className={pathname === "/" ? "font-bold" : ""}>
        Home
      </a>
    </Button>
    <Button variant="ghost" size="sm" asChild>
      <a href="/markets" className={pathname === "/markets" ? "font-bold" : ""}>
        Markets
      </a>
    </Button>
    <Button variant="ghost" size="sm" asChild>
      <a href="/how-it-works" className={pathname === "/how-it-works" ? "font-bold" : ""}>
        How it works
      </a>
    </Button>
    <Button variant="ghost" size="sm" asChild>
      <a href="/request-market" className={pathname === "/request-market" ? "font-bold" : ""}>
        Request Market
      </a>
    </Button>
  </div>
);

const Navbar = () => {
  const { user, session, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      setIsLoadingBalance(true);
      try {
        const balance = await getUserWalletBalance();
        setWalletBalance(balance);
      } catch (error) {
        console.error("Failed to fetch wallet balance:", error);
        toast({
          title: "Error",
          description: "Failed to fetch wallet balance.",
          variant: "destructive",
        });
        setWalletBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    if (user) {
      fetchWalletBalance();
    } else {
      setWalletBalance(null);
      setIsLoadingBalance(false);
    }
  }, [user, toast]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/login");
      toast({
        description: "You have been successfully signed out.",
      });
    }
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split(' ')
      .map((s) => s[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:w-64">
            <SheetHeader className="text-left">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Explore the TrendOdds platform.
              </SheetDescription>
            </SheetHeader>
            <NavItems pathname={pathname} />
            <div className="mt-6">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Signed in as
                  </p>
                  <p className="text-sm font-semibold">{user.email}</p>
                  <div className="flex items-center space-x-2 py-2">
                    <Coins className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {isLoadingBalance ? (
                        <Skeleton className="h-4 w-16 inline-block" />
                      ) : (
                        `${walletBalance?.toFixed(2) || 0} coins`
                      )}
                    </span>
                  </div>
                  <Button variant="destructive" size="sm" onClick={handleSignOut}>
                    Sign out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/login">Log In</a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href="/register">Sign Up</a>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <NavItems pathname={pathname} />

        {loading ? (
          <Skeleton className="h-10 w-[200px]" />
        ) : user ? (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 mr-2">
              <Coins className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isLoadingBalance ? (
                  <Skeleton className="h-4 w-16 inline-block" />
                ) : (
                  `${walletBalance?.toFixed(2) || 0}`
                )}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user.email || "User"} />
                    <AvatarFallback>{getInitials(user.email || "User")}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled={isLoadingBalance}>
                  <Coins className="mr-2 h-4 w-4" />
                  Wallet: {isLoadingBalance ? <Skeleton className="inline-block h-4 w-16" /> : walletBalance?.toFixed(2)}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/dashboard">Dashboard</a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" size="sm" asChild>
              <a href="/login">Log In</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/register">Sign Up</a>
            </Button>
          </div>
        )}

        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;

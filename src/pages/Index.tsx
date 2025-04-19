
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Coins, LineChart, TrendingUp, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import AnimatedChart from "@/components/home/AnimatedChart";
import Logo from "@/components/home/Logo";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Predict the Future. <span className="text-primary">Trade</span> the Odds.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
              Join TrendOdds, where you can trade virtual contracts on real-world events and test your prediction skills.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
              <Link to="/markets">
                <Button size="lg" className="w-full sm:w-auto gap-2 hover:scale-105 transition duration-300">
                  Explore Markets
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto hover:scale-105 transition duration-300">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chart Animation Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-3">Live Market Simulation</h2>
            <p className="text-muted-foreground">Watch how prediction markets move in real-time</p>
          </div>
          <div className="bg-card border rounded-xl p-6 shadow-sm animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium">Demo Market</span>
                <h3 className="text-xl font-semibold mt-2">Will Bitcoin exceed $100,000 by the end of 2025?</h3>
              </div>
              <div className="text-right hidden md:block">
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="font-medium">254.3K</div>
              </div>
            </div>
            <AnimatedChart className="mt-6" />
            <div className="flex justify-center mt-6">
              <Link to="/markets">
                <Button className="gap-2">
                  Trade Real Markets
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">How TrendOdds Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              TrendOdds is a prediction market platform where you can trade virtual contracts on future events.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Virtual Currency</h3>
              <p className="text-muted-foreground">
                Each new user gets virtual currency to place bets without real-world financial risk.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in" style={{animationDelay: "0.1s"}}>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Buy Yes or No</h3>
              <p className="text-muted-foreground">
                For each market, you can buy shares in either "Yes" or "No" outcomes based on your predictions.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm text-center transform hover:scale-105 transition-transform duration-300 animate-fade-in" style={{animationDelay: "0.2s"}}>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-2">Win if Correct</h3>
              <p className="text-muted-foreground">
                If your prediction is correct, each share pays out 1 virtual coin. If wrong, shares become worthless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Markets Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex justify-between items-end mb-8 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Markets</h2>
              <p className="text-muted-foreground">Check out some of our most popular prediction markets</p>
            </div>
            <Link to="/markets">
              <Button variant="outline" className="hidden sm:flex gap-2 hover:bg-primary/5 transition-colors">
                View All Markets
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="market-card animate-fade-in" style={{animationDelay: "0.1s"}}>
              <div className="flex justify-between mb-4">
                <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium">Crypto</span>
                <div className="text-sm text-muted-foreground">Closes in 60 days</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Will Bitcoin exceed $100,000 by the end of the year?</h3>
              <div className="flex justify-between mt-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Prices</div>
                  <div className="flex gap-4">
                    <div>
                      <span className="price-yes">Yes: 65¢</span>
                    </div>
                    <div>
                      <span className="price-no">No: 35¢</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Volume</div>
                  <div className="font-medium">250K</div>
                </div>
              </div>
            </div>
            
            <div className="market-card animate-fade-in" style={{animationDelay: "0.2s"}}>
              <div className="flex justify-between mb-4">
                <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary font-medium">Economy</span>
                <div className="text-sm text-muted-foreground">Closes in 15 days</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Will the Federal Reserve cut interest rates in the next meeting?</h3>
              <div className="flex justify-between mt-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Prices</div>
                  <div className="flex gap-4">
                    <div>
                      <span className="price-yes">Yes: 72¢</span>
                    </div>
                    <div>
                      <span className="price-no">No: 28¢</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Volume</div>
                  <div className="font-medium">180K</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center sm:hidden mt-6 animate-fade-in">
            <Link to="/markets">
              <Button variant="outline" className="w-full">View All Markets</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-5xl text-center animate-fade-in">
          <h2 className="text-3xl font-bold mb-6">Ready to start predicting?</h2>
          <p className="mb-8 max-w-xl mx-auto">
            Sign up today and receive 10,000 virtual coins to start trading on prediction markets.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* TrendOdds vs Kalshi Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">How We're Different</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Unlike Kalshi which uses real money, TrendOdds offers a risk-free way to experience prediction markets
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-2">1</span>
                Virtual Currency
              </h3>
              <p className="text-muted-foreground mb-4">
                TrendOdds uses virtual currency, eliminating any financial risk while still providing the thrill of prediction markets.
                Kalshi requires real money deposits and involves actual financial risk.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-2">2</span>
                Educational Focus
              </h3>
              <p className="text-muted-foreground mb-4">
                TrendOdds is designed to help users learn about prediction markets without the pressure of losing real money.
                It's perfect for beginners and those who want to practice their forecasting skills.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-2">3</span>
                Accessibility
              </h3>
              <p className="text-muted-foreground mb-4">
                Available worldwide without regulatory constraints, TrendOdds is accessible to anyone interested in prediction markets.
                Kalshi is limited to US residents due to regulatory requirements.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white mr-2">4</span>
                Community Focus
              </h3>
              <p className="text-muted-foreground mb-4">
                TrendOdds emphasizes social interaction with leaderboards and community discussions,
                making prediction markets a more social and enjoyable experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Gift, LineChart, Star, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import AnimatedChart from "@/components/home/AnimatedChart";
import Logo from "@/components/home/Logo";

const Index = () => {
  const brandPartners = [
    { name: "Amazon", color: "#ff9900", discount: "10% off" },
    { name: "Netflix", color: "#e50914", discount: "1 month free" },
    { name: "Spotify", color: "#1db954", discount: "3 months premium" },
    { name: "Apple", color: "#555555", discount: "Gift cards" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="section-spacing bg-gradient-to-b from-primary/5 to-background">
        <div className="container container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <Logo size="lg" />
            </div>
            
            <h1 className="heading-1 mb-6">
              Predict the Future. <span className="text-primary">Trade</span> the Odds.
            </h1>
            
            <p className="body-large mb-8 max-w-2xl mx-auto">
              Join TrendOdds, where you can trade virtual contracts on real-world events and test your prediction skills.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/markets">
                <Button className="professional-button">
                  Explore Markets
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="rounded-xl font-semibold px-6 py-3">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="section-spacing bg-card/50">
        <div className="container container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Live Market Simulation</h2>
            <p className="body-large">Watch how prediction markets move in real-time</p>
          </div>
          <div className="market-card max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="status-badge status-badge-pending">Demo Market</span>
                <h3 className="heading-3 mt-3">Will Bitcoin exceed $100,000 by the end of 2025?</h3>
              </div>
              <div className="text-right hide-mobile">
                <div className="text-sm text-muted-foreground mb-1">Volume</div>
                <div className="font-semibold">254.3K</div>
              </div>
            </div>
            <AnimatedChart className="mt-6" />
            <div className="flex justify-center mt-8">
              <Link to="/markets">
                <Button className="professional-button">
                  Trade Real Markets
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">How TrendOdds Works</h2>
            <p className="body-large max-w-2xl mx-auto">
              TrendOdds is a prediction market platform where you can trade virtual contracts on future events.
            </p>
          </div>

          <div className="content-grid">
            <div className="market-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="heading-3 mb-3">Virtual Currency</h3>
              <p className="body-base">
                Each new user gets virtual currency to place bets without real-world financial risk.
              </p>
            </div>

            <div className="market-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="heading-3 mb-3">Buy Yes or No</h3>
              <p className="body-base">
                For each market, you can buy shares in either "Yes" or "No" outcomes based on your predictions.
              </p>
            </div>

            <div className="market-card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="heading-3 mb-3">Win if Correct</h3>
              <p className="body-base">
                If your prediction is correct, each share pays out 1 virtual coin. If wrong, shares become worthless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="section-spacing">
        <div className="container container-padding">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Premium Rewards Program</h2>
            <p className="body-large max-w-2xl mx-auto">
              Turn your prediction skills into real-world rewards with our exclusive premium brand partners.
            </p>
          </div>

          {/* Brand Partners */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {brandPartners.map((brand, index) => (
              <div key={index} className="market-card text-center">
                <div 
                  className="w-12 h-12 rounded-2xl mb-4 flex items-center justify-center mx-auto"
                  style={{ backgroundColor: `${brand.color}20` }}
                >
                  <Gift className="h-6 w-6" style={{ color: brand.color }} />
                </div>
                <h3 className="font-semibold mb-2">{brand.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Redeem for exclusive {brand.name} rewards
                </p>
                <div className="bg-primary/10 text-primary text-xs font-semibold rounded-full px-3 py-1 inline-block">
                  {brand.discount}
                </div>
              </div>
            ))}
          </div>

          <div className="content-grid">
            <div className="market-card">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Gift className="h-12 w-12 text-white" />
              </div>
              <h3 className="heading-3 mb-3">Premium Subscriptions</h3>
              <p className="body-base mb-4">
                Redeem your coins for subscriptions to popular streaming and media services.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">From 5,000 coins</span>
                <div className="flex">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            </div>

            <div className="market-card">
              <div className="h-32 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Award className="h-12 w-12 text-white" />
              </div>
              <h3 className="heading-3 mb-3">Gift Cards</h3>
              <p className="body-base mb-4">
                Exchange your coins for gift cards from popular retailers and online stores.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">From 10,000 coins</span>
                <div className="flex">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            </div>

            <div className="market-card">
              <div className="h-32 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Gift className="h-12 w-12 text-white" />
              </div>
              <h3 className="heading-3 mb-3">Exclusive Merchandise</h3>
              <p className="body-base mb-4">
                Spend your coins on limited edition products and exclusive merchandise.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">From 15,000 coins</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/redeem">
              <Button className="professional-button">
                Explore Rewards
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section className="section-spacing bg-muted/30">
        <div className="container container-padding">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="heading-2 mb-2">Featured Markets</h2>
              <p className="body-large">Check out some of our most popular prediction markets</p>
            </div>
            <Link to="/markets" className="hide-mobile">
              <Button variant="outline" className="rounded-xl">
                View All Markets
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="market-card">
              <div className="flex justify-between mb-4">
                <span className="status-badge status-badge-pending">Crypto</span>
                <div className="text-sm text-muted-foreground">Closes in 60 days</div>
              </div>
              <h3 className="heading-3 mb-6">Will Bitcoin exceed $100,000 by the end of the year?</h3>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Current Prices</div>
                  <div className="flex gap-4">
                    <span className="text-green-600 font-semibold">Yes: 65¢</span>
                    <span className="text-red-600 font-semibold">No: 35¢</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-2">Volume</div>
                  <div className="font-semibold">250K</div>
                </div>
              </div>
            </div>
            
            <div className="market-card">
              <div className="flex justify-between mb-4">
                <span className="status-badge status-badge-pending">Economy</span>
                <div className="text-sm text-muted-foreground">Closes in 15 days</div>
              </div>
              <h3 className="heading-3 mb-6">Will the Federal Reserve cut interest rates in the next meeting?</h3>
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Current Prices</div>
                  <div className="flex gap-4">
                    <span className="text-green-600 font-semibold">Yes: 72¢</span>
                    <span className="text-red-600 font-semibold">No: 28¢</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-2">Volume</div>
                  <div className="font-semibold">180K</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center md:hidden">
            <Link to="/markets">
              <Button variant="outline" className="w-full rounded-xl">View All Markets</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-primary text-primary-foreground">
        <div className="container container-padding text-center">
          <h2 className="heading-2 mb-6 text-white">Ready to start predicting?</h2>
          <p className="body-large mb-8 max-w-xl mx-auto text-primary-foreground/90">
            Sign up today and receive 10,000 virtual coins to start trading on prediction markets.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 rounded-xl font-semibold px-8 py-4">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

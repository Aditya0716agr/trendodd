import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Coins, Gift, LineChart, Star, TrendingUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import AnimatedChart from "@/components/home/AnimatedChart";
import Logo from "@/components/home/Logo";
import { motion } from "framer-motion";

const Index = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const brandPartners = [
    { name: "Amazon", icon: "gift", color: "#ff9900", discount: "10% off" },
    { name: "Netflix", icon: "tv", color: "#e50914", discount: "1 month free" },
    { name: "Spotify", icon: "music", color: "#1db954", discount: "3 months premium" },
    { name: "Apple", icon: "gift", color: "#555555", discount: "Gift cards" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-28 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <motion.div variants={item} className="flex justify-center mb-6">
              <Logo size="lg" animate={true} />
            </motion.div>
            
            <motion.h1 variants={item} className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Predict the Future. <span className="text-primary">Trade</span> the Odds.
            </motion.h1>
            
            <motion.p variants={item} className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join TrendOdds, where you can trade virtual contracts on real-world events and test your prediction skills.
            </motion.p>
            
            <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/markets">
                <Button size="lg" className="w-full sm:w-auto gap-2 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg">
                  Explore Markets
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto hover:scale-105 transition-all duration-300 border-primary/50 hover:bg-primary/5">
                  Create Free Account
                </Button>
              </Link>
            </motion.div>

            {/* Premium Coin Display */}
            <motion.div 
              className="mt-12 grid grid-cols-3 sm:grid-cols-5 gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {[5000, 10000, 25000, 50000, 100000].map((value, index) => (
                <motion.div
                  key={index}
                  className={`premium-coin ${index % 2 === 0 ? 'animate-float' : ''}`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.6 + (index * 0.1)
                  }}
                >
                  <Coins className="h-6 w-6 text-yellow-800" />
                  <div className="premium-coin-shine"></div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-bold text-primary whitespace-nowrap">
                    {value.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Chart Animation Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Live Market Simulation</h2>
            <p className="text-muted-foreground">Watch how prediction markets move in real-time</p>
          </div>
          <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
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
                <Button className="gap-2 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg">
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

      {/* Premium Redeem Rewards Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-indigo-600/5">
        <div className="container mx-auto max-w-5xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Premium Rewards Program</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Turn your prediction skills into real-world rewards with our exclusive premium brand partners.
            </p>
          </motion.div>

          {/* Premium Brands Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {brandPartners.map((brand, index) => (
              <motion.div 
                key={index}
                className="premium-brand-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div 
                  className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${brand.color}20` }}
                >
                  <Gift className="h-6 w-6" style={{ color: brand.color }} />
                </div>
                <h3 className="text-lg font-bold mb-1">{brand.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Redeem for exclusive {brand.name} rewards and offers
                </p>
                <div className="bg-primary/10 text-primary text-xs font-semibold rounded-full px-3 py-1 inline-block">
                  {brand.discount}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
          >
            <motion.div 
              variants={item}
              className="premium-card bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-36 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <Gift className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Premium Subscriptions</h3>
                <p className="text-muted-foreground mb-4">
                  Redeem your coins for subscriptions to popular streaming and media services.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">From 5,000 coins</span>
                  <div className="flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="premium-card bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-36 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                <Award className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Gift Cards</h3>
                <p className="text-muted-foreground mb-4">
                  Exchange your coins for gift cards from popular retailers and online stores.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">From 10,000 coins</span>
                  <div className="flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={item}
              className="premium-card bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="h-36 bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Coins className="h-16 w-16 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Exclusive Merchandise</h3>
                <p className="text-muted-foreground mb-4">
                  Spend your coins on limited edition products and exclusive merchandise.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">From 15,000 coins</span>
                  <div className="flex">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <div className="text-center mt-10">
            <Link to="/redeem">
              <Button className="gap-2 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg">
                Explore Rewards
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
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
              <Button variant="outline" className="hidden sm:flex gap-2 hover:bg-primary/5 transition-colors hover:scale-105 transform duration-300">
                View All Markets
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300 animate-fade-in" style={{animationDelay: "0.1s"}}>
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
                      <span className="text-green-600 font-medium">Yes: 65¢</span>
                    </div>
                    <div>
                      <span className="text-red-600 font-medium">No: 35¢</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-1">Volume</div>
                  <div className="font-medium">250K</div>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition duration-300 animate-fade-in" style={{animationDelay: "0.2s"}}>
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
                      <span className="text-green-600 font-medium">Yes: 72¢</span>
                    </div>
                    <div>
                      <span className="text-red-600 font-medium">No: 28¢</span>
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
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-indigo-600 text-primary-foreground">
        <div className="container mx-auto max-w-5xl text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <motion.div 
              className="bg-white/20 p-4 rounded-full"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3
              }}
            >
              <Coins className="h-12 w-12" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold mb-6">Ready to start predicting?</h2>
          <p className="mb-8 max-w-xl mx-auto">
            Sign up today and receive 10,000 virtual coins to start trading on prediction markets.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

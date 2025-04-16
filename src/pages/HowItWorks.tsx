
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Check,
  X,
  LineChart,
  Users,
  BarChart3
} from "lucide-react";

const HowItWorks = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How TrendOdds Works</h1>
          <p className="text-xl text-muted-foreground">
            Understanding prediction markets and how to trade on TrendOdds
          </p>
        </div>

        {/* What are Prediction Markets */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">What are Prediction Markets?</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p>
              Prediction markets are platforms where you can trade contracts based on the outcome of future events. 
              They work by allowing users to buy and sell shares in potential outcomes, with prices reflecting the 
              probability that those outcomes will occur.
            </p>
            
            <p>
              For example, if a market asks "Will Bitcoin exceed $100,000 by the end of the year?" and the YES shares 
              are trading at 65¢, that suggests the market collectively believes there's a 65% chance of this happening.
            </p>
            
            <p>
              Prediction markets are powerful because they aggregate information from many people, often producing 
              more accurate forecasts than individual experts.
            </p>
          </div>
        </section>

        {/* How Trading Works */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">How Trading Works on TrendOdds</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-2">01</div>
              <h3 className="text-xl font-medium mb-2">Choose a Market</h3>
              <p className="text-muted-foreground">
                Browse our markets based on various categories like crypto, politics, stocks, or sports. Each market 
                poses a yes/no question about a future event.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-2">02</div>
              <h3 className="text-xl font-medium mb-2">Buy Shares</h3>
              <p className="text-muted-foreground">
                Decide if you think the outcome will be YES or NO, then purchase shares accordingly. Prices range from 
                1¢ to 99¢ and reflect the market's estimate of probability.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <div className="text-4xl font-bold text-primary mb-2">03</div>
              <h3 className="text-xl font-medium mb-2">Collect Winnings</h3>
              <p className="text-muted-foreground">
                When the market resolves, each share of the correct outcome pays out 1 coin. If you bought at a lower 
                price, you've made a profit.
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <h3>Trading Example</h3>
            
            <p>
              Let's say there's a market: "Will Tesla deliver more than 500,000 vehicles in Q3?"
            </p>
            
            <ul>
              <li>Current prices: YES at 58¢, NO at 42¢</li>
              <li>If you believe YES, you buy 100 YES shares for 58 coins each, totaling 5,800 coins</li>
              <li>When the market resolves, if Tesla did deliver more than 500,000 vehicles, each YES share pays out 
              1 coin (100 coins), giving you 10,000 coins - a profit of 4,200 coins</li>
              <li>If Tesla delivered fewer vehicles, your YES shares pay 0 coins, resulting in a loss of your 5,800 coin investment</li>
            </ul>
          </div>
        </section>
        
        {/* Virtual Currency */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Virtual Currency System</h2>
          </div>

          <div className="prose prose-lg max-w-none mb-8">
            <p>
              TrendOdds uses a virtual currency system rather than real money. This approach makes prediction markets 
              accessible to everyone while still providing all the educational and forecasting benefits.
            </p>
            
            <ul>
              <li>Each new user receives <strong>10,000 virtual coins</strong> to start trading</li>
              <li>Virtual coins have no real-world monetary value</li>
              <li>The focus is on building forecasting skills and competing on our leaderboards</li>
              <li>Markets resolve based on real-world events, just like real prediction markets</li>
            </ul>
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center gap-2 text-lg font-medium mb-3">
              <Users className="h-5 w-5 text-primary" />
              <h3>Why Virtual Currency?</h3>
            </div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-market-yes mt-0.5 flex-shrink-0" />
                <span>Allows users to practice prediction skills without financial risk</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-market-yes mt-0.5 flex-shrink-0" />
                <span>Creates a level playing field for all users</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-market-yes mt-0.5 flex-shrink-0" />
                <span>Focuses on the educational and forecasting aspects rather than gambling</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-market-yes mt-0.5 flex-shrink-0" />
                <span>Avoids regulatory complications associated with real-money prediction markets</span>
              </li>
            </ul>
          </div>
        </section>
        
        {/* Why Prediction Markets Work */}
        <section className="mb-16 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Why Prediction Markets Work</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <p>
              Prediction markets have a strong track record of making accurate forecasts because they:
            </p>
            
            <ul>
              <li><strong>Aggregate information</strong> from many different sources and perspectives</li>
              <li>Create <strong>financial incentives</strong> for revealing truthful beliefs about future events</li>
              <li>Allow people to put <strong>more weight</strong> behind predictions they're more confident in</li>
              <li>Continuously <strong>update in real-time</strong> as new information becomes available</li>
            </ul>
            
            <p>
              Research has shown that prediction markets often outperform other forecasting methods, including expert 
              opinions, polls, and statistical models, across many domains including politics, sports, and technology.
            </p>
          </div>
        </section>
        
        {/* CTA */}
        <div className="max-w-3xl mx-auto text-center py-10 bg-primary text-primary-foreground rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Ready to start predicting?</h2>
          <p className="text-lg mb-6">
            Join TrendOdds today and get 10,000 virtual coins to start trading.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                Create Free Account
              </Button>
            </Link>
            <Link to="/markets">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white/10">
                Explore Markets
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;

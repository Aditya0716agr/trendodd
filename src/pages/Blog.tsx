
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  slug: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Understanding Prediction Markets: A Beginner's Guide",
    excerpt: "Learn how prediction markets work and how you can start making predictions today.",
    content: "Prediction markets are platforms where users can make predictions on future events...",
    author: "Alex Johnson",
    date: "April 15, 2023",
    readTime: "5 min read",
    category: "Education",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    slug: "understanding-prediction-markets"
  },
  {
    id: "2",
    title: "The Psychology Behind Making Better Predictions",
    excerpt: "Explore the cognitive biases that affect our ability to make accurate predictions.",
    content: "When it comes to predicting future events, our minds often play tricks on us...",
    author: "Sarah Chen",
    date: "March 28, 2023",
    readTime: "8 min read",
    category: "Psychology",
    image: "https://images.unsplash.com/photo-1501621667575-af81f1f0bacc?q=80&w=2070&auto=format&fit=crop",
    slug: "psychology-behind-predictions"
  },
  {
    id: "3",
    title: "Top 5 Strategies for Successful Prediction Market Trading",
    excerpt: "Discover proven strategies that can improve your prediction accuracy and returns.",
    content: "Making successful trades in prediction markets requires a combination of research...",
    author: "Michael Torres",
    date: "April 2, 2023",
    readTime: "6 min read",
    category: "Strategies",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    slug: "top-prediction-strategies"
  },
  {
    id: "4",
    title: "The History and Evolution of Prediction Markets",
    excerpt: "From ancient betting markets to modern digital platforms - the fascinating evolution of prediction markets.",
    content: "Prediction markets have a rich history dating back centuries...",
    author: "Emily Rodriguez",
    date: "March 15, 2023",
    readTime: "10 min read",
    category: "History",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop",
    slug: "history-of-prediction-markets"
  },
  {
    id: "5",
    title: "How Virtual Currency Trading Helps Build Real-World Skills",
    excerpt: "Learn how trading with virtual currency can develop valuable financial and analytical skills.",
    content: "Trading with virtual currency might seem like just a game, but it actually helps develop...",
    author: "David Kim",
    date: "April 10, 2023",
    readTime: "7 min read",
    category: "Education",
    image: "https://images.unsplash.com/photo-1642060603505-e716140d45d2?q=80&w=1974&auto=format&fit=crop",
    slug: "virtual-currency-trading-skills"
  }
];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Filter posts based on search term and selected category
    const filtered = BLOG_POSTS.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);
  
  const categories = Array.from(new Set(BLOG_POSTS.map(post => post.category)));

  // Variants for staggered animations
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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <Layout>
      <Helmet>
        <title>TrendOdds Blog - Insights on Prediction Markets and Trading</title>
        <meta name="description" content="Explore articles about prediction markets, trading strategies, and market analysis. Learn how to make better predictions and trade effectively." />
        <meta name="keywords" content="prediction markets, trading, virtual currency, market analysis, forecast, TrendOdds" />
        <meta property="og:title" content="TrendOdds Blog - Prediction Market Insights" />
        <meta property="og:description" content="Expert articles and guides on prediction markets and trading strategies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://trendodds.com/blog" />
        <meta property="og:image" content="https://trendodds.com/og-image.jpg" />
        <link rel="canonical" href="https://trendodds.com/blog" />
      </Helmet>

      <div className="container py-8">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 tracking-tight">TrendOdds Blog</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Insights, strategies, and analysis to help you make better predictions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={() => setSearchTerm("")} variant="outline">
              Clear
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            <Badge 
              variant={!selectedCategory ? "default" : "outline"} 
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories.map(category => (
              <Badge 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"} 
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </motion.div>

        {filteredPosts.length === 0 ? (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We couldn't find any articles matching your search criteria. Try adjusting your search or browse our categories.
            </p>
            <Button 
              className="mt-6" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
              }}
            >
              View all articles
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={item}>
                <Card className="h-full flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg h-48">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge>{post.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pt-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <CardTitle className="mb-2 hover:text-primary transition-colors">{post.title}</CardTitle>
                    </Link>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-sm">
                        By <span className="font-medium">{post.author}</span>
                      </div>
                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="hover:text-primary">
                          Read more
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest articles, strategies, and market insights delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;


import { Link } from "react-router-dom";
import { Clock, BarChart3, TrendingUp } from "lucide-react";
import { Market } from "@/types/market";

interface MarketCardProps {
  market: Market;
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'crypto': return '₿';
    case 'politics': return '🏛️';
    case 'stocks': return '📈';
    case 'sports': return '⚽';
    case 'technology': return '💻';
    case 'entertainment': return '🎬';
    case 'economy': return '💰';
    default: return '📊';
  }
};

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'crypto': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50';
    case 'politics': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/50';
    case 'stocks': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/50';
    case 'sports': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800/50';
    case 'technology': return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800/50';
    case 'entertainment': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/50';
    case 'economy': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50';
    default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700/50';
  }
};

const formatTimeRemaining = (dateString: string) => {
  const closeDate = new Date(dateString);
  const now = new Date();
  const diffTime = closeDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 1) return `${diffDays} Days Left`;
  if (diffDays === 1) return "1 Day Left";
  return "< 1 Day Left";
};

const formatVolume = (volume: number) => {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toFixed(0);
};

const MarketCard = ({ market }: MarketCardProps) => {
  const yesPercentage = Math.round(market.yesPrice * 100);
  const noPercentage = Math.round(market.noPrice * 100);
  const isYesLeading = yesPercentage > noPercentage;

  return (
    <Link to={`/market/${market.id}`} className="block hover:no-underline group">
      <div className="market-card group-hover:border-primary/30">
        {/* Header with category and trending indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">{getCategoryIcon(market.category)}</span>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getCategoryColor(market.category)}`}>
              {market.category.charAt(0).toUpperCase() + market.category.slice(1)}
            </span>
            {market.volume > 10000 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <TrendingUp className="h-3 w-3" />
                Hot
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{formatTimeRemaining(market.closeDate)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors duration-300">
            {market.question}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            Market closes {new Date(market.closeDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        {/* Prediction Results - Enhanced Design */}
        <div className="flex items-end justify-between">
          <div className="flex-1 max-w-sm">
            <div className="prediction-bar">
              <div className={`prediction-yes p-4 text-center flex-1 ${isYesLeading ? 'ring-2 ring-green-500/20' : ''}`}>
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Yes</div>
                <div className={`text-2xl font-bold ${isYesLeading ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}`}>
                  {yesPercentage}%
                </div>
              </div>
              <div className={`prediction-no p-4 text-center flex-1 ${!isYesLeading ? 'ring-2 ring-red-500/20' : ''}`}>
                <div className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">No</div>
                <div className={`text-2xl font-bold ${!isYesLeading ? 'text-red-700 dark:text-red-300' : 'text-muted-foreground'}`}>
                  {noPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Volume and Stats */}
          <div className="text-right ml-6">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium uppercase tracking-wide">Volume</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatVolume(market.volume)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total Trades
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;

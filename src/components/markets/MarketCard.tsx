
import { Link } from "react-router-dom";
import { Clock, BarChart3 } from "lucide-react";
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
    case 'crypto': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800';
    case 'politics': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    case 'stocks': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800';
    case 'sports': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800';
    case 'technology': return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800';
    case 'entertainment': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
    case 'economy': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
    default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
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
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20 group-hover:-translate-y-1">
        {/* Header with category and time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">{getCategoryIcon(market.category)}</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(market.category)}`}>
              {market.category.charAt(0).toUpperCase() + market.category.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{formatTimeRemaining(market.closeDate)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-primary mt-1">📌</span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Question:</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground leading-tight">
            "{market.question}"
          </h3>
        </div>

        {/* Prediction results and volume */}
        <div className="flex items-end justify-between">
          {/* Yes/No predictions */}
          <div className="flex-1 max-w-sm">
            <div className="grid grid-cols-2 border border-border rounded-lg overflow-hidden">
              <div className={`p-3 text-center ${isYesLeading ? 'bg-green-50 dark:bg-green-950' : 'bg-muted'}`}>
                <div className="text-sm font-medium text-muted-foreground mb-1">Yes</div>
                <div className={`text-lg font-bold ${isYesLeading ? 'text-green-700 dark:text-green-300' : 'text-muted-foreground'}`}>
                  {yesPercentage}%
                </div>
              </div>
              <div className={`p-3 text-center border-l border-border ${!isYesLeading ? 'bg-red-50 dark:bg-red-950' : 'bg-muted'}`}>
                <div className="text-sm font-medium text-muted-foreground mb-1">No</div>
                <div className={`text-lg font-bold ${!isYesLeading ? 'text-red-700 dark:text-red-300' : 'text-muted-foreground'}`}>
                  {noPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Volume */}
          <div className="text-right ml-6">
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
              <BarChart3 className="h-4 w-4" />
              <span className="font-medium">Volume:</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {formatVolume(market.volume)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MarketCard;

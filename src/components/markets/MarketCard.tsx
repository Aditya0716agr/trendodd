
import { Link } from "react-router-dom";
import { Clock, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
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
    case 'crypto': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'politics': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'stocks': return 'bg-green-50 text-green-700 border-green-200';
    case 'sports': return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'technology': return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'entertainment': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'economy': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-primary/20 group-hover:-translate-y-1">
        {/* Header with category and time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">{getCategoryIcon(market.category)}</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(market.category)}`}>
              {market.category.charAt(0).toUpperCase() + market.category.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{formatTimeRemaining(market.closeDate)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-primary mt-1">📌</span>
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Question:</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            "{market.question}"
          </h3>
        </div>

        {/* Prediction results and volume */}
        <div className="flex items-end justify-between">
          {/* Yes/No predictions */}
          <div className="flex-1 max-w-sm">
            <div className="grid grid-cols-2 border border-gray-200 rounded-lg overflow-hidden">
              <div className={`p-3 text-center ${isYesLeading ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className="text-sm font-medium text-gray-600 mb-1">Yes</div>
                <div className={`text-lg font-bold ${isYesLeading ? 'text-green-700' : 'text-gray-700'}`}>
                  {yesPercentage}%
                </div>
              </div>
              <div className={`p-3 text-center border-l border-gray-200 ${!isYesLeading ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className="text-sm font-medium text-gray-600 mb-1">No</div>
                <div className={`text-lg font-bold ${!isYesLeading ? 'text-red-700' : 'text-gray-700'}`}>
                  {noPercentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Volume */}
          <div className="text-right ml-6">
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
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

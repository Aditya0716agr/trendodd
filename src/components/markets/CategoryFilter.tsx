
import { MarketCategory } from "@/types/market";

interface CategoryFilterProps {
  activeCategory: MarketCategory | "all";
  onCategoryChange: (category: MarketCategory | "all") => void;
}

const marketCategories = [
  { id: "all", name: "All Markets", icon: "📊" },
  { id: "crypto", name: "Crypto", icon: "₿" },
  { id: "politics", name: "Politics", icon: "🏛️" },
  { id: "stocks", name: "Stocks", icon: "📈" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "entertainment", name: "Entertainment", icon: "🎬" },
  { id: "economy", name: "Economy", icon: "💰" },
];

const getCategoryColor = (categoryId: string, isActive: boolean) => {
  if (isActive) {
    return "bg-primary text-white border-primary shadow-sm";
  }
  
  switch (categoryId) {
    case 'crypto': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
    case 'politics': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
    case 'stocks': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
    case 'sports': return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
    case 'technology': return 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100';
    case 'entertainment': return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
    case 'economy': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
    default: return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
  }
};

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {marketCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id as MarketCategory | "all")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 whitespace-nowrap ${getCategoryColor(category.id, activeCategory === category.id)}`}
        >
          <span>{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

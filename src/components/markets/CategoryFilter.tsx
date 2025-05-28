
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

const CategoryFilter = ({ activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {marketCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id as MarketCategory | "all")}
          className={`category-pill ${
            activeCategory === category.id 
              ? "category-pill-active" 
              : "category-pill-inactive"
          } whitespace-nowrap`}
        >
          <span className="text-base">{category.icon}</span>
          <span className="font-semibold">{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

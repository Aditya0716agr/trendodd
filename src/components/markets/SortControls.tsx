
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingUp, Clock } from "lucide-react";

interface SortControlsProps {
  sortField: "volume" | "closeDate";
  sortDirection: "asc" | "desc";
  onSortChange: (field: "volume" | "closeDate") => void;
}

const SortControls = ({ sortField, sortDirection, onSortChange }: SortControlsProps) => {
  const getSortIcon = (field: "volume" | "closeDate") => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "desc" ? <ArrowUpDown className="h-4 w-4 rotate-180" /> : <ArrowUpDown className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Sort by:</span>
      <Button
        variant={sortField === "volume" ? "default" : "outline"}
        size="sm"
        className="gap-2 rounded-xl"
        onClick={() => onSortChange("volume")}
      >
        <TrendingUp className="h-4 w-4" />
        Volume
        {getSortIcon("volume")}
      </Button>
      <Button
        variant={sortField === "closeDate" ? "default" : "outline"}
        size="sm"
        className="gap-2 rounded-xl"
        onClick={() => onSortChange("closeDate")}
      >
        <Clock className="h-4 w-4" />
        Closing Date
        {getSortIcon("closeDate")}
      </Button>
    </div>
  );
};

export default SortControls;

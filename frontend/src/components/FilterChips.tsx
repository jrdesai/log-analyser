import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface Filter {
  type: 'level' | 'service' | 'environment';
  value: string;
  label: string;
}

interface FilterChipsProps {
  filters: Filter[];
  onRemoveFilter: (filter: Filter) => void;
  onClearAll: () => void;
}

export default function FilterChips({ filters, onRemoveFilter, onClearAll }: FilterChipsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {filters.map((filter, index) => (
        <Badge
          key={`${filter.type}-${filter.value}-${index}`}
          variant="secondary"
          className="flex items-center gap-1 px-2 py-1"
        >
          <span className="text-xs font-medium">{filter.type}:</span>
          <span>{filter.label}</span>
          <button
            onClick={() => onRemoveFilter(filter)}
            className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 text-xs"
      >
        Clear all
      </Button>
    </div>
  );
}


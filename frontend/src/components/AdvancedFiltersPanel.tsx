import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Pin, PinOff, Eye, EyeOff, Filter as FilterIcon, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { LogEntry } from '@/types/logs';
import { AdvancedFilter, FieldMetadata } from '@/types/filters';
import { cn } from '@/lib/utils';

interface AdvancedFiltersPanelProps {
  filters: AdvancedFilter[];
  onFiltersChange: (filters: AdvancedFilter[]) => void;
  logs: LogEntry[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

// Discover fields from log data
const discoverFields = (logs: LogEntry[]): FieldMetadata[] => {
  if (logs.length === 0) return [];

  const fields: Map<string, FieldMetadata> = new Map();
  
  // Standard fields
  const standardFields: FieldMetadata[] = [
    { name: 'level', type: 'string' },
    { name: 'service', type: 'string' },
    { name: 'message', type: 'string' },
    { name: 'details', type: 'string' },
    { name: 'timestamp', type: 'date' },
    { name: 'id', type: 'number' },
  ];

  standardFields.forEach(field => fields.set(field.name, field));

  // Analyze log data to get unique values and counts
  const levelCounts = new Map<string, number>();
  const serviceCounts = new Map<string, number>();
  const sampleMessages: string[] = [];

  logs.forEach(log => {
    // Count levels
    levelCounts.set(log.level, (levelCounts.get(log.level) || 0) + 1);
    
    // Count services
    serviceCounts.set(log.service, (serviceCounts.get(log.service) || 0) + 1);
    
    // Sample messages
    if (sampleMessages.length < 5 && log.message) {
      sampleMessages.push(log.message.substring(0, 50));
    }
  });

  // Update field metadata with discovered data
  if (fields.has('level')) {
    fields.set('level', {
      name: 'level',
      type: 'string',
      count: levelCounts.size,
      sampleValues: Array.from(levelCounts.keys()),
    });
  }

  if (fields.has('service')) {
    fields.set('service', {
      name: 'service',
      type: 'string',
      count: serviceCounts.size,
      sampleValues: Array.from(serviceCounts.keys()),
    });
  }

  if (fields.has('message')) {
    fields.set('message', {
      name: 'message',
      type: 'string',
      sampleValues: sampleMessages,
    });
  }

  return Array.from(fields.values());
};

const getOperatorLabel = (operator: string): string => {
  const labels: Record<string, string> = {
    equals: 'equals',
    contains: 'contains',
    startsWith: 'starts with',
    endsWith: 'ends with',
    regex: 'matches regex',
    exists: 'exists',
    notExists: 'does not exist',
    range: 'is between',
    greaterThan: 'is greater than',
    lessThan: 'is less than',
  };
  return labels[operator] || operator;
};

const getFilterDisplayText = (filter: AdvancedFilter): string => {
  const fieldLabel = filter.label || filter.field;
  const operatorLabel = getOperatorLabel(filter.operator);
  const negate = filter.negate ? 'NOT ' : '';
  
  if (filter.operator === 'exists' || filter.operator === 'notExists') {
    return `${negate}${fieldLabel} ${operatorLabel}`;
  }
  
  if (filter.operator === 'range' && Array.isArray(filter.value)) {
    return `${fieldLabel} ${operatorLabel} ${filter.value[0]} and ${filter.value[1]}`;
  }
  
  return `${negate}${fieldLabel} ${operatorLabel} ${filter.value}`;
};

export default function AdvancedFiltersPanel({
  filters,
  onFiltersChange,
  logs,
  isCollapsed,
  onToggleCollapse,
}: AdvancedFiltersPanelProps) {
  const [newFilterField, setNewFilterField] = useState<string>('');
  const [newFilterOperator, setNewFilterOperator] = useState<string>('equals');
  const [newFilterValue, setNewFilterValue] = useState<string>('');
  const [showAddFilter, setShowAddFilter] = useState(false);

  const availableFields = useMemo(() => discoverFields(logs), [logs]);
  const enabledFilters = filters.filter(f => f.enabled);
  const pinnedFilters = filters.filter(f => f.pinned);

  const getOperatorsForField = (fieldName: string): string[] => {
    const field = availableFields.find(f => f.name === fieldName);
    if (!field) return ['equals', 'contains'];

    switch (field.type) {
      case 'number':
        return ['equals', 'greaterThan', 'lessThan', 'range', 'exists', 'notExists'];
      case 'date':
        return ['equals', 'greaterThan', 'lessThan', 'range', 'exists', 'notExists'];
      case 'string':
        return ['equals', 'contains', 'startsWith', 'endsWith', 'regex', 'exists', 'notExists'];
      default:
        return ['equals', 'contains', 'exists', 'notExists'];
    }
  };

  const handleAddFilter = () => {
    if (!newFilterField) return;

    const field = availableFields.find(f => f.name === newFilterField);
    const newFilter: AdvancedFilter = {
      id: `filter-${Date.now()}`,
      field: newFilterField,
      operator: newFilterOperator as any,
      value: newFilterValue || undefined,
      label: field?.name || newFilterField,
      enabled: true,
      pinned: false,
      negate: false,
    };

    onFiltersChange([...filters, newFilter]);
    setNewFilterField('');
    setNewFilterOperator('equals');
    setNewFilterValue('');
    setShowAddFilter(false);
  };

  const handleRemoveFilter = (filterId: string) => {
    onFiltersChange(filters.filter(f => f.id !== filterId));
  };

  const handleToggleFilter = (filterId: string) => {
    onFiltersChange(
      filters.map(f =>
        f.id === filterId ? { ...f, enabled: !f.enabled } : f
      )
    );
  };

  const handleTogglePin = (filterId: string) => {
    onFiltersChange(
      filters.map(f =>
        f.id === filterId ? { ...f, pinned: !f.pinned } : f
      )
    );
  };

  const handleClearAll = () => {
    onFiltersChange([]);
  };

  const sortedFilters = [...filters].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return 0;
  });

  if (isCollapsed) {
    return (
      <div 
        className="fixed right-0 bottom-0 w-12 bg-card border-l border-border flex flex-col items-center py-4 z-30"
        style={{
          top: '112px', // Header (64px) + Tabs (48px)
          backgroundColor: 'hsl(var(--card))',
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <FilterIcon className="w-4 h-4" />
        </Button>
        {filters.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {enabledFilters.length}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div 
      className="fixed right-0 bottom-0 w-80 border-l border-border shadow-lg z-30 flex flex-col"
      style={{
        top: '112px', // Header (64px) + Tabs (48px)
        backgroundColor: 'hsl(var(--card))',
      }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b border-border flex items-center justify-between"
        style={{ backgroundColor: 'hsl(var(--card))' }}
      >
        <div className="flex items-center gap-2">
          <FilterIcon className="w-5 h-5" />
          <h3 className="font-semibold">Filters</h3>
          {filters.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {enabledFilters.length} active
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
      </div>

      {/* Filters List */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{ backgroundColor: 'hsl(var(--card))' }}
      >
        {sortedFilters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <FilterIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No filters applied</p>
            <p className="text-xs mt-1">Add filters to narrow down your results</p>
          </div>
        ) : (
          sortedFilters.map(filter => (
            <div
              key={filter.id}
              className={cn(
                "p-3 rounded-lg border border-border bg-background",
                !filter.enabled && "opacity-50"
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {filter.pinned && <Pin className="w-3 h-3 text-muted-foreground" />}
                    <span className="text-xs font-medium text-muted-foreground truncate">
                      {getFilterDisplayText(filter)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleTogglePin(filter.id)}
                    title={filter.pinned ? "Unpin filter" : "Pin filter"}
                  >
                    {filter.pinned ? (
                      <Pin className="w-3 h-3" />
                    ) : (
                      <PinOff className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleToggleFilter(filter.id)}
                    title={filter.enabled ? "Disable filter" : "Enable filter"}
                  >
                    {filter.enabled ? (
                      <Eye className="w-3 h-3" />
                    ) : (
                      <EyeOff className="w-3 h-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleRemoveFilter(filter.id)}
                    title="Remove filter"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Filter Section */}
      <div 
        className="border-t border-border p-4 space-y-3"
        style={{ backgroundColor: 'hsl(var(--card))' }}
      >
        {showAddFilter ? (
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Field</Label>
              <Select value={newFilterField} onValueChange={setNewFilterField}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map(field => (
                    <SelectItem key={field.name} value={field.name}>
                      <div className="flex items-center justify-between w-full">
                        <span>{field.name}</span>
                        {field.count !== undefined && (
                          <span className="text-muted-foreground ml-2 text-xs">
                            ({field.count})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newFilterField && (
              <div>
                <Label className="text-xs">Operator</Label>
                <Select value={newFilterOperator} onValueChange={setNewFilterOperator}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperatorsForField(newFilterField).map(op => (
                      <SelectItem key={op} value={op}>
                        {getOperatorLabel(op)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newFilterField && newFilterOperator && 
             newFilterOperator !== 'exists' && 
             newFilterOperator !== 'notExists' && (
              <div>
                <Label className="text-xs">Value</Label>
                <Input
                  value={newFilterValue}
                  onChange={(e) => setNewFilterValue(e.target.value)}
                  placeholder="Enter value"
                  className="h-8 text-sm"
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleAddFilter}
                disabled={!newFilterField || (!newFilterValue && newFilterOperator !== 'exists' && newFilterOperator !== 'notExists')}
                className="flex-1"
              >
                Add Filter
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowAddFilter(false);
                  setNewFilterField('');
                  setNewFilterOperator('equals');
                  setNewFilterValue('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddFilter(true)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Filter
            </Button>
            {filters.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleClearAll}
                className="w-full text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}


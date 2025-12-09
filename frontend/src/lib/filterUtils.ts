import { LogEntry } from '@/types/logs';
import { AdvancedFilter } from '@/types/filters';

// Apply advanced filters to log entries
export const applyAdvancedFilters = (logs: LogEntry[], filters: AdvancedFilter[]): LogEntry[] => {
  const enabledFilters = filters.filter(f => f.enabled);
  
  if (enabledFilters.length === 0) {
    return logs;
  }

  return logs.filter(log => {
    return enabledFilters.every(filter => {
      const value = getFieldValue(log, filter.field);
      const matches = evaluateFilter(value, filter);
      return filter.negate ? !matches : matches;
    });
  });
};

// Get field value from log entry
const getFieldValue = (log: LogEntry, field: string): any => {
  switch (field) {
    case 'id':
      return log.id;
    case 'timestamp':
      return log.timestamp;
    case 'level':
      return log.level;
    case 'service':
      return log.service;
    case 'message':
      return log.message;
    case 'details':
      return log.details;
    default:
      // For custom fields, try to access as property
      return (log as any)[field];
  }
};

// Evaluate a single filter against a value
const evaluateFilter = (value: any, filter: AdvancedFilter): boolean => {
  const filterValue = filter.value;
  const stringValue = String(value || '').toLowerCase();
  const filterStringValue = filterValue ? String(filterValue).toLowerCase() : '';

  switch (filter.operator) {
    case 'equals':
      return stringValue === filterStringValue;
    
    case 'contains':
      return stringValue.includes(filterStringValue);
    
    case 'startsWith':
      return stringValue.startsWith(filterStringValue);
    
    case 'endsWith':
      return stringValue.endsWith(filterStringValue);
    
    case 'regex':
      try {
        const regex = new RegExp(String(filterValue), 'i');
        return regex.test(stringValue);
      } catch {
        return false;
      }
    
    case 'exists':
      return value !== undefined && value !== null && value !== '';
    
    case 'notExists':
      return value === undefined || value === null || value === '';
    
    case 'greaterThan':
      const numValue = Number(value);
      const numFilter = Number(filterValue);
      return !isNaN(numValue) && !isNaN(numFilter) && numValue > numFilter;
    
    case 'lessThan':
      const numValue2 = Number(value);
      const numFilter2 = Number(filterValue);
      return !isNaN(numValue2) && !isNaN(numFilter2) && numValue2 < numFilter2;
    
    case 'range':
      if (Array.isArray(filterValue) && filterValue.length === 2) {
        const numValue3 = Number(value);
        const min = Number(filterValue[0]);
        const max = Number(filterValue[1]);
        return !isNaN(numValue3) && !isNaN(min) && !isNaN(max) && 
               numValue3 >= min && numValue3 <= max;
      }
      return false;
    
    default:
      return false;
  }
};

// Convert legacy filters to advanced filters
export const convertLegacyFiltersToAdvanced = (
  legacyFilters: Array<{ type: string; value: string; label: string }>
): AdvancedFilter[] => {
  return legacyFilters.map((filter, index) => ({
    id: `legacy-${filter.type}-${filter.value}-${index}`,
    field: filter.type === 'environment' ? 'service' : filter.type,
    operator: 'equals' as const,
    value: filter.value,
    label: filter.label,
    enabled: true,
    pinned: false,
    negate: false,
  }));
};

// Convert advanced filters to legacy format (for backward compatibility)
export const convertAdvancedFiltersToLegacy = (
  advancedFilters: AdvancedFilter[]
): Array<{ type: string; value: string; label: string }> => {
  return advancedFilters
    .filter(f => f.enabled && (f.field === 'level' || f.field === 'service') && f.operator === 'equals')
    .map(f => ({
      type: f.field,
      value: String(f.value || ''),
      label: f.label || f.field,
    }));
};


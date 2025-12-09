// Enhanced filter types for advanced filtering
export type FilterOperator = 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'exists' | 'notExists' | 'range' | 'greaterThan' | 'lessThan';

export type FilterField = 'level' | 'service' | 'message' | 'details' | 'timestamp' | 'id' | string; // string allows custom fields

export interface AdvancedFilter {
  id: string;
  field: FilterField;
  operator: FilterOperator;
  value?: string | number | [number, number]; // For range filters
  label?: string; // Human-readable label
  enabled: boolean;
  pinned: boolean;
  negate?: boolean; // NOT operator
}

// Legacy filter type for backward compatibility
export interface Filter {
  type: 'level' | 'service' | 'environment';
  value: string;
  label: string;
}

// Field metadata for dynamic discovery
export interface FieldMetadata {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  count?: number; // Number of unique values
  sampleValues?: string[]; // Sample values for suggestions
}


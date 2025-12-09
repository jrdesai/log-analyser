import { LogEntry } from '@/types/logs';
import { Filter } from './FilterChips';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import LiveStreamingControls from './LiveStreamingControls';
import LogsDataTable from './LogsDataTable';
import EmptyState from './EmptyState';

interface LiveLogsTabProps {
  query: string;
  loading: boolean;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  filters: Filter[];
  onRemoveFilter: (filter: Filter) => void;
  onClearAllFilters: () => void;
  isLive: boolean;
  isPaused: boolean;
  logsPerSecond: number;
  autoScroll: boolean;
  connectionStatus: 'connected' | 'disconnected';
  onToggleLive: () => void;
  onTogglePause: () => void;
  onToggleAutoScroll: (enabled: boolean) => void;
  logs: LogEntry[];
  selectedLog: LogEntry | null;
  onLogSelect: (log: LogEntry | null) => void;
  onComparisonMode: () => void;
  comparisonMode: boolean;
}

export default function LiveLogsTab({
  query,
  loading,
  onQueryChange,
  onSearch,
  filters,
  onRemoveFilter,
  onClearAllFilters,
  isLive,
  isPaused,
  logsPerSecond,
  autoScroll,
  connectionStatus,
  onToggleLive,
  onTogglePause,
  onToggleAutoScroll,
  logs,
  selectedLog,
  onLogSelect,
  onComparisonMode,
  comparisonMode,
}: LiveLogsTabProps) {
  return (
    <div className="space-y-4 h-full flex flex-col min-h-0">
      {/* Live Streaming Controls */}
      <LiveStreamingControls
        isLive={isLive}
        isPaused={isPaused}
        logsPerSecond={logsPerSecond}
        autoScroll={autoScroll}
        connectionStatus={connectionStatus}
        onToggleLive={onToggleLive}
        onTogglePause={onTogglePause}
        onToggleAutoScroll={onToggleAutoScroll}
      />

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar 
          query={query}
          loading={loading}
          onQueryChange={onQueryChange}
          onSearch={onSearch}
        />
        
        <FilterChips
          filters={filters}
          onRemoveFilter={onRemoveFilter}
          onClearAll={onClearAllFilters}
        />
      </div>

      {/* Log Table - Takes up most of the screen */}
      <div className="flex-1 min-h-0">
        {logs.length > 0 ? (
          <LogsDataTable 
            logs={logs}
            selectedLog={selectedLog}
            onLogSelect={onLogSelect}
            onComparisonMode={onComparisonMode}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}


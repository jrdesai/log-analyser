import { useEffect, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { LogEntry } from '@/types/logs';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (section: string) => void;
  recentSearches: string[];
  logs: LogEntry[];
  onLogSelect: (log: LogEntry) => void;
}

export default function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
  recentSearches,
  logs,
  onLogSelect,
}: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const navigationItems = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: '📊' },
    { id: 'live-logs', label: 'View Live Logs', icon: '📝' },
    { id: 'analytics', label: 'Open Analytics', icon: '📈' },
    { id: 'alerts', label: 'Check Alerts', icon: '🔔' },
    { id: 'insights', label: 'View Insights', icon: '💡' },
    { id: 'reports', label: 'Generate Reports', icon: '📄' },
    { id: 'settings', label: 'Open Settings', icon: '⚙️' },
  ];

  const filteredLogs = logs.filter(
    log =>
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.level.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {searchQuery && filteredLogs.length > 0 && (
          <>
            <CommandGroup heading="Logs">
              {filteredLogs.map((log) => (
                <CommandItem
                  key={log.id}
                  onSelect={() => {
                    onLogSelect(log);
                    onOpenChange(false);
                  }}
                >
                  <span className="mr-2">{log.level === 'ERROR' ? '🔴' : log.level === 'WARNING' ? '🟡' : '🔵'}</span>
                  <span className="truncate">{log.message}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => {
                onNavigate(item.id);
                onOpenChange(false);
              }}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>

        {recentSearches.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Recent Searches">
              {recentSearches.slice(0, 5).map((search, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    setSearchQuery(search);
                  }}
                >
                  <span className="mr-2">🔍</span>
                  {search}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}


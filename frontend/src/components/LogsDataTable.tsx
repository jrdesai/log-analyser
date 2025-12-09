import { useState, useMemo } from 'react';
import { ArrowUpDown, MoreHorizontal, Eye, Download, Trash2, GitCompare } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogEntry } from '@/types/logs';
import { getLevelIcon, getLevelVariant, getLevelBadgeClassName } from '@/lib/logUtils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LogsDataTableProps {
  logs: LogEntry[];
  selectedLog: LogEntry | null;
  onLogSelect: (log: LogEntry | null) => void;
  onComparisonMode?: () => void;
}

type SortField = 'timestamp' | 'level' | 'service' | 'message';
type SortDirection = 'asc' | 'desc';

export default function LogsDataTable({ logs, selectedLog, onLogSelect, onComparisonMode }: LogsDataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [visibleColumns] = useState<Set<string>>(
    new Set(['timestamp', 'level', 'service', 'message'])
  );

  const sortedLogs = useMemo(() => {
    if (!sortField) return logs;

    return [...logs].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'timestamp':
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'level':
          aValue = a.level;
          bValue = b.level;
          break;
        case 'service':
          aValue = a.service;
          bValue = b.service;
          break;
        case 'message':
          aValue = a.message;
          bValue = b.message;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [logs, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleRowSelection = (logId: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(logId)) {
      newSelection.delete(logId);
    } else {
      newSelection.add(logId);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === sortedLogs.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(sortedLogs.map(log => log.id)));
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-4 h-full flex flex-col">
      {onComparisonMode && (
        <div className="flex justify-end flex-shrink-0">
          <Button variant="outline" onClick={onComparisonMode}>
            <GitCompare className="w-4 h-4 mr-2" />
            Compare Logs
          </Button>
        </div>
      )}
      <div className="rounded-md border flex-1 min-h-0 overflow-auto">
        <Table>
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.size === sortedLogs.length && sortedLogs.length > 0}
                onCheckedChange={toggleAllSelection}
              />
            </TableHead>
            {visibleColumns.has('timestamp') && (
              <TableHead>
                <SortButton field="timestamp">Timestamp</SortButton>
              </TableHead>
            )}
            {visibleColumns.has('level') && (
              <TableHead>
                <SortButton field="level">Level</SortButton>
              </TableHead>
            )}
            {visibleColumns.has('service') && (
              <TableHead>
                <SortButton field="service">Service</SortButton>
              </TableHead>
            )}
            {visibleColumns.has('message') && (
              <TableHead>
                <SortButton field="message">Message</SortButton>
              </TableHead>
            )}
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLogs.map((log, index) => (
            <TableRow
              key={log.id}
              data-state={selectedLog?.id === log.id ? 'selected' : undefined}
              className={cn(
                index % 2 === 0 ? 'bg-background' : 'bg-muted/30',
                selectedLog?.id === log.id && 'bg-accent'
              )}
            >
              <TableCell>
                <Checkbox
                  checked={selectedRows.has(log.id)}
                  onCheckedChange={() => toggleRowSelection(log.id)}
                />
              </TableCell>
              {visibleColumns.has('timestamp') && (
                <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
              )}
              {visibleColumns.has('level') && (
                <TableCell>
                  <Badge
                    variant={getLevelVariant(log.level)}
                    className={getLevelBadgeClassName(log.level)}
                  >
                    {getLevelIcon(log.level)}
                    <span className="ml-1">{log.level}</span>
                  </Badge>
                </TableCell>
              )}
              {visibleColumns.has('service') && (
                <TableCell>
                  <Badge variant="outline">{log.service}</Badge>
                </TableCell>
              )}
              {visibleColumns.has('message') && (
                <TableCell
                  className="max-w-md cursor-pointer"
                  onClick={() => onLogSelect(selectedLog?.id === log.id ? null : log)}
                >
                  <div className="truncate">{log.message}</div>
                  {selectedLog?.id === log.id && (
                    <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                      {log.details}
                    </div>
                  )}
                </TableCell>
              )}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="!bg-card border-border shadow-lg backdrop-blur-none" 
                    align="end"
                    style={{ backgroundColor: 'hsl(var(--card))' }}
                  >
                    <DropdownMenuItem onClick={() => onLogSelect(selectedLog?.id === log.id ? null : log)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {selectedLog?.id === log.id ? 'Hide' : 'View'} Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}


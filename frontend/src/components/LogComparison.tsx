import { useState } from 'react';
import { LogEntry } from '@/types/logs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getLevelBadgeClassName } from '@/lib/logUtils';

interface LogComparisonProps {
  logs: LogEntry[];
  onClose: () => void;
}

export default function LogComparison({ logs, onClose }: LogComparisonProps) {
  const [selectedLogs, setSelectedLogs] = useState<Set<number>>(new Set());
  const [compareMode, setCompareMode] = useState(false);

  const toggleLogSelection = (logId: number) => {
    setSelectedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        if (newSet.size < 2) {
          newSet.add(logId);
        }
      }
      return newSet;
    });
  };

  const selectedLogsArray = Array.from(selectedLogs).map(id => 
    logs.find(log => log.id === id)
  ).filter(Boolean) as LogEntry[];

  const getDifferences = (log1: LogEntry, log2: LogEntry) => {
    const differences: string[] = [];
    if (log1.level !== log2.level) differences.push('level');
    if (log1.service !== log2.service) differences.push('service');
    if (log1.message !== log2.message) differences.push('message');
    if (log1.timestamp !== log2.timestamp) differences.push('timestamp');
    if (log1.details !== log2.details) differences.push('details');
    return differences;
  };

  if (compareMode && selectedLogsArray.length === 2) {
    const [log1, log2] = selectedLogsArray;
    const differences = getDifferences(log1, log2);

    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Log Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of selected logs</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Log 1 */}
            <div className="space-y-4">
              <div className="font-semibold text-sm text-muted-foreground">Log 1</div>
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Timestamp</div>
                  <div className={cn(
                    "text-sm font-mono",
                    differences.includes('timestamp') && "bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded"
                  )}>
                    {log1.timestamp}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Level</div>
                  <Badge className={cn(
                    getLevelBadgeClassName(log1.level),
                    differences.includes('level') && "ring-2 ring-yellow-500"
                  )}>
                    {log1.level}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Service</div>
                  <div className={cn(
                    "text-sm",
                    differences.includes('service') && "bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded"
                  )}>
                    {log1.service}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Message</div>
                  <div className={cn(
                    "text-sm",
                    differences.includes('message') && "bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded"
                  )}>
                    {log1.message}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Details</div>
                  <div className={cn(
                    "text-xs font-mono p-2 bg-muted rounded",
                    differences.includes('details') && "bg-yellow-100 dark:bg-yellow-900/30"
                  )}>
                    {log1.details}
                  </div>
                </div>
              </div>
            </div>

            {/* Log 2 */}
            <div className="space-y-4">
              <div className="font-semibold text-sm text-muted-foreground">Log 2</div>
              <div className="space-y-3 p-4 border rounded-lg bg-card">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Timestamp</div>
                  <div className={cn(
                    "text-sm font-mono",
                    differences.includes('timestamp') && "bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded"
                  )}>
                    {log2.timestamp}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Level</div>
                  <Badge className={cn(
                    getLevelBadgeClassName(log2.level),
                    differences.includes('level') && "ring-2 ring-yellow-500"
                  )}>
                    {log2.level}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Service</div>
                  <div className={cn(
                    "text-sm",
                    differences.includes('service') && "bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded"
                  )}>
                    {log2.service}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Message</div>
                  <div className={cn(
                    "text-sm",
                    differences.includes('message') && "bg-yellow-100 dark:bg-yellow-900/30 p-1 rounded"
                  )}>
                    {log2.message}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Details</div>
                  <div className={cn(
                    "text-xs font-mono p-2 bg-muted rounded",
                    differences.includes('details') && "bg-yellow-100 dark:bg-yellow-900/30"
                  )}>
                    {log2.details}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted rounded-lg">
            <div className="text-sm font-semibold mb-2">Differences Found:</div>
            <div className="flex flex-wrap gap-2">
              {differences.length > 0 ? (
                differences.map(diff => (
                  <Badge key={diff} variant="secondary">
                    {diff}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No differences found</span>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" onClick={() => setCompareMode(false)}>
              Back to Selection
            </Button>
            <Button onClick={onClose}>
              Close Comparison
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Log Comparison</CardTitle>
            <CardDescription>
              Select up to 2 logs to compare side-by-side
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedLogs.size} of 2 logs selected
            </div>
            <Button
              onClick={() => setCompareMode(true)}
              disabled={selectedLogs.size !== 2}
            >
              <GitCompare className="w-4 h-4 mr-2" />
              Compare Selected
            </Button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className={cn(
                  "flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                  selectedLogs.has(log.id) ? "bg-accent border-primary" : "bg-card hover:bg-muted/50"
                )}
                onClick={() => toggleLogSelection(log.id)}
              >
                <Checkbox
                  checked={selectedLogs.has(log.id)}
                  onCheckedChange={() => toggleLogSelection(log.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getLevelBadgeClassName(log.level)}>
                      {log.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      {log.timestamp}
                    </span>
                  </div>
                  <div className="text-sm font-medium truncate">{log.message}</div>
                  <div className="text-xs text-muted-foreground">{log.service}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


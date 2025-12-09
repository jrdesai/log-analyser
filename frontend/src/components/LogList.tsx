import { Clock, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogEntry } from '@/types/logs';
import { getLevelIcon, getLevelVariant, getLevelBadgeClassName } from '@/lib/logUtils';

interface LogListProps {
  logs: LogEntry[];
  selectedLog: LogEntry | null;
  onLogSelect: (log: LogEntry | null) => void;
}

export default function LogList({ logs, selectedLog, onLogSelect }: LogListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Entries</CardTitle>
        <CardDescription>Recent log entries matching your query</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => onLogSelect(selectedLog?.id === log.id ? null : log)}
              className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getLevelIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <Badge 
                      variant={getLevelVariant(log.level)}
                      className={getLevelBadgeClassName(log.level)}
                    >
                      {log.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {log.timestamp}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {log.service}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mb-1">{log.message}</p>
                  {selectedLog?.id === log.id && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-xs font-mono">{log.details}</p>
                    </div>
                  )}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    selectedLog?.id === log.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


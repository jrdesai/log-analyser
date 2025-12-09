import { LogEntry } from '@/types/logs';
import { Filter } from './FilterChips';
import WelcomeMessage from './WelcomeMessage';
import LiveStreamingControls from './LiveStreamingControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { getLevelBadgeClassName } from '@/lib/logUtils';
import { cn } from '@/lib/utils';

interface DashboardTabProps {
  firstName: string;
  isLive: boolean;
  isPaused: boolean;
  logsPerSecond: number;
  autoScroll: boolean;
  connectionStatus: 'connected' | 'disconnected';
  onToggleLive: () => void;
  onTogglePause: () => void;
  onToggleAutoScroll: (enabled: boolean) => void;
  onSwitchToLiveLogs: () => void;
  logs: LogEntry[];
}

export default function DashboardTab({
  firstName,
  isLive,
  isPaused,
  logsPerSecond,
  autoScroll,
  connectionStatus,
  onToggleLive,
  onTogglePause,
  onToggleAutoScroll,
  onSwitchToLiveLogs,
  logs,
}: DashboardTabProps) {
  // Get recent critical logs (ERROR and WARNING only, last 10)
  const criticalLogs = logs
    .filter(log => log.level === 'ERROR' || log.level === 'WARNING')
    .slice(0, 10);

  // Get 3 key metrics
  const totalLogs = logs.length;
  const errorCount = logs.filter(log => log.level === 'ERROR').length;
  const warningCount = logs.filter(log => log.level === 'WARNING').length;
  const errorRate = totalLogs > 0 ? ((errorCount / totalLogs) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      <WelcomeMessage firstName={firstName} />

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

      {/* 3 Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Logs</CardDescription>
            <CardTitle className="text-3xl">{totalLogs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              All log entries
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Error Rate</CardDescription>
            <CardTitle className="text-3xl text-red-600 dark:text-red-400">{errorRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {errorCount} errors detected
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Warnings</CardDescription>
            <CardTitle className="text-3xl text-yellow-600 dark:text-yellow-400">{warningCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Warning events
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Critical Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Critical Logs</CardTitle>
              <CardDescription>Last 10 ERROR and WARNING logs</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onSwitchToLiveLogs}>
              View All Logs
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {criticalLogs.length > 0 ? (
            <div className="space-y-2">
              {criticalLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Badge className={getLevelBadgeClassName(log.level)}>
                    {log.level}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{log.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {log.service} • {log.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No critical logs found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


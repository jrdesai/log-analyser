import { Play, Pause, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface LiveStreamingControlsProps {
  isLive: boolean;
  isPaused: boolean;
  logsPerSecond: number;
  autoScroll: boolean;
  connectionStatus: 'connected' | 'disconnected';
  onToggleLive: () => void;
  onTogglePause: () => void;
  onToggleAutoScroll: (enabled: boolean) => void;
}

export default function LiveStreamingControls({
  isLive,
  isPaused,
  logsPerSecond,
  autoScroll,
  connectionStatus,
  onToggleLive,
  onTogglePause,
  onToggleAutoScroll,
}: LiveStreamingControlsProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border rounded-lg mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={onToggleLive}
          >
            {isLive ? (
              <>
                <Circle className="w-4 h-4 mr-2 fill-current animate-pulse" />
                Live
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 mr-2" />
                Start Live
              </>
            )}
          </Button>
          
          {isLive && (
            <Button
              variant="outline"
              size="sm"
              onClick={onTogglePause}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              )}
            </Button>
          )}
        </div>

        {isLive && (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Logs/sec:</span>
              <Badge variant="secondary" className="font-mono">
                {logsPerSecond}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  }`}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {connectionStatus}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {isLive && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id="auto-scroll"
              checked={autoScroll}
              onCheckedChange={onToggleAutoScroll}
            />
            <Label htmlFor="auto-scroll" className="text-sm cursor-pointer">
              Auto-scroll
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}


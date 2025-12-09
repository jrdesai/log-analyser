import { useState, useEffect, useRef } from 'react';
import { Circle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MiniSidebarProps {
  connectionStatus: 'connected' | 'disconnected';
  logsPerSecond: number;
  isLive: boolean;
}

const STORAGE_KEY = 'status-button-position';

export default function MiniSidebar({
  connectionStatus,
  logsPerSecond,
  isLive,
}: MiniSidebarProps) {
  const [topPosition, setTopPosition] = useState(() => {
    // Load from localStorage or default to middle of viewport
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return parseInt(saved, 10);
      }
    }
    // Default to middle of viewport (50% - half button height)
    return typeof window !== 'undefined' ? window.innerHeight / 2 - 24 : 300;
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef<number>(0);
  const dragStartTop = useRef<number>(0);

  // Update position when window resizes to keep it in bounds
  useEffect(() => {
    const handleResize = () => {
      const maxTop = window.innerHeight - 48; // Button height is 48px (h-12)
      if (topPosition > maxTop) {
        setTopPosition(maxTop);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [topPosition]);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, topPosition.toString());
  }, [topPosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Start dragging on left mouse button
    if (e.button === 0) {
      setIsDragging(true);
      dragStartY.current = e.clientY;
      dragStartTop.current = topPosition;
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartY.current;
      const newTop = dragStartTop.current + deltaY;
      
      // Constrain to viewport bounds
      const minTop = 64; // Below header (h-16 = 64px)
      const maxTop = window.innerHeight - 48; // Button height is 48px
      const constrainedTop = Math.max(minTop, Math.min(maxTop, newTop));
      
      setTopPosition(constrainedTop);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "fixed right-4 z-40 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-shadow hidden md:flex items-center justify-center cursor-move",
            isDragging && "cursor-grabbing"
          )}
          style={{ 
            backgroundColor: 'hsl(var(--card))',
            top: `${topPosition}px`,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="relative flex items-center justify-center">
            {connectionStatus === 'connected' ? (
              <div className="relative">
                <Circle className="w-6 h-6 text-green-500" fill="currentColor" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            ) : (
              <Circle className="w-6 h-6 text-red-500" fill="currentColor" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 !bg-card border-border shadow-lg backdrop-blur-none" 
        align="end"
        side="left"
        style={{ backgroundColor: 'hsl(var(--card))' }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground uppercase">Status</h3>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                )}
              />
              <span className="text-xs font-medium capitalize">{connectionStatus}</span>
            </div>
          </div>

          {/* Connection Status */}
          <Card className="p-3">
            <CardContent className="p-0 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  )}
                />
                <span className="text-xs font-medium capitalize">{connectionStatus}</span>
              </div>
              {isLive && (
                <div className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-mono">{logsPerSecond}/s</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="p-3">
            <CardContent className="p-0 space-y-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Quick Stats</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">411</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Errors</span>
                  <Badge variant="destructive" className="text-xs px-1.5 py-0">35</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Warnings</span>
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">12</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Status Indicators */}
          <Card className="p-3">
            <CardContent className="p-0 space-y-2">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Services</div>
              <div className="space-y-1.5">
                {[
                  { name: 'API', status: 'healthy' },
                  { name: 'Auth', status: 'healthy' },
                  { name: 'DB', status: 'healthy' },
                  { name: 'Cache', status: 'healthy' },
                  { name: 'Payment', status: 'degraded' },
                  { name: 'Notify', status: 'down' },
                ].map((service) => (
                  <div key={service.name} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{service.name}</span>
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        service.status === 'healthy' ? 'bg-green-500' :
                        service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      )}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PopoverContent>
    </Popover>
  );
}

import { useState, useEffect } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import TimeSeriesChart from './charts/TimeSeriesChart';
import LevelDistributionChart from './charts/LevelDistributionChart';
import ServiceActivityChart from './charts/ServiceActivityChart';
import ErrorHeatmap from './charts/ErrorHeatmap';
import ResponseTimeHistogram from './charts/ResponseTimeHistogram';
import ComparisonChart from './charts/ComparisonChart';
import TopErrorsChart from './charts/TopErrorsChart';
import ServiceDependencyNetwork from './charts/ServiceDependencyNetwork';
import { timeSeriesData, levelDistribution, serviceData } from '@/data/sampleData';
import 'react-grid-layout/css/styles.css';

interface WidgetConfig {
  id: string;
  name: string;
  visible: boolean;
  component: React.ReactNode;
}

const STORAGE_KEY = 'dashboard-layout';

export default function DraggableDashboard() {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: 'time-series', name: 'Time Series', visible: true, component: <TimeSeriesChart data={timeSeriesData} /> },
    { id: 'level-dist', name: 'Level Distribution', visible: true, component: <LevelDistributionChart data={levelDistribution} /> },
    { id: 'service-activity', name: 'Service Activity', visible: true, component: <ServiceActivityChart data={serviceData} /> },
    { id: 'error-heatmap', name: 'Error Heatmap', visible: true, component: <ErrorHeatmap /> },
    { id: 'response-histogram', name: 'Response Time Histogram', visible: true, component: <ResponseTimeHistogram /> },
    { id: 'comparison', name: 'Today vs Yesterday', visible: true, component: <ComparisonChart /> },
    { id: 'top-errors', name: 'Top 5 Errors', visible: true, component: <TopErrorsChart /> },
    { id: 'dependency-network', name: 'Service Dependencies', visible: true, component: <ServiceDependencyNetwork /> },
  ]);

  // Calculate container width
  useEffect(() => {
    const updateWidth = () => {
      // Use a timeout to ensure DOM is ready
      setTimeout(() => {
        const container = document.querySelector('.layout')?.parentElement;
        if (container && container.clientWidth > 0) {
          setContainerWidth(container.clientWidth);
        } else {
          // Fallback to window width minus padding
          const width = typeof window !== 'undefined' ? Math.max(window.innerWidth - 300, 800) : 1200;
          setContainerWidth(width);
        }
      }, 100);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Load layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem(STORAGE_KEY);
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        setLayout(parsed);
        // Update widget visibility
        const savedWidgets = localStorage.getItem('dashboard-widgets');
        if (savedWidgets) {
          const parsedWidgets = JSON.parse(savedWidgets);
          setWidgets(prev => prev.map(w => {
            const saved = parsedWidgets.find((sw: WidgetConfig) => sw.id === w.id);
            return saved ? { ...w, visible: saved.visible } : w;
          }));
        }
      } catch (e) {
        console.error('Failed to load layout:', e);
      }
    } else {
      // Default layout
      setLayout([
        { i: 'time-series', x: 0, y: 0, w: 6, h: 3 },
        { i: 'level-dist', x: 6, y: 0, w: 6, h: 3 },
        { i: 'service-activity', x: 0, y: 3, w: 6, h: 3 },
        { i: 'error-heatmap', x: 6, y: 3, w: 6, h: 3 },
        { i: 'response-histogram', x: 0, y: 6, w: 6, h: 3 },
        { i: 'comparison', x: 6, y: 6, w: 6, h: 3 },
        { i: 'top-errors', x: 0, y: 9, w: 6, h: 3 },
        { i: 'dependency-network', x: 6, y: 9, w: 6, h: 3 },
      ]);
    }
  }, []);

  // Save layout to localStorage
  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLayout));
  };

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => {
      const updated = prev.map(w => 
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      );
      localStorage.setItem('dashboard-widgets', JSON.stringify(updated));
      return updated;
    });
  };

  const visibleWidgets = widgets.filter(w => w.visible);
  const visibleLayout = layout.filter(l => visibleWidgets.some(w => w.id === l.i));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
          </DialogTrigger>
          <DialogContent 
            className="max-w-md !bg-card border-border shadow-lg backdrop-blur-none" 
            style={{ backgroundColor: 'hsl(var(--card))' }}
          >
            <DialogHeader>
              <DialogTitle>Customize Dashboard</DialogTitle>
              <DialogDescription>
                Show or hide widgets and rearrange them by dragging
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {widgets.map((widget) => (
                <div key={widget.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={widget.id}
                      checked={widget.visible}
                      onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                    />
                    <Label htmlFor={widget.id} className="cursor-pointer">
                      {widget.name}
                    </Label>
                  </div>
                  {widget.visible ? (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              ))}
              <Separator />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    localStorage.removeItem('dashboard-widgets');
                    window.location.reload();
                  }}
                >
                  Reset Layout
                </Button>
                <Button onClick={() => setIsCustomizing(false)}>
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative w-full overflow-auto" style={{ minHeight: '400px' }}>
        <GridLayout
          className="layout"
          layout={visibleLayout}
          cols={12}
          rowHeight={120}
          width={containerWidth}
          margin={[16, 16]}
          containerPadding={[0, 0]}
          onLayoutChange={handleLayoutChange}
          isDraggable={isCustomizing}
          isResizable={isCustomizing}
          draggableHandle=".drag-handle"
          compactType={null}
          preventCollision={true}
        >
          {visibleWidgets.map((widget) => {
            const widgetLayout = layout.find(l => l.i === widget.id);
            if (!widgetLayout) return null;
            
            return (
              <div 
                key={widget.id} 
                className="bg-card rounded-lg border overflow-hidden" 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {isCustomizing && (
                  <div className="drag-handle cursor-move p-2 border-b bg-muted/50 flex items-center justify-between flex-shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">
                      {widget.name} - Drag to move
                    </span>
                  </div>
                )}
                <div 
                  className="flex-1 overflow-hidden" 
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    minHeight: 0
                  }}
                >
                  {widget.component}
                </div>
              </div>
            );
          })}
        </GridLayout>
      </div>
    </div>
  );
}


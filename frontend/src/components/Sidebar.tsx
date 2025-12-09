import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Bell, 
  Lightbulb, 
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  active?: boolean;
}

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { id: 'live-logs', label: 'Live Logs', icon: FileText, badge: 12 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: 3 },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange, onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapseChange?.(newState);
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Navigation</h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground",
                  isCollapsed && "justify-center"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}


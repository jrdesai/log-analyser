import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogSourceConfig, { LogSourceType, LogSourceConfig as LogSourceConfigType } from './LogSourceConfig';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  darkMode: boolean;
  notifications: boolean;
  autoRefresh: boolean;
  onDarkModeChange: (enabled: boolean) => void;
  onNotificationsChange: (enabled: boolean) => void;
  onAutoRefreshChange: (enabled: boolean) => void;
  // Log source configuration
  logSource?: LogSourceType;
  logSourceConfig?: LogSourceConfigType | null;
  onLogSourceChange?: (source: LogSourceType) => void;
  onLogSourceConfigChange?: (config: LogSourceConfigType) => void;
  onTestLogConnection?: () => Promise<boolean>;
}

export default function SettingsDialog({
  open,
  onOpenChange,
  darkMode,
  notifications,
  autoRefresh,
  onDarkModeChange,
  onNotificationsChange,
  onAutoRefreshChange,
  logSource = 'sample',
  logSourceConfig = null,
  onLogSourceChange,
  onLogSourceConfigChange,
  onTestLogConnection,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="!bg-card backdrop-blur-none max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: 'hsl(var(--card))' }}
      >
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your application preferences and log source configuration
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="log-source">Log Source</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-6 py-4">
            {/* Appearance Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode" className="text-base">Appearance</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={onDarkModeChange}
                />
              </div>
            </div>

            <Separator />

            {/* Notifications Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications" className="text-base">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable desktop notifications
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={onNotificationsChange}
                />
              </div>
            </div>

            <Separator />

            {/* Data Refresh Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh" className="text-base">Data Refresh</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh log data
                  </p>
                </div>
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={onAutoRefreshChange}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="log-source" className="py-4">
            {onLogSourceChange && onLogSourceConfigChange ? (
              <LogSourceConfig
                currentSource={logSource}
                config={logSourceConfig}
                onSourceChange={onLogSourceChange}
                onConfigChange={onLogSourceConfigChange}
                onTestConnection={onTestLogConnection}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Log source configuration not available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}


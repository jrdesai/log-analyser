import { useState } from 'react';
import { Database, FileText, Globe, Server, Upload, TestTube, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export type LogSourceType = 'api' | 'file' | 'websocket' | 'sse' | 'sample';

export interface LogSourceConfig {
  type: LogSourceType;
  name: string;
  enabled: boolean;
  // API source
  apiUrl?: string;
  apiKey?: string;
  // WebSocket/SSE source
  streamUrl?: string;
  // File source
  filePath?: string;
}

interface LogSourceConfigProps {
  currentSource: LogSourceType;
  config: LogSourceConfig | null;
  onSourceChange: (source: LogSourceType) => void;
  onConfigChange: (config: LogSourceConfig) => void;
  onTestConnection?: () => Promise<boolean>;
}

const sourceTypes = [
  {
    value: 'sample' as LogSourceType,
    label: 'Sample Data',
    description: 'Use built-in sample logs for testing',
    icon: TestTube,
    color: 'text-blue-500',
  },
  {
    value: 'api' as LogSourceType,
    label: 'REST API',
    description: 'Connect to a REST API endpoint',
    icon: Globe,
    color: 'text-green-500',
  },
  {
    value: 'websocket' as LogSourceType,
    label: 'WebSocket',
    description: 'Real-time streaming via WebSocket',
    icon: Server,
    color: 'text-purple-500',
  },
  {
    value: 'sse' as LogSourceType,
    label: 'Server-Sent Events',
    description: 'Real-time streaming via SSE',
    icon: Database,
    color: 'text-orange-500',
  },
  {
    value: 'file' as LogSourceType,
    label: 'File Upload',
    description: 'Upload and parse log files',
    icon: FileText,
    color: 'text-yellow-500',
  },
];

export default function LogSourceConfig({
  currentSource,
  config,
  onSourceChange,
  onConfigChange,
  onTestConnection,
}: LogSourceConfigProps) {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [localConfig, setLocalConfig] = useState<LogSourceConfig>(
    config || {
      type: currentSource,
      name: '',
      enabled: true,
    }
  );

  const handleTestConnection = async () => {
    if (!onTestConnection) return;
    
    setTestStatus('testing');
    try {
      const success = await onTestConnection();
      setTestStatus(success ? 'success' : 'error');
      setTimeout(() => setTestStatus('idle'), 3000);
    } catch (error) {
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 3000);
    }
  };

  const handleConfigUpdate = (updates: Partial<LogSourceConfig>) => {
    const updated = { ...localConfig, ...updates };
    setLocalConfig(updated);
    onConfigChange(updated);
  };

  const currentSourceType = sourceTypes.find(s => s.value === currentSource);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Log Source Configuration
        </CardTitle>
        <CardDescription>
          Configure where your logs come from
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Source Type Selection */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">Source Type</Label>
          <RadioGroup
            value={currentSource}
            onValueChange={(value) => onSourceChange(value as LogSourceType)}
            className="grid grid-cols-1 gap-4"
          >
            {sourceTypes.map((source) => {
              const Icon = source.icon;
              const isSelected = currentSource === source.value;
              
              return (
                <div key={source.value}>
                  <RadioGroupItem
                    value={source.value}
                    id={source.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={source.value}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all",
                      "hover:bg-accent hover:border-accent-foreground/20",
                      isSelected && "border-primary bg-primary/5"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", source.color)} />
                    <div className="flex-1">
                      <div className="font-medium">{source.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {source.description}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <Separator />

        {/* Source-Specific Configuration */}
        {currentSource === 'api' && (
          <div className="space-y-4">
            <Label className="text-base font-semibold">API Configuration</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="api-url">API URL</Label>
                <Input
                  id="api-url"
                  placeholder="https://api.example.com/logs"
                  value={localConfig.apiUrl || ''}
                  onChange={(e) => handleConfigUpdate({ apiUrl: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="api-key">API Key (Optional)</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter API key"
                  value={localConfig.apiKey || ''}
                  onChange={(e) => handleConfigUpdate({ apiKey: e.target.value })}
                />
              </div>
              {onTestConnection && (
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing' || !localConfig.apiUrl}
                  className="w-full"
                >
                  {testStatus === 'testing' && 'Testing...'}
                  {testStatus === 'success' && (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                      Connection Successful
                    </>
                  )}
                  {testStatus === 'error' && (
                    <>
                      <XCircle className="w-4 h-4 mr-2 text-red-500" />
                      Connection Failed
                    </>
                  )}
                  {testStatus === 'idle' && 'Test Connection'}
                </Button>
              )}
            </div>
          </div>
        )}

        {currentSource === 'websocket' && (
          <div className="space-y-4">
            <Label className="text-base font-semibold">WebSocket Configuration</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="ws-url">WebSocket URL</Label>
                <Input
                  id="ws-url"
                  placeholder="ws://localhost:3000/logs/stream"
                  value={localConfig.streamUrl || ''}
                  onChange={(e) => handleConfigUpdate({ streamUrl: e.target.value })}
                />
              </div>
              {onTestConnection && (
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing' || !localConfig.streamUrl}
                  className="w-full"
                >
                  {testStatus === 'testing' && 'Testing...'}
                  {testStatus === 'success' && (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                      Connection Successful
                    </>
                  )}
                  {testStatus === 'error' && (
                    <>
                      <XCircle className="w-4 h-4 mr-2 text-red-500" />
                      Connection Failed
                    </>
                  )}
                  {testStatus === 'idle' && 'Test Connection'}
                </Button>
              )}
            </div>
          </div>
        )}

        {currentSource === 'sse' && (
          <div className="space-y-4">
            <Label className="text-base font-semibold">SSE Configuration</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="sse-url">SSE URL</Label>
                <Input
                  id="sse-url"
                  placeholder="http://localhost:3000/logs/stream"
                  value={localConfig.streamUrl || ''}
                  onChange={(e) => handleConfigUpdate({ streamUrl: e.target.value })}
                />
              </div>
              {onTestConnection && (
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testStatus === 'testing' || !localConfig.streamUrl}
                  className="w-full"
                >
                  {testStatus === 'testing' && 'Testing...'}
                  {testStatus === 'success' && (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                      Connection Successful
                    </>
                  )}
                  {testStatus === 'error' && (
                    <>
                      <XCircle className="w-4 h-4 mr-2 text-red-500" />
                      Connection Failed
                    </>
                  )}
                  {testStatus === 'idle' && 'Test Connection'}
                </Button>
              )}
            </div>
          </div>
        )}

        {currentSource === 'file' && (
          <div className="space-y-4">
            <Label className="text-base font-semibold">File Upload</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-center w-full">
                <Label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent"
                >
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    Supports: .log, .txt, .json
                  </span>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".log,.txt,.json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleConfigUpdate({ filePath: file.name });
                      }
                    }}
                  />
                </Label>
              </div>
            </div>
          </div>
        )}

        {currentSource === 'sample' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <TestTube className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium">Sample Data Mode</div>
                <div className="text-sm text-muted-foreground">
                  Using built-in sample logs for testing and demonstration
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant={localConfig.enabled ? 'default' : 'secondary'}>
              {localConfig.enabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleConfigUpdate({ enabled: !localConfig.enabled })}
          >
            {localConfig.enabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


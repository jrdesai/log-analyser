import { useState, useEffect } from 'react';
import { Results } from '@/types/logs';
import { User, Settings as SettingsType } from '@/types/user';
import { sampleLogs } from '@/data/sampleData';
import Login from './Login';
import Header from './Header';
import Sidebar from './Sidebar';
import EmptyState from './EmptyState';
import SettingsDialog from './SettingsDialog';
import FilterChips, { Filter } from './FilterChips';
import AdvancedFiltersPanel from './AdvancedFiltersPanel';
import CommandPalette from './CommandPalette';
import SystemHealthBanner from './SystemHealthBanner';
import StatisticsCards from './StatisticsCards';
import ServiceStatusCards from './ServiceStatusCards';
import DraggableDashboard from './DraggableDashboard';
import LogComparison from './LogComparison';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardTab from './DashboardTab';
import LiveLogsTab from './LiveLogsTab';
import MiniSidebar from './MiniSidebar';
import LogSourceConfig, { LogSourceType, LogSourceConfig as LogSourceConfigType } from './LogSourceConfig';
import { AdvancedFilter } from '@/types/filters';
import { applyAdvancedFilters, convertLegacyFiltersToAdvanced, convertAdvancedFiltersToLegacy } from '@/lib/filterUtils';
import {
  loadLogSourceConfig,
  saveLogSourceConfig,
  testApiConnection,
  testWebSocketConnection,
  testSSEConnection,
  fetchLogsFromAPI,
  connectWebSocketStream,
  connectSSEStream,
  parseLogFile,
} from '@/services/logService';

const LogAnalyzer = () => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<SettingsType>({
    darkMode: false,
    notifications: true,
    autoRefresh: false,
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Navigation state
  const [activeTab, setActiveTab] = useState('live-logs');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dashboard state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<typeof sampleLogs[0] | null>(null);

  // Date range state
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    to: new Date(),
  });

  // Filter state
  const [filters, setFilters] = useState<Filter[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilter[]>([]);
  const [filtersPanelCollapsed, setFiltersPanelCollapsed] = useState(false);

  // Live streaming state
  const [isLive, setIsLive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [logsPerSecond, setLogsPerSecond] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('connected');

  // System health state
  const [healthIssues, setHealthIssues] = useState<string[]>([]);
  const [healthBannerDismissed, setHealthBannerDismissed] = useState(false);

  // Comparison mode state
  const [comparisonMode, setComparisonMode] = useState(false);

  // Log source configuration state
  const [logSource, setLogSource] = useState<LogSourceType>(() => {
    const saved = loadLogSourceConfig();
    return saved?.type || 'sample';
  });
  const [logSourceConfig, setLogSourceConfig] = useState<LogSourceConfigType | null>(() => {
    return loadLogSourceConfig();
  });

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Load logs based on configured source
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadLogs = async () => {
      if (logSource === 'sample' || !logSourceConfig?.enabled) {
        // Use sample data
        setResults({
          summary: `Monitoring ${sampleLogs.length} log entries in real-time`,
          insights: [
            'Detected 2 error events in the last hour',
            'Authentication failures increased by 15%',
            'Database connection pool reaching capacity'
          ],
          logs: sampleLogs
        });
        setHealthIssues([
          'Payment Service is experiencing degraded performance',
          'Notification Service is down'
        ]);
        return;
      }

      // Load from configured source
      if (logSource === 'api' && logSourceConfig.apiUrl) {
        try {
          const results = await fetchLogsFromAPI(
            logSourceConfig.apiUrl,
            logSourceConfig.apiKey,
            {
              from: dateRange.from,
              to: dateRange.to,
            }
          );
          setResults(results);
        } catch (error) {
          console.error('Failed to fetch logs from API:', error);
          // Fallback to sample data on error
          setResults({
            summary: `Error connecting to API. Using sample data.`,
            insights: ['API connection failed'],
            logs: sampleLogs
          });
        }
      }
    };

    loadLogs();
  }, [isLoggedIn, logSource, logSourceConfig, dateRange]);

  // Real-time streaming based on source
  useEffect(() => {
    if (!isLive || isPaused) {
      setLogsPerSecond(0);
      return;
    }

    // Use sample data or configured streaming source
    if (logSource === 'sample' || !logSourceConfig?.enabled) {
      // Simulate logs for sample data
      const interval = setInterval(() => {
        const newLogsPerSecond = Math.floor(Math.random() * 10) + 5;
        setLogsPerSecond(newLogsPerSecond);

        if (Math.random() > 0.95) {
          setConnectionStatus(prev => prev === 'connected' ? 'disconnected' : 'connected');
        }

        if (results && Math.random() > 0.7) {
          const newLog = {
            ...sampleLogs[Math.floor(Math.random() * sampleLogs.length)],
            id: Date.now(),
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          setResults(prev => prev ? {
            ...prev,
            logs: [newLog, ...prev.logs].slice(0, 500)
          } : null);
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    // Use WebSocket or SSE for real sources
    if (logSource === 'websocket' && logSourceConfig.streamUrl) {
      const disconnect = connectWebSocketStream(
        logSourceConfig.streamUrl,
        (newLog) => {
          setResults(prev => prev ? {
            ...prev,
            logs: [newLog, ...prev.logs].slice(0, 500)
          } : null);
          setLogsPerSecond(prev => prev + 1);
        },
        (error) => {
          setConnectionStatus('disconnected');
          console.error('WebSocket error:', error);
        }
      );
      setConnectionStatus('connected');
      return disconnect;
    }

    if (logSource === 'sse' && logSourceConfig.streamUrl) {
      const disconnect = connectSSEStream(
        logSourceConfig.streamUrl,
        (newLog) => {
          setResults(prev => prev ? {
            ...prev,
            logs: [newLog, ...prev.logs].slice(0, 500)
          } : null);
          setLogsPerSecond(prev => prev + 1);
        },
        (error) => {
          setConnectionStatus('disconnected');
          console.error('SSE error:', error);
        }
      );
      setConnectionStatus('connected');
      return disconnect;
    }
  }, [isLive, isPaused, results, logSource, logSourceConfig]);

  const handleLogin = async (email: string, _password: string) => {
    setLoginLoading(true);
    // Simulate login API call
    setTimeout(() => {
      // Demo mode: accept any credentials
      const sampleUser: User = {
        name: 'John Doe',
        email: email || 'john.doe@company.com',
        role: 'System Administrator',
        avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=3b82f6&textColor=ffffff'
      };
      setUser(sampleUser);
      setIsLoggedIn(true);
      setLoginLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setResults(null);
    setQuery('');
    setSelectedLog(null);
    setFilters([]);
  };

  const handleSettingsChange = (key: keyof SettingsType, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev].slice(0, 10));
    }
    
    try {
      // Use configured source or fallback to sample
      if (logSource === 'api' && logSourceConfig?.enabled && logSourceConfig.apiUrl) {
        const results = await fetchLogsFromAPI(
          logSourceConfig.apiUrl,
          logSourceConfig.apiKey,
          {
            query,
            from: dateRange.from,
            to: dateRange.to,
            level: filters.filter(f => f.type === 'level').map(f => f.value),
            service: filters.filter(f => f.type === 'service').map(f => f.value),
            environment: filters.filter(f => f.type === 'environment').map(f => f.value),
          }
        );
        setResults(results);
      } else {
        // Simulate search with sample data
        setTimeout(() => {
          setResults({
            summary: `Found ${sampleLogs.length} log entries matching your query "${query}"`,
            insights: [
              'Detected 2 error events in the last hour',
              'Authentication failures increased by 15%',
              'Database connection pool reaching capacity'
            ],
            logs: sampleLogs
          });
        }, 1200);
      }
    } catch (error) {
      console.error('Query failed:', error);
      setResults({
        summary: `Error executing query. Using sample data.`,
        insights: ['Query execution failed'],
        logs: sampleLogs
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFilter = (filterToRemove: Filter) => {
    setFilters(prev => prev.filter(f => 
      !(f.type === filterToRemove.type && f.value === filterToRemove.value)
    ));
    // Also remove from advanced filters if it exists
    setAdvancedFilters(prev => prev.filter(f => 
      !(f.field === filterToRemove.type && f.value === filterToRemove.value)
    ));
  };

  const handleClearAllFilters = () => {
    setFilters([]);
    setAdvancedFilters([]);
  };

  // Sync legacy filters with advanced filters
  useEffect(() => {
    if (filters.length > 0) {
      const converted = convertLegacyFiltersToAdvanced(filters);
      // Merge with existing advanced filters, avoiding duplicates
      setAdvancedFilters(prev => {
        const existing = prev.filter(f => 
          !converted.some(c => c.field === f.field && c.value === f.value)
        );
        return [...existing, ...converted];
      });
    }
  }, [filters]);

  // Handle advanced filters change
  const handleAdvancedFiltersChange = (newFilters: AdvancedFilter[]) => {
    setAdvancedFilters(newFilters);
    // Sync back to legacy filters for backward compatibility
    const legacyFilters = convertAdvancedFiltersToLegacy(newFilters);
    setFilters(legacyFilters);
  };

  const handleNavigate = (section: string) => {
    if (section === 'settings') {
      setSettingsOpen(true);
    } else if (section === 'dashboard') {
      setActiveTab('dashboard');
    } else if (section === 'live-logs') {
      setActiveTab('live-logs');
    } else if (section === 'analytics') {
      setActiveTab('analytics');
    }
  };

  const handleToggleLive = () => {
    setIsLive(!isLive);
    if (!isLive) {
      setIsPaused(false);
      setConnectionStatus('connected');
    }
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleLogSourceChange = (source: LogSourceType) => {
    setLogSource(source);
    const newConfig: LogSourceConfigType = {
      type: source,
      name: source,
      enabled: true,
    };
    setLogSourceConfig(newConfig);
    saveLogSourceConfig(newConfig);
  };

  const handleLogSourceConfigChange = (config: LogSourceConfigType) => {
    setLogSourceConfig(config);
    saveLogSourceConfig(config);
  };

  const handleTestLogConnection = async (): Promise<boolean> => {
    if (!logSourceConfig) return false;

    try {
      if (logSourceConfig.type === 'api' && logSourceConfig.apiUrl) {
        return await testApiConnection(logSourceConfig.apiUrl, logSourceConfig.apiKey);
      }
      if (logSourceConfig.type === 'websocket' && logSourceConfig.streamUrl) {
        return await testWebSocketConnection(logSourceConfig.streamUrl);
      }
      if (logSourceConfig.type === 'sse' && logSourceConfig.streamUrl) {
        return await testSSEConnection(logSourceConfig.streamUrl);
      }
      return false;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} loading={loginLoading} />;
  }

  const firstName = user?.name.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-background transition-colors flex">
      <Sidebar 
        activeSection={activeTab} 
        onSectionChange={handleNavigate}
        onCollapseChange={setSidebarCollapsed}
      />
      
      <div 
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ 
          marginLeft: sidebarCollapsed ? '64px' : '256px',
        }}
      >
        {/* Fixed Header */}
        <div 
          className="w-full"
          style={{
            paddingTop: '64px' // Account for fixed header height
          }}
        >
          <Header 
            user={user!}
            onLogout={handleLogout}
            onSettingsOpen={() => setSettingsOpen(true)}
            hasNotifications={settings.notifications}
            filters={filters}
            onFiltersChange={setFilters}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            sidebarCollapsed={sidebarCollapsed}
          />
        </div>

        {/* System Health Banner */}
        {!healthBannerDismissed && healthIssues.length > 0 && (
          <div className="px-6 pt-4">
            <SystemHealthBanner
              issues={healthIssues}
              onDismiss={() => setHealthBannerDismissed(true)}
            />
          </div>
        )}

        {/* Tabs Navigation */}
        <div 
          className="border-b bg-card relative"
          style={{
            backgroundColor: 'hsl(var(--card))',
            paddingRight: filtersPanelCollapsed ? '48px' : '320px',
          }}
        >
          <div className="px-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="live-logs">Live Logs</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tab Content */}
        <div 
          className="flex-1 overflow-auto bg-background transition-all duration-300"
          style={{
            marginRight: filtersPanelCollapsed ? '48px' : '320px',
          }}
        >
          <div className="container mx-auto px-6 py-6 h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="h-full mt-0">
                {results && (
                  <DashboardTab
                    firstName={firstName}
                    isLive={isLive}
                    isPaused={isPaused}
                    logsPerSecond={logsPerSecond}
                    autoScroll={autoScroll}
                    connectionStatus={connectionStatus}
                    onToggleLive={handleToggleLive}
                    onTogglePause={handleTogglePause}
                    onToggleAutoScroll={setAutoScroll}
                    onSwitchToLiveLogs={() => setActiveTab('live-logs')}
                    logs={applyAdvancedFilters(results.logs, advancedFilters)}
                  />
                )}
              </TabsContent>

              {/* Live Logs Tab */}
              <TabsContent value="live-logs" className="h-full mt-0">
                {results ? (
                  <>
                    {comparisonMode ? (
                      <LogComparison
                        logs={applyAdvancedFilters(results.logs, advancedFilters)}
                        onClose={() => setComparisonMode(false)}
                      />
                    ) : (
                      <LiveLogsTab
                        query={query}
                        loading={loading}
                        onQueryChange={setQuery}
                        onSearch={handleQuery}
                        filters={filters}
                        onRemoveFilter={handleRemoveFilter}
                        onClearAllFilters={handleClearAllFilters}
                        isLive={isLive}
                        isPaused={isPaused}
                        logsPerSecond={logsPerSecond}
                        autoScroll={autoScroll}
                        connectionStatus={connectionStatus}
                        onToggleLive={handleToggleLive}
                        onTogglePause={handleTogglePause}
                        onToggleAutoScroll={setAutoScroll}
                        logs={applyAdvancedFilters(results.logs, advancedFilters)}
                        selectedLog={selectedLog}
                        onLogSelect={setSelectedLog}
                        onComparisonMode={() => setComparisonMode(true)}
                        comparisonMode={comparisonMode}
                      />
                    )}
                  </>
                ) : (
                  <EmptyState />
                )}
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="h-full mt-0">
                {results && (
                  <div className="space-y-6">
                    <StatisticsCards />
                    <ServiceStatusCards />
                    <DraggableDashboard />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mini Sidebar - Floating Button */}
      <MiniSidebar
        connectionStatus={connectionStatus}
        logsPerSecond={logsPerSecond}
        isLive={isLive}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        darkMode={settings.darkMode}
        notifications={settings.notifications}
        autoRefresh={settings.autoRefresh}
        onDarkModeChange={(enabled) => handleSettingsChange('darkMode', enabled)}
        onNotificationsChange={(enabled) => handleSettingsChange('notifications', enabled)}
        onAutoRefreshChange={(enabled) => handleSettingsChange('autoRefresh', enabled)}
        logSource={logSource}
        logSourceConfig={logSourceConfig}
        onLogSourceChange={handleLogSourceChange}
        onLogSourceConfigChange={handleLogSourceConfigChange}
        onTestLogConnection={handleTestLogConnection}
      />

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onNavigate={handleNavigate}
        recentSearches={recentSearches}
        logs={results?.logs || []}
        onLogSelect={(log) => {
          setSelectedLog(log);
          setActiveTab('live-logs');
        }}
      />

      {/* Advanced Filters Panel */}
      {results && (
        <AdvancedFiltersPanel
          filters={advancedFilters}
          onFiltersChange={handleAdvancedFiltersChange}
          logs={results.logs}
          isCollapsed={filtersPanelCollapsed}
          onToggleCollapse={() => setFiltersPanelCollapsed(!filtersPanelCollapsed)}
        />
      )}
    </div>
  );
};

export default LogAnalyzer;

import { Activity, Filter, Download, RefreshCw, Settings, Bell, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User as UserType } from '@/types/user';
import { Filter as FilterType } from './FilterChips';
import DateRangePicker from './DateRangePicker';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  onSettingsOpen: () => void;
  hasNotifications?: boolean;
  filters: FilterType[];
  onFiltersChange: (filters: FilterType[]) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  sidebarCollapsed?: boolean;
}

const logLevels = [
  { value: 'ERROR', label: 'Error' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'INFO', label: 'Info' },
];

const services = [
  { value: 'auth-service', label: 'Auth Service' },
  { value: 'api-gateway', label: 'API Gateway' },
  { value: 'payment-service', label: 'Payment Service' },
  { value: 'database', label: 'Database' },
  { value: 'cache-service', label: 'Cache Service' },
];

const environments = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' },
];

export default function Header({ 
  user, 
  onLogout, 
  onSettingsOpen, 
  hasNotifications = false,
  filters,
  onFiltersChange,
  dateRange,
  onDateRangeChange,
  sidebarCollapsed = false,
}: HeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(
    new Set(filters.filter(f => f.type === 'level').map(f => f.value))
  );
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(filters.filter(f => f.type === 'service').map(f => f.value))
  );
  const [selectedEnvironments, setSelectedEnvironments] = useState<Set<string>>(
    new Set(filters.filter(f => f.type === 'environment').map(f => f.value))
  );

  // Sync state when filters prop changes
  useEffect(() => {
    setSelectedLevels(new Set(filters.filter(f => f.type === 'level').map(f => f.value)));
    setSelectedServices(new Set(filters.filter(f => f.type === 'service').map(f => f.value)));
    setSelectedEnvironments(new Set(filters.filter(f => f.type === 'environment').map(f => f.value)));
  }, [filters]);

  const updateFilters = () => {
    const newFilters: FilterType[] = [];
    
    selectedLevels.forEach(value => {
      const label = logLevels.find(l => l.value === value)?.label || value;
      newFilters.push({ type: 'level', value, label });
    });
    
    selectedServices.forEach(value => {
      const label = services.find(s => s.value === value)?.label || value;
      newFilters.push({ type: 'service', value, label });
    });
    
    selectedEnvironments.forEach(value => {
      const label = environments.find(e => e.value === value)?.label || value;
      newFilters.push({ type: 'environment', value, label });
    });
    
    onFiltersChange(newFilters);
  };

  const toggleLevel = (value: string) => {
    const newSet = new Set(selectedLevels);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setSelectedLevels(newSet);
    setTimeout(updateFilters, 0);
  };

  const toggleService = (value: string) => {
    const newSet = new Set(selectedServices);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setSelectedServices(newSet);
    setTimeout(updateFilters, 0);
  };

  const toggleEnvironment = (value: string) => {
    const newSet = new Set(selectedEnvironments);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    setSelectedEnvironments(newSet);
    setTimeout(updateFilters, 0);
  };

  return (
    <div 
      className="fixed top-0 z-50 border-b backdrop-blur-none h-16 shadow-sm"
      style={{ 
        backgroundColor: 'hsl(var(--card))',
        left: sidebarCollapsed ? '64px' : '256px',
        right: '0'
      }}
    >
      <div className="w-full px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Log Analyzer</h1>
            <p className="text-sm text-muted-foreground">Query logs using natural language</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {filters.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                    {filters.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-80 !bg-card border-border backdrop-blur-none" 
              align="end"
              style={{ backgroundColor: 'hsl(var(--card))' }}
            >
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Log Levels</Label>
                  <div className="mt-2 space-y-2">
                    {logLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`header-level-${level.value}`}
                          checked={selectedLevels.has(level.value)}
                          onCheckedChange={() => toggleLevel(level.value)}
                        />
                        <Label
                          htmlFor={`header-level-${level.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold">Services</Label>
                  <div className="mt-2 space-y-2">
                    {services.map((service) => (
                      <div key={service.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`header-service-${service.value}`}
                          checked={selectedServices.has(service.value)}
                          onCheckedChange={() => toggleService(service.value)}
                        />
                        <Label
                          htmlFor={`header-service-${service.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {service.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold">Environments</Label>
                  <div className="mt-2 space-y-2">
                    {environments.map((env) => (
                      <div key={env.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`header-env-${env.value}`}
                          checked={selectedEnvironments.has(env.value)}
                          onCheckedChange={() => toggleEnvironment(env.value)}
                        />
                        <Label
                          htmlFor={`header-env-${env.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {env.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            {/* Notification Bell */}
            <Button 
              variant="outline" 
              size="sm" 
              className="relative"
            >
              <Bell className="w-4 h-4" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>

            {/* Settings Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSettingsOpen}
            >
              <Settings className="w-4 h-4" />
            </Button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 !bg-card border-border shadow-lg backdrop-blur-none" 
                align="end" 
                forceMount
                style={{ backgroundColor: 'hsl(var(--card))' }}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <Badge variant="secondary" className="mt-2 w-fit text-xs">
                      {user.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettingsOpen}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

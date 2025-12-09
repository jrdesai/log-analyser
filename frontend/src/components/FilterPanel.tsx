import { useState } from 'react';
import { Filter as FilterIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Filter } from './FilterChips';

interface FilterPanelProps {
  onFiltersChange: (filters: Filter[]) => void;
  currentFilters: Filter[];
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

export default function FilterPanel({ onFiltersChange, currentFilters }: FilterPanelProps) {
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(
    new Set(currentFilters.filter(f => f.type === 'level').map(f => f.value))
  );
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(currentFilters.filter(f => f.type === 'service').map(f => f.value))
  );
  const [selectedEnvironments, setSelectedEnvironments] = useState<Set<string>>(
    new Set(currentFilters.filter(f => f.type === 'environment').map(f => f.value))
  );

  const updateFilters = () => {
    const filters: Filter[] = [];
    
    selectedLevels.forEach(value => {
      const label = logLevels.find(l => l.value === value)?.label || value;
      filters.push({ type: 'level', value, label });
    });
    
    selectedServices.forEach(value => {
      const label = services.find(s => s.value === value)?.label || value;
      filters.push({ type: 'service', value, label });
    });
    
    selectedEnvironments.forEach(value => {
      const label = environments.find(e => e.value === value)?.label || value;
      filters.push({ type: 'environment', value, label });
    });
    
    onFiltersChange(filters);
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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <FilterIcon className="w-4 h-4 mr-2" />
          Filters
          {currentFilters.length > 0 && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
              {currentFilters.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Log Levels</Label>
            <div className="mt-2 space-y-2">
              {logLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level.value}`}
                    checked={selectedLevels.has(level.value)}
                    onCheckedChange={() => toggleLevel(level.value)}
                  />
                  <Label
                    htmlFor={`level-${level.value}`}
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
                    id={`service-${service.value}`}
                    checked={selectedServices.has(service.value)}
                    onCheckedChange={() => toggleService(service.value)}
                  />
                  <Label
                    htmlFor={`service-${service.value}`}
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
                    id={`env-${env.value}`}
                    checked={selectedEnvironments.has(env.value)}
                    onCheckedChange={() => toggleEnvironment(env.value)}
                  />
                  <Label
                    htmlFor={`env-${env.value}`}
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
  );
}


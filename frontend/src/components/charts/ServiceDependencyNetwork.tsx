import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceNode {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  dependencies: string[];
}

const services: ServiceNode[] = [
  { id: 'api-gateway', name: 'API Gateway', status: 'healthy', dependencies: ['auth-service', 'payment-service'] },
  { id: 'auth-service', name: 'Auth Service', status: 'healthy', dependencies: ['database'] },
  { id: 'payment-service', name: 'Payment Service', status: 'degraded', dependencies: ['database', 'cache-service'] },
  { id: 'database', name: 'Database', status: 'healthy', dependencies: [] },
  { id: 'cache-service', name: 'Cache Service', status: 'healthy', dependencies: [] },
  { id: 'notification-service', name: 'Notification Service', status: 'down', dependencies: [] },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'bg-green-500';
    case 'degraded': return 'bg-yellow-500';
    case 'down': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

export default function ServiceDependencyNetwork() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Service Dependency Network</CardTitle>
        <CardDescription>Service relationships and health status</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-auto">
        <div className="w-full overflow-auto">
          <div className="min-w-[500px] p-4">
            <div className="grid grid-cols-3 gap-6">
              {/* Layer 1: Entry point */}
              <div className="col-span-3 flex justify-center mb-4">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-24 h-24 rounded-lg border-2 border-border flex items-center justify-center bg-card",
                    services.find(s => s.id === 'api-gateway')?.status === 'healthy' ? 'border-green-500' : ''
                  )}>
                    <div className="text-center">
                      <div className="text-xs font-semibold">API Gateway</div>
                      <div className={cn(
                        "w-2 h-2 rounded-full mx-auto mt-1",
                        getStatusColor(services.find(s => s.id === 'api-gateway')?.status || 'healthy')
                      )} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 2: Services */}
              <div className="col-span-3 grid grid-cols-2 gap-4 mb-4">
                {services.filter(s => s.id !== 'api-gateway' && s.dependencies.length > 0).map((service) => (
                  <div key={service.id} className="flex flex-col items-center">
                    <div className={cn(
                      "w-20 h-20 rounded-lg border-2 border-border flex items-center justify-center bg-card",
                      service.status === 'healthy' ? 'border-green-500' : 
                      service.status === 'degraded' ? 'border-yellow-500' : 'border-red-500'
                    )}>
                      <div className="text-center">
                        <div className="text-xs font-semibold">{service.name}</div>
                        <div className={cn(
                          "w-2 h-2 rounded-full mx-auto mt-1",
                          getStatusColor(service.status)
                        )} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Layer 3: Infrastructure */}
              <div className="col-span-3 grid grid-cols-3 gap-4">
                {services.filter(s => s.dependencies.length === 0 && s.id !== 'api-gateway').map((service) => (
                  <div key={service.id} className="flex flex-col items-center">
                    <div className={cn(
                      "w-16 h-16 rounded-lg border-2 border-border flex items-center justify-center bg-card",
                      service.status === 'healthy' ? 'border-green-500' : 
                      service.status === 'degraded' ? 'border-yellow-500' : 'border-red-500'
                    )}>
                      <div className="text-center">
                        <div className="text-[10px] font-semibold">{service.name}</div>
                        <div className={cn(
                          "w-2 h-2 rounded-full mx-auto mt-1",
                          getStatusColor(service.status)
                        )} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Healthy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Degraded</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Down</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import { Search } from 'lucide-react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

export default function EmptyState() {
  return (
    <Card className="p-12 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-primary" />
      </div>
      <CardTitle className="mb-2">Start analyzing your logs</CardTitle>
      <CardDescription className="max-w-md mx-auto">
        Use natural language to query your logs. Ask about errors, performance issues, or specific events.
      </CardDescription>
    </Card>
  );
}


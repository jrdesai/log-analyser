import { Search, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { suggestedQueries } from '@/data/sampleData';

interface SearchBarProps {
  query: string;
  loading: boolean;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ query, loading, onQueryChange, onSearch }: SearchBarProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Ask a question about your logs
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                placeholder="e.g., Show me all errors from the auth service in the last hour"
                className="pl-10"
              />
            </div>
            <Button 
              onClick={onSearch} 
              disabled={loading || !query.trim()}
              size="lg"
              className="w-[140px] font-semibold shadow-sm"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Try:</span>
          {suggestedQueries.map((sq, idx) => (
            <Button
              key={idx}
              variant="secondary"
              size="sm"
              onClick={() => onQueryChange(sq)}
              className="text-xs"
            >
              {sq}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


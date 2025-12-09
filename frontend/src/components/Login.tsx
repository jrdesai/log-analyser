import { useState } from 'react';
import { Activity, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  loading?: boolean;
}

export default function Login({ onLogin, loading = false }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (email.trim() && password.trim()) {
      onLogin(email, password);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <Activity className="w-10 h-10 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">AI Log Analyzer</CardTitle>
          <CardDescription>
            Sign in to access your log analysis dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          <Button 
            onClick={handleSubmit}
            className="w-full"
            size="lg"
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Demo mode: Use any email and password to sign in
          </p>
        </CardContent>
      </Card>
    </div>
  );
}


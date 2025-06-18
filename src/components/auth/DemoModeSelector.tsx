
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/contexts/auth/types';
import { User, Shield, Wrench } from 'lucide-react';

const DemoModeSelector: React.FC = () => {
  const { initializeDemoMode } = useAuth();

  const demoOptions = [
    {
      role: 'sales_rep' as Role,
      title: 'Sales Representative',
      description: 'Access the sales OS with leads, dialer, and AI assistant',
      icon: User,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      role: 'manager' as Role,
      title: 'Sales Manager',
      description: 'Access the manager OS with team analytics and oversight',
      icon: Shield,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      role: 'developer' as Role,
      title: 'Developer',
      description: 'Access the developer OS with system monitoring and tools',
      icon: Wrench,
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const handleDemoLogin = (role: Role) => {
    initializeDemoMode(role);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Demo Mode
          </Badge>
        </CardTitle>
        <CardDescription>
          Try out different user roles without creating an account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {demoOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.role}
                onClick={() => handleDemoLogin(option.role)}
                className={`${option.color} text-white p-4 h-auto justify-start`}
                variant="default"
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5" />
                  <div className="text-left flex-1">
                    <div className="font-medium">{option.title}</div>
                    <div className="text-sm opacity-90 mt-1">
                      {option.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="text-center pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            Demo mode uses mock data and doesn't require authentication
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoModeSelector;

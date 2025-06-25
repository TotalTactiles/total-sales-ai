
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { demoUsers } from '@/data/demo.mock.data';
import { User, Settings, Code } from 'lucide-react';

interface DemoLoginCardsProps {
  onDemoLogin: (email: string, password: string) => void;
}

const DemoLoginCards: React.FC<DemoLoginCardsProps> = ({ onDemoLogin }) => {
  const roleIcons = {
    manager: <Settings className="h-5 w-5" />,
    sales_rep: <User className="h-5 w-5" />,
    developer: <Code className="h-5 w-5" />
  };

  const roleDescriptions = {
    manager: 'Team analytics, performance tracking & insights',
    sales_rep: 'Smart dialer, call scripts & AI sales assistant', 
    developer: 'System monitoring, logs & AI optimization tools'
  };

  const roleColors = {
    manager: 'bg-purple-100 text-purple-800 border-purple-200',
    sales_rep: 'bg-blue-100 text-blue-800 border-blue-200',
    developer: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Demo Access</h3>
        <p className="text-sm text-gray-600">One-click login to explore each OS with pre-loaded data</p>
      </div>
      
      <div className="space-y-3">
        {demoUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {roleIcons[user.role as keyof typeof roleIcons]}
                  <div>
                    <CardTitle className="text-sm font-medium">{user.name}</CardTitle>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className={roleColors[user.role as keyof typeof roleColors]}>
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-600 mb-3">
                {roleDescriptions[user.role as keyof typeof roleDescriptions]}
              </p>
              <Button 
                onClick={() => onDemoLogin(user.email, user.password)}
                className="w-full h-8 text-xs"
                variant="outline"
              >
                Login as {user.role.replace('_', ' ')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          All demo accounts bypass onboarding and include realistic mock data
        </p>
      </div>
    </div>
  );
};

export default DemoLoginCards;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoUsers } from '@/data/demo.mock.data';
import { User, Shield, Code } from 'lucide-react';

interface DemoLoginCardsProps {
  onDemoLogin: (email: string, password: string) => void;
}

const DemoLoginCards: React.FC<DemoLoginCardsProps> = ({ onDemoLogin }) => {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'developer':
        return <Code className="h-4 w-4" />;
      case 'manager':
        return <Shield className="h-4 w-4" />;
      case 'sales_rep':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'developer':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sales_rep':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Demo Access</h3>
        <p className="text-sm text-gray-600">Choose a role to explore TSAM OS</p>
      </div>
      
      {demoUsers.map((user) => (
        <Card key={user.email} className="border border-gray-200 hover:border-[#7B61FF] transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                {getRoleIcon(user.role)}
                {user.role.replace('_', ' ')} Demo
              </CardTitle>
              <Badge 
                variant="outline" 
                className={`text-xs ${getRoleColor(user.role)}`}
              >
                {user.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-gray-600 mb-3">{user.description}</p>
            <Button
              onClick={() => onDemoLogin(user.email, user.password)}
              className="w-full h-8 text-xs bg-[#7B61FF] hover:bg-[#674edc] text-white"
            >
              Access {user.role.replace('_', ' ')} OS
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DemoLoginCards;

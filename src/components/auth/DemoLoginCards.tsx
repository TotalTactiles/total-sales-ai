
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoUsers } from '@/data/demo.mock.data';

interface DemoLoginCardsProps {
  onDemoLogin: (email: string, password: string) => void;
}

const DemoLoginCards: React.FC<DemoLoginCardsProps> = ({ onDemoLogin }) => {
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
              <CardTitle className="text-sm font-medium capitalize">
                {user.role.replace('_', ' ')} Demo
              </CardTitle>
              <Badge variant="outline" className="text-xs">
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

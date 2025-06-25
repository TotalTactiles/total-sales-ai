
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TSAMCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

const TSAMCard: React.FC<TSAMCardProps> = ({ 
  title, 
  children, 
  icon, 
  className = "",
  priority = 'medium'
}) => {
  const getPriorityColors = () => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50/10';
      case 'high':
        return 'border-orange-500 bg-orange-50/10';
      case 'medium':
        return 'border-blue-500 bg-blue-50/10';
      case 'low':
        return 'border-green-500 bg-green-50/10';
      default:
        return 'border-gray-500 bg-gray-50/10';
    }
  };

  return (
    <Card className={`${getPriorityColors()} backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-100">
        {children}
      </CardContent>
    </Card>
  );
};

export default TSAMCard;

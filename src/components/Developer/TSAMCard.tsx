
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  const getPriorityBadge = () => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className={`transition-shadow duration-200 hover:shadow-md ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            {icon}
            {title}
          </CardTitle>
          {getPriorityBadge()}
        </div>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
};

export default TSAMCard;

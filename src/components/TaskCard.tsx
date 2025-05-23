
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TaskCardProps {
  title: string;
  description?: string;
  action?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  description,
  action = "View Details",
  icon,
  onClick
}) => {
  return (
    <Card className="card-action overflow-hidden hover:border-primary transition-colors">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-medium">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClick}
          className="text-primary hover:text-primary-foreground hover:bg-primary"
        >
          {action} <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;

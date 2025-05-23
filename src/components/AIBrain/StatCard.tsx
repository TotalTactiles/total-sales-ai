
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  isLoading: boolean;
}

const StatCard = ({ title, value, icon, isLoading }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="flex items-center p-4">
        {isLoading ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : (
          <div className="mr-2">
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className={`font-bold ${typeof value === 'number' ? 'text-2xl' : 'text-lg'}`}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

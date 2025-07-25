
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface MiniNotificationProps {
  message: string;
  icon?: string;
}

const MiniNotification: React.FC<MiniNotificationProps> = ({ message, icon = '⚡️' }) => {
  return (
    <Card className="shadow-lg border-salesCyan-light dark:border-salesBlue">
      <CardContent className="p-3 bg-white dark:bg-dark-card">
        <div className="text-sm animate-slide-up flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-salesCyan-light flex items-center justify-center text-salesBlue dark:bg-salesBlue/20 dark:text-salesCyan">
            <span>{icon}</span>
          </div>
          <div className="dark:text-white">
            {message}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniNotification;

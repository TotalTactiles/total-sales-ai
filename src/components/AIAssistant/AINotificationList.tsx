
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface AINotification {
  id: number;
  title: string;
  message: string;
  type: 'alert' | 'tip' | 'achievement';
  icon: string;
  read: boolean;
  timestamp: Date;
}

interface AINotificationListProps {
  notifications: AINotification[];
}

const AINotificationList: React.FC<AINotificationListProps> = ({ notifications }) => {
  return (
    <>
      <div className="p-4 border-b dark:border-dark-border">
        <h3 className="text-sm font-semibold text-salesBlue dark:text-salesCyan">Recent Notifications</h3>
      </div>
      <div className="divide-y dark:divide-dark-border">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${notification.read ? 'opacity-70' : ''}`}
          >
            <div className="flex gap-3">
              <div className="text-xl">{notification.icon}</div>
              <div>
                <div className="font-medium text-sm dark:text-white">{notification.title}</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{notification.message}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default AINotificationList;

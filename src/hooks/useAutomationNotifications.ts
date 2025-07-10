
import { useState, useEffect } from 'react';

export const useAutomationNotifications = () => {
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const checkForNewTemplates = () => {
      const storedTemplates = localStorage.getItem('newAutomationTemplates');
      if (storedTemplates) {
        const templateData = JSON.parse(storedTemplates);
        const timestamp = new Date(templateData.timestamp);
        const now = new Date();
        const timeDiff = now.getTime() - timestamp.getTime();
        
        // Show notification for templates added in the last 5 minutes
        if (timeDiff < 5 * 60 * 1000) {
          setHasNewNotifications(true);
          setNotificationCount(templateData.templates.length);
        }
      }
    };

    const handleNewTemplates = () => {
      setHasNewNotifications(true);
      checkForNewTemplates();
    };

    checkForNewTemplates();
    window.addEventListener('newAutomationTemplates', handleNewTemplates);
    
    return () => {
      window.removeEventListener('newAutomationTemplates', handleNewTemplates);
    };
  }, []);

  const clearNotifications = () => {
    setHasNewNotifications(false);
    setNotificationCount(0);
  };

  return {
    hasNewNotifications,
    notificationCount,
    clearNotifications
  };
};

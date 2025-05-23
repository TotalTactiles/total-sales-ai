
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NotificationPreference } from './types';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: NotificationPreference[];
  onPreferenceChange: (type: 'alert' | 'tip' | 'achievement', enabled: boolean) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  isOpen,
  onClose,
  preferences,
  onPreferenceChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Control what notifications you receive from your AI assistant.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {preferences.map((preference) => (
            <div key={preference.type} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800">
                  <span>{preference.icon}</span>
                </div>
                <div>
                  <p className="font-medium">{preference.type.charAt(0).toUpperCase() + preference.type.slice(1)}s</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{preference.description}</p>
                </div>
              </div>
              <Switch 
                id={`${preference.type}-switch`}
                checked={preference.enabled}
                onCheckedChange={(checked) => onPreferenceChange(preference.type, checked)}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettings;

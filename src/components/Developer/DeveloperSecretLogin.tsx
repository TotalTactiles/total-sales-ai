
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DeveloperSecretLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperSecretLogin: React.FC<DeveloperSecretLoginProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Developer Access</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-sm text-gray-600">
            Developer access has been activated. You will be logged in automatically.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeveloperSecretLogin;

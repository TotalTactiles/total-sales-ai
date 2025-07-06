
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface DemoActionButtonProps {
  action: string;
  payload?: any;
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  successMessage?: string;
  onSuccess?: (result: any) => void;
}

const DemoActionButton: React.FC<DemoActionButtonProps> = ({
  action,
  payload,
  children,
  variant = 'default',
  size = 'default',
  className = '',
  successMessage,
  onSuccess
}) => {
  const { isDemoUser, simulateAction } = useDemoMode();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!isDemoUser) {
      toast.error('This action is only available for demo users');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await simulateAction(action, payload);
      
      if (result.success) {
        toast.success(successMessage || result.message || 'Action completed successfully');
        onSuccess?.(result);
      } else {
        toast.error(result.message || 'Action failed');
      }
    } catch (error) {
      toast.error('Demo action failed');
      console.error('Demo action error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDemoUser) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
};

export default DemoActionButton;

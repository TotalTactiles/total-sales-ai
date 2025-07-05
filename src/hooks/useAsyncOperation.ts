
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface AsyncOperationState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
}

interface UseAsyncOperationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
}

export const useAsyncOperation = (options: UseAsyncOperationOptions = {}) => {
  const [state, setState] = useState<AsyncOperationState>({
    isLoading: false,
    error: null,
    progress: undefined
  });

  const execute = useCallback(async (
    operation: () => Promise<any>,
    operationType: 'report' | 'ai' | 'upload' | 'sync' | 'default' = 'default'
  ) => {
    setState({ isLoading: true, error: null, progress: 0 });

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: prev.progress ? Math.min(prev.progress + 10, 90) : 10
        }));
      }, 200);

      const result = await operation();
      
      clearInterval(progressInterval);
      setState({ isLoading: false, error: null, progress: 100 });
      
      if (options.showToast !== false) {
        toast({
          title: 'Success',
          description: 'Operation completed successfully',
        });
      }
      
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      setState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred',
        progress: undefined
      });
      
      if (options.showToast !== false) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An error occurred',
          variant: 'destructive',
        });
      }
      
      options.onError?.(error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, progress: undefined });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
};

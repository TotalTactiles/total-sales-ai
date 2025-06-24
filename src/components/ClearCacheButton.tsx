
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, RefreshCw, Database, HardDrive } from 'lucide-react';
import { CacheManager } from '@/utils/cacheManager';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ClearCacheButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

const ClearCacheButton: React.FC<ClearCacheButtonProps> = ({ 
  variant = 'outline', 
  size = 'default',
  showText = true 
}) => {
  const [isClearing, setIsClearing] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<any>(null);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      toast.info('Clearing all cache...', {
        description: 'This may take a moment',
      });

      await CacheManager.clearAllCache();
      
      toast.success('Cache cleared successfully!', {
        description: 'The page will reload in a moment',
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
      toast.error('Failed to clear cache', {
        description: 'Please try again or refresh the page manually',
      });
    } finally {
      setIsClearing(false);
    }
  };

  const getCacheStatus = async () => {
    try {
      const status = await CacheManager.getCacheStatus();
      setCacheStatus(status);
    } catch (error) {
      console.error('Failed to get cache status:', error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          onClick={getCacheStatus}
          disabled={isClearing}
        >
          {isClearing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {showText && (
            <span className="ml-2">
              {isClearing ? 'Clearing...' : 'Clear Cache'}
            </span>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Clear All Cache
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will clear all cached data including:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Browser storage (localStorage, sessionStorage)</li>
              <li>Service Worker cache</li>
              <li>IndexedDB data</li>
              <li>React Query cache</li>
              <li>Application state</li>
            </ul>
            
            {cacheStatus && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <div className="text-sm font-medium mb-2 flex items-center">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Current Cache Status:
                </div>
                <div className="text-xs space-y-1">
                  <div>localStorage items: {cacheStatus.localStorage}</div>
                  <div>sessionStorage items: {cacheStatus.sessionStorage}</div>
                  <div>Service Worker caches: {cacheStatus.serviceWorkerCaches.length}</div>
                  <div>SW registrations: {cacheStatus.serviceWorkerRegistrations}</div>
                </div>
              </div>
            )}
            
            <p className="mt-3 text-sm text-amber-600">
              ⚠️ The page will reload automatically after clearing cache.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleClearCache}
            disabled={isClearing}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isClearing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Cache
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearCacheButton;

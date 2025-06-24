
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Database, 
  Trash2, 
  RefreshCw, 
  HardDrive, 
  Activity,
  Server,
  Globe,
  Settings
} from 'lucide-react';
import { CacheManager } from '@/utils/cacheManager';
import ClearCacheButton from '@/components/ClearCacheButton';

const CacheManagement: React.FC = () => {
  const [cacheStatus, setCacheStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refreshCacheStatus = async () => {
    setLoading(true);
    try {
      const status = await CacheManager.getCacheStatus();
      setCacheStatus(status);
    } catch (error) {
      console.error('Failed to get cache status:', error);
      toast.error('Failed to get cache status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCacheStatus();
  }, []);

  const clearSpecificCache = async (type: string) => {
    try {
      switch (type) {
        case 'localStorage':
          await CacheManager.clearBrowserStorage();
          toast.success('Browser storage cleared');
          break;
        case 'serviceWorker':
          await CacheManager.clearServiceWorkerCache();
          toast.success('Service Worker cache cleared');
          break;
        case 'reactQuery':
          CacheManager.clearReactQueryCache();
          toast.success('React Query cache cleared');
          break;
        default:
          break;
      }
      refreshCacheStatus();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      toast.error(`Failed to clear ${type} cache`);
    }
  };

  const getCacheSize = (items: number) => {
    if (items === 0) return '0 KB';
    // Rough estimate - each localStorage item is typically 1-2KB
    const sizeKB = items * 1.5;
    return sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(1)} KB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cache Management</h2>
          <p className="text-muted-foreground">Monitor and manage application cache</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshCacheStatus}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <ClearCacheButton />
        </div>
      </div>

      {cacheStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <HardDrive className="h-4 w-4 mr-2" />
                localStorage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cacheStatus.localStorage}</div>
              <div className="text-xs text-muted-foreground">
                {getCacheSize(cacheStatus.localStorage)}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => clearSpecificCache('localStorage')}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Database className="h-4 w-4 mr-2" />
                sessionStorage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cacheStatus.sessionStorage}</div>
              <div className="text-xs text-muted-foreground">
                {getCacheSize(cacheStatus.sessionStorage)}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => clearSpecificCache('localStorage')}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Server className="h-4 w-4 mr-2" />
                Service Worker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cacheStatus.serviceWorkerCaches.length}</div>
              <div className="text-xs text-muted-foreground">
                Active caches
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={() => clearSpecificCache('serviceWorker')}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                SW Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cacheStatus.serviceWorkerRegistrations}</div>
              <div className="text-xs text-muted-foreground">
                Active workers
              </div>
              <Badge variant={cacheStatus.serviceWorkerRegistrations > 0 ? "default" : "secondary"}>
                {cacheStatus.serviceWorkerRegistrations > 0 ? "Active" : "Inactive"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {cacheStatus && cacheStatus.serviceWorkerCaches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Service Worker Cache Details
            </CardTitle>
            <CardDescription>
              List of active service worker caches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {cacheStatus.serviceWorkerCaches.map((cacheName: string, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{cacheName}</div>
                    <div className="text-sm text-muted-foreground">Cache instance</div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Cache Management Actions
          </CardTitle>
          <CardDescription>
            Additional cache management tools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => clearSpecificCache('reactQuery')}
            >
              <Database className="h-4 w-4 mr-2" />
              Clear React Query
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Hard Refresh
            </Button>
            
            <ClearCacheButton showText={true} variant="destructive" />
          </div>
          
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Warning:</strong> Clearing cache will remove all stored data and may log you out. 
              The application will reload automatically after clearing.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheManagement;

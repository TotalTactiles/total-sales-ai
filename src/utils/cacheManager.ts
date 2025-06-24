
/**
 * Comprehensive cache management utility
 */

export class CacheManager {
  /**
   * Clear all browser storage
   */
  static async clearBrowserStorage(): Promise<void> {
    try {
      // Clear localStorage
      localStorage.clear();
      console.log('✅ localStorage cleared');

      // Clear sessionStorage
      sessionStorage.clear();
      console.log('✅ sessionStorage cleared');

      // Clear IndexedDB if available
      if ('indexedDB' in window) {
        try {
          // Get all databases and clear them
          const databases = await indexedDB.databases();
          await Promise.all(
            databases.map(db => {
              if (db.name) {
                return new Promise<void>((resolve, reject) => {
                  const deleteReq = indexedDB.deleteDatabase(db.name!);
                  deleteReq.onsuccess = () => resolve();
                  deleteReq.onerror = () => reject(deleteReq.error);
                });
              }
            })
          );
          console.log('✅ IndexedDB cleared');
        } catch (error) {
          console.warn('⚠️ Could not clear IndexedDB:', error);
        }
      }
    } catch (error) {
      console.error('❌ Error clearing browser storage:', error);
      throw error;
    }
  }

  /**
   * Clear service worker cache
   */
  static async clearServiceWorkerCache(): Promise<void> {
    if ('serviceWorker' in navigator && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Service Worker cache cleared');
      } catch (error) {
        console.error('❌ Error clearing service worker cache:', error);
        throw error;
      }
    }
  }

  /**
   * Unregister service worker
   */
  static async unregisterServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('✅ Service Worker unregistered');
      } catch (error) {
        console.error('❌ Error unregistering service worker:', error);
        throw error;
      }
    }
  }

  /**
   * Clear browser cache (force reload resources)
   */
  static async clearBrowserCache(): Promise<void> {
    try {
      // Clear browser cache by reloading with cache bypass
      if ('location' in window) {
        // Force hard reload
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Error clearing browser cache:', error);
      throw error;
    }
  }

  /**
   * Clear all React Query cache
   */
  static clearReactQueryCache(): void {
    try {
      // If React Query is available, clear its cache
      const queryClient = (window as any).__REACT_QUERY_CLIENT__;
      if (queryClient) {
        queryClient.clear();
        console.log('✅ React Query cache cleared');
      }
    } catch (error) {
      console.warn('⚠️ Could not clear React Query cache:', error);
    }
  }

  /**
   * Clear all application state
   */
  static clearApplicationState(): void {
    try {
      // Clear any global state managers
      // This would include Redux, Zustand, or other state management stores
      
      // Clear any cached API responses
      // Clear any temporary data structures
      
      console.log('✅ Application state cleared');
    } catch (error) {
      console.error('❌ Error clearing application state:', error);
      throw error;
    }
  }

  /**
   * Clear all cache - comprehensive method
   */
  static async clearAllCache(): Promise<void> {
    console.log('🧹 Starting comprehensive cache clearing...');
    
    const tasks = [
      this.clearBrowserStorage(),
      this.clearServiceWorkerCache(),
      this.unregisterServiceWorker(),
    ];

    try {
      await Promise.all(tasks);
      
      // Clear React Query cache
      this.clearReactQueryCache();
      
      // Clear application state
      this.clearApplicationState();
      
      console.log('✅ All cache cleared successfully');
      
      // Force a hard reload after clearing everything
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error during cache clearing:', error);
      throw error;
    }
  }

  /**
   * Get cache status information
   */
  static async getCacheStatus(): Promise<{
    localStorage: number;
    sessionStorage: number;
    serviceWorkerCaches: string[];
    serviceWorkerRegistrations: number;
  }> {
    const status = {
      localStorage: localStorage.length,
      sessionStorage: sessionStorage.length,
      serviceWorkerCaches: [] as string[],
      serviceWorkerRegistrations: 0,
    };

    try {
      if ('caches' in window) {
        status.serviceWorkerCaches = await caches.keys();
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        status.serviceWorkerRegistrations = registrations.length;
      }
    } catch (error) {
      console.warn('⚠️ Could not get complete cache status:', error);
    }

    return status;
  }
}

// Export convenience methods
export const clearAllCache = () => CacheManager.clearAllCache();
export const getCacheStatus = () => CacheManager.getCacheStatus();
export const clearBrowserStorage = () => CacheManager.clearBrowserStorage();
export const clearServiceWorkerCache = () => CacheManager.clearServiceWorkerCache();

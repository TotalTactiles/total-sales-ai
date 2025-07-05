
import { useCallback, useMemo, useEffect, useState } from 'react';

export const useOptimizedPerformance = () => {
  const [isSlowDevice, setIsSlowDevice] = useState(false);

  // Detect device performance capability
  useEffect(() => {
    const checkDevicePerformance = () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Check for low-end device indicators
      const connection = (navigator as any).connection;
      const isSlowConnection = connection && (
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g'
      );
      
      // Check memory (if available)
      const memory = (performance as any).memory;
      const isLowMemory = memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8;

      setIsSlowDevice(prefersReducedMotion || isSlowConnection || isLowMemory);
    };

    checkDevicePerformance();

    // Listen for connection changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', checkDevicePerformance);
      
      return () => {
        (navigator as any).connection.removeEventListener('change', checkDevicePerformance);
      };
    }
  }, []);

  // Optimized debounce hook
  const useOptimizedDebounce = useCallback((callback: (...args: any[]) => void, delay: number) => {
    const debouncedCallback = useMemo(() => {
      let timeoutId: NodeJS.Timeout;
      
      return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
      };
    }, [callback, delay]);

    return debouncedCallback;
  }, []);

  // Memoized component wrapper for expensive renders
  const MemoizedComponent = useCallback(<T extends Record<string, any>>(
    Component: React.ComponentType<T>,
    deps: any[] = []
  ) => {
    return useMemo(() => Component, deps);
  }, []);

  return {
    isSlowDevice,
    useOptimizedDebounce,
    MemoizedComponent
  };
};

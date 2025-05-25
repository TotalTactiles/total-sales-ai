
/**
 * Mobile optimization utilities for SalesOS
 */

export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTabletDevice = (): boolean => {
  return /iPad|Android.*[tT]ablet/i.test(navigator.userAgent);
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getViewportHeight = (): number => {
  return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
};

export const getViewportWidth = (): number => {
  return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
};

export const optimizeForMobile = (): void => {
  // Prevent zoom on input focus (iOS)
  const metaViewport = document.querySelector('meta[name="viewport"]');
  if (metaViewport && isMobileDevice()) {
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
  }

  // Add mobile-specific classes to body
  if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
  }
  
  if (isTabletDevice()) {
    document.body.classList.add('tablet-device');
  }
  
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Safe area utilities for devices with notches
export const getSafeAreaInsets = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    top: style.getPropertyValue('--safe-area-inset-top') || '0px',
    right: style.getPropertyValue('--safe-area-inset-right') || '0px',
    bottom: style.getPropertyValue('--safe-area-inset-bottom') || '0px',
    left: style.getPropertyValue('--safe-area-inset-left') || '0px',
  };
};

// Performance optimization for mobile
export const optimizeScrolling = (element: HTMLElement): void => {
  // Use type assertion for non-standard CSS properties
  (element.style as any).webkitOverflowScrolling = 'touch';
  element.style.overscrollBehavior = 'contain';
};

// Initialize mobile optimizations
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', optimizeForMobile);
}

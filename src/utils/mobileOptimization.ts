import { logger } from '@/utils/logger';

export const optimizeForMobile = (): void => {
  try {
    // Ensure viewport meta tag exists with basic settings
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewport);
    }

    // Optimize touch events
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });

    // Prevent pull-to-refresh on mobile
    document.body.style.overscrollBehavior = 'none';

    logger.info('Mobile optimizations applied successfully');
  } catch (error) {
    logger.warn('Failed to apply mobile optimizations:', error);
  }
};

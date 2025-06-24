
import React, { useEffect, useCallback } from 'react';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useUnusedFeatures } from '@/hooks/useUnusedFeatures';

interface UsageTrackerProps {
  children: React.ReactNode;
  feature: string;
  action?: string;
  context?: string;
  trackOnMount?: boolean;
}

const UsageTracker: React.FC<UsageTrackerProps> = ({ 
  children, 
  feature, 
  action = 'view',
  context,
  trackOnMount = true 
}) => {
  const { trackEvent } = useUsageTracking();
  const { updateFeatureUsage } = useUnusedFeatures();

  const handleTrackEvent = useCallback(() => {
    trackEvent({ feature, action, context });
    updateFeatureUsage(feature);
  }, [trackEvent, feature, action, context, updateFeatureUsage]);

  useEffect(() => {
    if (trackOnMount) {
      handleTrackEvent();
    }
  }, [trackOnMount, handleTrackEvent]);

  const handleClick = useCallback(() => {
    trackEvent({ feature, action: 'click', context });
    updateFeatureUsage(feature);
  }, [trackEvent, feature, context, updateFeatureUsage]);

  const handleHover = useCallback(() => {
    trackEvent({ feature, action: 'hover', context });
  }, [trackEvent, feature, context]);

  return (
    <div onClick={handleClick} onMouseEnter={handleHover}>
      {children}
    </div>
  );
};

export default UsageTracker;

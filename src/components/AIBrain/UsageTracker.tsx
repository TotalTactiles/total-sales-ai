
import React, { useEffect } from 'react';
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

  useEffect(() => {
    if (trackOnMount) {
      trackEvent({ feature, action, context });
      updateFeatureUsage(feature);
    }
  }, [trackOnMount, feature, action, context]);

  const handleClick = () => {
    trackEvent({ feature, action: 'click', context });
    updateFeatureUsage(feature);
  };

  const handleHover = () => {
    trackEvent({ feature, action: 'hover', context });
  };

  return (
    <div onClick={handleClick} onMouseEnter={handleHover}>
      {children}
    </div>
  );
};

export default UsageTracker;

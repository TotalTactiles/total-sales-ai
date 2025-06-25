
import React from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { useTSAM } from '@/hooks/useTSAM';
import { Switch } from '@/components/ui/switch';
import { Flag, Users, Target } from 'lucide-react';

const FeatureFlagsPage: React.FC = () => {
  const { featureFlags, loading, isDeveloper, toggleFeatureFlag } = useTSAM();

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const handleToggle = async (flagName: string, enabled: boolean) => {
    await toggleFeatureFlag(flagName, enabled);
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'developers':
        return <Target className="h-4 w-4 text-purple-400" />;
      case 'all':
        return <Users className="h-4 w-4 text-blue-400" />;
      default:
        return <Flag className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <TSAMLayout title="Feature Flags">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="Feature Flags">
      <TSAMCard title="Feature Flag Console" icon={<Flag className="h-5 w-5" />}>
        <div className="space-y-4">
          {featureFlags.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No feature flags configured.
            </div>
          ) : (
            featureFlags.map(flag => (
              <div key={flag.id} className="p-4 border border-gray-600 rounded-lg bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getAudienceIcon(flag.target_audience)}
                    <div>
                      <h4 className="font-semibold text-white">{flag.flag_name}</h4>
                      <p className="text-sm text-gray-400">{flag.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      Target: {flag.target_audience}
                    </span>
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={(enabled) => handleToggle(flag.flag_name, enabled)}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Created: {new Date(flag.created_at).toLocaleDateString()}
                  {flag.updated_at !== flag.created_at && (
                    <span className="ml-4">
                      Updated: {new Date(flag.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </TSAMCard>
    </TSAMLayout>
  );
};

export default FeatureFlagsPage;

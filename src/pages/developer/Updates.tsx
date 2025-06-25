
import React, { useState, useEffect } from 'react';
import TSAMLayout from '@/components/Developer/TSAMLayout';
import TSAMCard from '@/components/Developer/TSAMCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, GitCommit, Package, User } from 'lucide-react';

interface SystemUpdate {
  id: string;
  update_type: string;
  description: string;
  changes: any;
  deployed_at: string;
  deployed_by?: string;
}

const UpdatesPage: React.FC = () => {
  const { profile } = useAuth();
  const [updates, setUpdates] = useState<SystemUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const isDeveloper = profile?.role === 'developer';

  useEffect(() => {
    if (!isDeveloper) return;

    const fetchUpdates = async () => {
      try {
        const { data, error } = await supabase
          .from('system_updates')
          .select('*')
          .order('deployed_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setUpdates(data || []);
      } catch (err) {
        console.error('Error fetching updates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, [isDeveloper]);

  if (!isDeveloper) {
    return <div>Access Denied</div>;
  }

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'deployment':
        return <Package className="h-4 w-4 text-blue-400" />;
      case 'hotfix':
        return <GitCommit className="h-4 w-4 text-red-400" />;
      case 'feature':
        return <Package className="h-4 w-4 text-green-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <TSAMLayout title="System Updates">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
        </div>
      </TSAMLayout>
    );
  }

  return (
    <TSAMLayout title="System Updates">
      <TSAMCard title="Deployment History" icon={<GitCommit className="h-5 w-5" />}>
        <div className="space-y-4">
          {updates.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No system updates recorded.
            </div>
          ) : (
            updates.map(update => (
              <div key={update.id} className="border-l-2 border-purple-400 pl-4 py-3 bg-white/5 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getUpdateIcon(update.update_type)}
                    <div>
                      <h4 className="font-semibold text-white mb-1">{update.update_type}</h4>
                      <p className="text-gray-300 text-sm mb-2">{update.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(update.deployed_at).toLocaleString()}
                        </span>
                        {update.deployed_by && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {update.deployed_by}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {Object.keys(update.changes).length > 0 && (
                  <details className="mt-3">
                    <summary className="text-sm text-purple-400 cursor-pointer hover:text-purple-300">
                      View Changes
                    </summary>
                    <pre className="text-xs text-gray-400 bg-black/20 p-2 rounded mt-2 overflow-x-auto">
                      {JSON.stringify(update.changes, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))
          )}
        </div>
      </TSAMCard>
    </TSAMLayout>
  );
};

export default UpdatesPage;

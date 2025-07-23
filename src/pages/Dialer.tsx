
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/lead';
import { toast } from 'sonner';
import IntegratedDialerInterface from '@/components/AutoDialer/IntegratedDialerInterface';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, AlertTriangle, Users, Clock } from 'lucide-react';

const Dialer = () => {
  const { user, profile } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (user?.id && profile?.company_id) {
      fetchLeads();
    }
  }, [user?.id, profile?.company_id]);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('company_id', profile?.company_id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Add mock data for demo purposes
      const mockLeads: Lead[] = data?.map((lead, index) => ({
        ...lead,
        priority: index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low',
        speedToLead: Math.floor(Math.random() * 120) + 5,
        conversionLikelihood: Math.floor(Math.random() * 40) + 60,
        lastCallAttempt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        callAttempts: Math.floor(Math.random() * 3) + 1,
        score: Math.floor(Math.random() * 40) + 60
      })) || [];

      setLeads(mockLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSelect = (lead: Lead) => {
    setCurrentLead(lead);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dialer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Power Dialer</h1>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {leads.length} Leads
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {leads.filter(l => l.priority === 'high').length} High Priority
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Next Speed-to-Lead: {Math.min(...leads.map(l => l.speedToLead || 0))} min</span>
            </div>
            <Button 
              variant="outline" 
              onClick={fetchLeads}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <IntegratedDialerInterface
          leads={leads}
          onLeadSelect={handleLeadSelect}
        />
      </div>
    </div>
  );
};

export default Dialer;


import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import AIAssistant from '@/components/AIAssistant';
import EnhancedAutoDialerInterface from '@/components/AutoDialer/EnhancedAutoDialerInterface';
import { Lead } from '@/types/lead';

const Dialer = () => {
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);

  // Enhanced mock leads with new priority system and speed-to-lead data
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Michael Scott',
      company: 'Dunder Mifflin',
      source: 'LinkedIn',
      score: 85,
      priority: 'high',
      lastContact: '2 days ago',
      sentiment: 'positive',
      email: 'michael.scott@dundermifflin.com',
      phone: '(02) 8555-0123',
      status: 'contacted',
      tags: ['qualified', 'budget-approved', 'demo-requested'],
      isSensitive: false,
      conversionLikelihood: 88,
      speedToLead: 3, // 3 minutes old - CRITICAL
      leadSource: 'marketing',
      autopilotEnabled: false,
      timezonePref: 'Australia/Sydney',
      doNotCall: false
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'TechFlow Solutions',
      source: 'Website Form',
      score: 92,
      priority: 'high',
      lastContact: '1 hour ago',
      sentiment: 'positive',
      email: 'sarah.j@techflow.com.au',
      phone: '(03) 9555-0234',
      status: 'new',
      tags: ['hot-lead', 'enterprise', 'urgent'],
      isSensitive: false,
      conversionLikelihood: 91,
      speedToLead: 1, // 1 minute old - CRITICAL
      leadSource: 'website',
      autopilotEnabled: false,
      timezonePref: 'Australia/Melbourne',
      doNotCall: false
    },
    {
      id: '3',
      name: 'David Chen',
      company: 'Aussie Digital',
      source: 'Referral',
      score: 67,
      priority: 'medium',
      lastContact: '1 week ago',
      sentiment: 'neutral',
      email: 'david@aussiedigital.com.au',
      phone: '(07) 3555-0345',
      status: 'qualified',
      tags: ['follow-up', 'pricing-sent', 'warm'],
      isSensitive: false,
      conversionLikelihood: 62,
      speedToLead: 120, // 2 hours old
      leadSource: 'referral',
      autopilotEnabled: true,
      timezonePref: 'Australia/Brisbane',
      doNotCall: false
    },
    {
      id: '4',
      name: 'Emma Wilson',
      company: 'Coastal Marketing',
      source: 'Cold Outreach',
      score: 45,
      priority: 'low',
      lastContact: 'Never',
      sentiment: 'neutral',
      email: 'emma@coastalmarketing.com.au',
      phone: '(08) 6555-0456',
      status: 'new',
      tags: ['cold-lead', 'research-phase'],
      isSensitive: false,
      conversionLikelihood: 34,
      speedToLead: 1440, // 24 hours old
      leadSource: 'cold_outreach',
      autopilotEnabled: false,
      timezonePref: 'Australia/Perth',
      doNotCall: false
    },
    {
      id: '5',
      name: 'James Rodriguez',
      company: 'Perth Enterprises',
      source: 'Facebook Ads',
      score: 71,
      priority: 'medium',
      lastContact: '3 days ago',
      sentiment: 'positive',
      email: 'james@perthent.com.au',
      phone: '(02) 8555-0567',
      status: 'contacted',
      tags: ['interested', 'budget-discussion', 'warm'],
      isSensitive: false,
      conversionLikelihood: 76,
      speedToLead: 8, // 8 minutes old - URGENT
      leadSource: 'marketing',
      autopilotEnabled: true,
      timezonePref: 'Australia/Sydney',
      doNotCall: false
    },
    {
      id: '6',
      name: 'Lisa Thompson',
      company: 'Melbourne Consulting',
      source: 'Google Ads',
      score: 78,
      priority: 'high',
      lastContact: '30 minutes ago',
      sentiment: 'positive',
      email: 'lisa@melbourneconsulting.com.au',
      phone: '(03) 9555-0678',
      status: 'new',
      tags: ['conversion-ready', 'high-value', 'enterprise'],
      isSensitive: false,
      conversionLikelihood: 84,
      speedToLead: 2, // 2 minutes old - CRITICAL
      leadSource: 'marketing',
      autopilotEnabled: false,
      timezonePref: 'Australia/Melbourne',
      doNotCall: false
    }
  ];

  // Auto-select highest priority lead with AI optimization
  useEffect(() => {
    // AI selection logic: Speed-to-lead < 5 minutes gets highest priority
    const criticalSpeedLeads = mockLeads.filter(lead => 
      (lead.speedToLead || 0) < 5 && !lead.doNotCall
    );
    
    if (criticalSpeedLeads.length > 0) {
      // Select the one with highest conversion likelihood
      const bestCriticalLead = criticalSpeedLeads.sort((a, b) => 
        (b.conversionLikelihood || 0) - (a.conversionLikelihood || 0)
      )[0];
      setCurrentLead(bestCriticalLead);
      return;
    }

    // Fallback to highest priority with best conversion
    const highPriorityLead = mockLeads
      .filter(lead => lead.priority === 'high' && !lead.doNotCall)
      .sort((a, b) => (b.conversionLikelihood || 0) - (a.conversionLikelihood || 0))[0];
    
    if (highPriorityLead) {
      setCurrentLead(highPriorityLead);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1">
        <EnhancedAutoDialerInterface
          leads={mockLeads}
          currentLead={currentLead}
          onLeadSelect={setCurrentLead}
        />
      </div>
      
      <AIAssistant />
    </div>
  );
};

export default Dialer;

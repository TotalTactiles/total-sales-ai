
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import AIAssistant from '@/components/AIAssistant';
import AutoDialerInterface from '@/components/AutoDialer/AutoDialerInterface';
import { Lead } from '@/types/lead';

const Dialer = () => {
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);

  // Mock leads with enhanced data for Auto-Dialer
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
      phone: '(570) 555-0123',
      status: 'contacted',
      tags: ['qualified', 'budget-approved'],
      isSensitive: false,
      conversionLikelihood: 78,
      speedToLead: 3, // 3 minutes old
      leadSource: 'marketing',
      autopilotEnabled: false,
      timezonePref: 'Australia/Sydney',
      doNotCall: false
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      company: 'TechFlow Solutions',
      source: 'Website',
      score: 92,
      priority: 'high',
      lastContact: '1 hour ago',
      sentiment: 'positive',
      email: 'sarah.j@techflow.com.au',
      phone: '(02) 8555-0234',
      status: 'new',
      tags: ['hot-lead', 'demo-requested'],
      isSensitive: false,
      conversionLikelihood: 85,
      speedToLead: 2, // 2 minutes old
      leadSource: 'marketing',
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
      phone: '(03) 9555-0345',
      status: 'qualified',
      tags: ['follow-up', 'pricing-sent'],
      isSensitive: true,
      conversionLikelihood: 62,
      speedToLead: 120, // 2 hours old
      leadSource: 'referral',
      autopilotEnabled: true,
      timezonePref: 'Australia/Sydney',
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
      phone: '(07) 3555-0456',
      status: 'new',
      tags: ['cold-lead', 'research-phase'],
      isSensitive: false,
      conversionLikelihood: 34,
      speedToLead: 1440, // 24 hours old
      leadSource: 'cold_outreach',
      autopilotEnabled: false,
      timezonePref: 'Australia/Brisbane',
      doNotCall: false
    },
    {
      id: '5',
      name: 'James Rodriguez',
      company: 'Perth Enterprises',
      source: 'Facebook',
      score: 71,
      priority: 'medium',
      lastContact: '3 days ago',
      sentiment: 'positive',
      email: 'james@perthent.com.au',
      phone: '(08) 6555-0567',
      status: 'contacted',
      tags: ['interested', 'budget-discussion'],
      isSensitive: false,
      conversionLikelihood: 56,
      speedToLead: 4, // 4 minutes old
      leadSource: 'marketing',
      autopilotEnabled: false,
      timezonePref: 'Australia/Perth',
      doNotCall: false
    }
  ];

  // Auto-select first high priority lead
  useEffect(() => {
    const highPriorityLead = mockLeads.find(lead => lead.priority === 'high' && !lead.doNotCall);
    if (highPriorityLead && !currentLead) {
      setCurrentLead(highPriorityLead);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />
      
      <div className="flex-1">
        <AutoDialerInterface
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

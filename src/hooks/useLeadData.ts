
import { Lead } from '@/types/lead';

export const useLeadData = () => {
  const leads: Lead[] = [
    { 
      id: '1', 
      name: "Michael Scott", 
      company: "Dunder Mifflin", 
      source: "LinkedIn", 
      score: 85, 
      priority: 'high',
      sentiment: 'positive',
      objection: 'Needs approval',
      email: 'michael@dundermifflin.com',
      phone: '(570) 555-1234',
      status: 'new',
      tags: ['Budget Approved'],
      isSensitive: false,
      conversionLikelihood: 78
    },
    { 
      id: '2', 
      name: "Jim Halpert", 
      company: "Athlead", 
      source: "Facebook", 
      score: 72, 
      priority: 'medium', 
      lastContact: '2 days ago',
      sentiment: 'neutral',
      objection: 'Price concern',
      email: 'jim@athlead.com',
      phone: '(570) 555-5678',
      status: 'contacted',
      tags: ['Price Sensitive'],
      isSensitive: false,
      conversionLikelihood: 62
    },
    { 
      id: '3', 
      name: "Pam Beesly", 
      company: "Pratt Institute", 
      source: "Referral", 
      score: 93, 
      priority: 'high',
      sentiment: 'positive',
      email: 'pam@pratt.edu',
      phone: '(570) 555-9012',
      status: 'qualified',
      tags: ['Hot Lead', 'Demo Scheduled'],
      isSensitive: false,
      conversionLikelihood: 89
    },
    { 
      id: '4', 
      name: "Dwight Schrute", 
      company: "Schrute Farms", 
      source: "Website", 
      score: 68, 
      priority: 'medium', 
      lastContact: '1 week ago',
      sentiment: 'negative',
      objection: 'Current provider',
      email: 'dwight@schrutefarms.com',
      phone: '(570) 555-3456',
      status: 'new',
      tags: ['Existing Provider'],
      isSensitive: false,
      conversionLikelihood: 45
    },
    { 
      id: '5', 
      name: "Ryan Howard", 
      company: "WUPHF.com", 
      source: "LinkedIn", 
      score: 64, 
      priority: 'low', 
      lastContact: '3 days ago',
      sentiment: 'neutral',
      objection: 'No budget',
      email: 'ryan@wuphf.com',
      phone: '(570) 555-7890',
      status: 'contacted',
      tags: ['Budget Constraints'],
      isSensitive: false,
      conversionLikelihood: 32
    },
  ];

  return { leads };
};

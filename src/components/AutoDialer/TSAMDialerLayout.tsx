
import React from 'react';
import { Lead } from '@/types/lead';
import CleanAutoDialer from './CleanAutoDialer';

interface TSAMDialerLayoutProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
}

const TSAMDialerLayout: React.FC<TSAMDialerLayoutProps> = ({ leads, onLeadSelect }) => {
  return <CleanAutoDialer leads={leads} onLeadSelect={onLeadSelect} />;
};

export default TSAMDialerLayout;

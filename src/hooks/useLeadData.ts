
import { demoLeads } from '@/data/demoData';
import type { Lead } from '@/types/lead';

export const useLeadData = () => {
  return { leads: demoLeads as Lead[] };
};

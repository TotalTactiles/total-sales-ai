
import { useState, useEffect } from 'react';
import { Lead } from '@/types/lead';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { logger } from '@/utils/logger';

export const useMockData = () => {
  const { isDemoUser, getMockData } = useDemoMode();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (isDemoUser) {
        logger.info('🎭 Loading demo leads data');
        const demoLeads = getMockData('leads') || [];
        setLeads(demoLeads);
      } else {
        // For non-demo users, return empty array (they would use real data hooks)
        setLeads([]);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [isDemoUser, getMockData]);

  return {
    leads,
    isLoading,
    refetch: () => {
      if (isDemoUser) {
        const demoLeads = getMockData('leads') || [];
        setLeads(demoLeads);
      }
    }
  };
};

export const useTeamData = () => {
  const { isDemoUser, getMockData } = useDemoMode();
  const [teamMembers, setTeamMembers] = useState([]);
  const [pipelineHealth, setPipelineHealth] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (isDemoUser) {
        logger.info('🎭 Loading demo team data');
        setTeamMembers(getMockData('team-members') || []);
        setPipelineHealth(getMockData('pipeline-health') || {});
        setAlerts(getMockData('manager-alerts') || []);
      } else {
        setTeamMembers([]);
        setPipelineHealth({});
        setAlerts([]);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [isDemoUser, getMockData]);

  return {
    teamMembers,
    pipelineHealth,
    alerts,
    isLoading
  };
};

export const useSystemData = () => {
  const { isDemoUser, getMockData } = useDemoMode();
  const [agentLogs, setAgentLogs] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [recentCommits, setRecentCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      if (isDemoUser) {
        logger.info('🎭 Loading demo system data');
        setAgentLogs(getMockData('agent-logs') || []);
        setSystemHealth(getMockData('system-health') || {});
        setRecentCommits(getMockData('recent-commits') || []);
      } else {
        setAgentLogs([]);
        setSystemHealth({});
        setRecentCommits([]);
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [isDemoUser, getMockData]);

  return {
    agentLogs,
    systemHealth,
    recentCommits,
    isLoading
  };
};

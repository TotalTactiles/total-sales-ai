
import { useState, useEffect } from 'react';
import { SecurityEvent, SecurityIssue, SecurityPosture, WorkflowLimits } from '@/types/security';
import { AccessControlService } from '@/services/security/accessControlService';
import { encryptSensitiveData, decryptSensitiveData } from '@/services/security/base64Service';

export const useAISecurityPosture = () => {
  const [securityPosture, setSecurityPosture] = useState<SecurityPosture>({
    overallScore: 85,
    riskLevel: 'medium',
    activeThreats: 3,
    resolvedThreats: 12,
    lastAssessment: new Date().toISOString(),
    complianceStatus: {
      gdpr: true,
      soc2: true,
      hipaa: false,
      iso27001: true
    },
    vulnerabilities: {
      critical: 0,
      high: 2,
      medium: 5,
      low: 8
    }
  });

  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([
    {
      id: '1',
      title: 'Suspicious API Access Pattern',
      severity: 'high',
      status: 'open',
      description: 'Unusual API access pattern detected from multiple IP addresses',
      detectedAt: new Date().toISOString(),
      category: 'access_control'
    }
  ]);

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      type: 'authentication',
      severity: 'medium',
      description: 'Multiple failed login attempts detected',
      source: 'auth_system',
      resolved: false,
      metadata: {
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0',
        attempts: 5
      }
    }
  ]);

  const [workflowLimits, setWorkflowLimits] = useState<WorkflowLimits>({
    maxConcurrentTasks: 10,
    maxApiCallsPerMinute: 100,
    maxDataProcessingSize: 1000000,
    maxUserSessions: 50,
    rateLimitWindow: 60000
  });

  const refreshSecurityScore = async () => {
    // Simulate security score refresh
    const newScore = Math.floor(Math.random() * 20) + 80;
    setSecurityPosture(prev => ({
      ...prev,
      overallScore: newScore,
      lastAssessment: new Date().toISOString()
    }));
  };

  const getSecurityStatus = async () => {
    return {
      status: 'active',
      lastCheck: new Date().toISOString(),
      threatsDetected: securityIssues.length,
      systemHealth: 'good'
    };
  };

  const resolveSecurityEvent = async (eventId: string) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, resolved: true }
          : event
      )
    );
  };

  const validateWorkflowLimits = async (workflowType: string, currentUsage: number) => {
    const limits = workflowLimits;
    
    switch (workflowType) {
      case 'concurrent_tasks':
        return currentUsage < limits.maxConcurrentTasks;
      case 'api_calls':
        return currentUsage < limits.maxApiCallsPerMinute;
      case 'data_processing':
        return currentUsage < limits.maxDataProcessingSize;
      case 'user_sessions':
        return currentUsage < limits.maxUserSessions;
      default:
        return true;
    }
  };

  // Check access permissions using the service
  const checkAccess = async (resource: string, action: string, userRole: string) => {
    return await AccessControlService.checkAccess(resource, action, userRole);
  };

  // Encrypt/decrypt sensitive data
  const handleSensitiveData = async (data: string, encrypt: boolean = true) => {
    if (encrypt) {
      return await encryptSensitiveData(data);
    } else {
      return await decryptSensitiveData(data);
    }
  };

  useEffect(() => {
    refreshSecurityScore();
  }, []);

  return {
    securityPosture,
    securityIssues,
    securityEvents,
    workflowLimits,
    refreshSecurityScore,
    getSecurityStatus,
    resolveSecurityEvent,
    validateWorkflowLimits,
    checkAccess,
    handleSensitiveData
  };
};

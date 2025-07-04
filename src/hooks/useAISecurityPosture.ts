import { logger } from '@/utils/logger';

import { useState, useEffect } from 'react';
import { encodeBase64 } from '@/services/security/base64Service';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityEvent {
  id: string;
  type: 'unauthorized_access' | 'data_breach' | 'api_misuse' | 'workflow_limit' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

interface WorkflowLimits {
  maxWorkflows: number;
  maxActionsPerWorkflow: number;
  currentWorkflows: number;
  currentActions: number;
}

export const useAISecurityPosture = () => {
  const { user, profile } = useAuth();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [workflowLimits, setWorkflowLimits] = useState<WorkflowLimits>({
    maxWorkflows: 10,
    maxActionsPerWorkflow: 10,
    currentWorkflows: 0,
    currentActions: 0
  });
  const [isSecurityActive, setIsSecurityActive] = useState(true);

  // Monitor security events
  useEffect(() => {
    if (!user?.id || !profile?.company_id) return;

    const checkSecurityPosture = async () => {
      try {
        // For now, we'll use local state management since the database tables don't exist
        // In a real implementation, you would query actual workflow data
        
        // Simulate workflow monitoring
        const mockWorkflowCount = Math.floor(Math.random() * 8);
        const mockActionCount = Math.floor(Math.random() * 30);
        
        setWorkflowLimits(prev => ({
          ...prev,
          currentWorkflows: mockWorkflowCount,
          currentActions: mockActionCount
        }));

        // Check for limit violations
        if (mockWorkflowCount > workflowLimits.maxWorkflows) {
          addSecurityEvent({
            type: 'workflow_limit',
            severity: 'medium',
            message: `Workflow limit exceeded: ${mockWorkflowCount}/${workflowLimits.maxWorkflows}`
          });
        }

        // Monitor for suspicious activity (mock)
        if (mockActionCount > 50) {
          addSecurityEvent({
            type: 'suspicious_activity',
            severity: 'medium',
            message: `Unusually high AI interaction volume: ${mockActionCount} in 24h`
          });
        }

      } catch (error) {
        logger.error('Security posture check failed:', error);
        addSecurityEvent({
          type: 'api_misuse',
          severity: 'low',
          message: 'Security monitoring temporarily unavailable'
        });
      }
    };

    const interval = setInterval(checkSecurityPosture, 5 * 60 * 1000); // Check every 5 minutes
    checkSecurityPosture(); // Initial check

    return () => clearInterval(interval);
  }, [user?.id, profile?.company_id, workflowLimits.maxWorkflows]);

  const addSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      resolved: false
    };

    setSecurityEvents(prev => [newEvent, ...prev.slice(0, 49)]); // Keep last 50 events

    // Log to console for debugging
    logger.info('Security Event:', newEvent);
  };

  const encryptSensitiveData = (data: any): string => {
    // In production, use proper AES-256 encryption
    // For now, basic obfuscation for demo purposes
    try {
      const jsonString = JSON.stringify(data);
      return encodeBase64(jsonString);
    } catch {
      return 'encryption_failed';
    }
  };

  const obfuscateLog = (logEntry: any): any => {
    const obfuscated = { ...logEntry };
    
    // Remove or obfuscate sensitive fields
    if (obfuscated.email) obfuscated.email = obfuscated.email.replace(/(.{2}).*(@.*)/, '$1***$2');
    if (obfuscated.phone) obfuscated.phone = obfuscated.phone.replace(/(.{3}).*(.{2})/, '$1****$2');
    if (obfuscated.apiKey) obfuscated.apiKey = '***REDACTED***';
    
    return obfuscated;
  };

  const validateWorkflowLimits = (proposedActions: number = 1): boolean => {
    if (workflowLimits.currentWorkflows >= workflowLimits.maxWorkflows) {
      addSecurityEvent({
        type: 'workflow_limit',
        severity: 'medium',
        message: 'Maximum workflow limit reached. Please refine your request.'
      });
      return false;
    }

    if (workflowLimits.currentActions + proposedActions > workflowLimits.maxActionsPerWorkflow) {
      addSecurityEvent({
        type: 'workflow_limit',
        severity: 'medium',
        message: 'Maximum actions per workflow limit would be exceeded.'
      });
      return false;
    }

    return true;
  };

  const resolveSecurityEvent = (eventId: string) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, resolved: true } : event
      )
    );
  };

  const getSecurityStatus = (): 'secure' | 'warning' | 'critical' => {
    const unresolvedEvents = securityEvents.filter(e => !e.resolved);
    const criticalEvents = unresolvedEvents.filter(e => e.severity === 'critical');
    const highEvents = unresolvedEvents.filter(e => e.severity === 'high');

    if (criticalEvents.length > 0) return 'critical';
    if (highEvents.length > 0 || unresolvedEvents.length > 5) return 'warning';
    return 'secure';
  };

  return {
    securityEvents,
    workflowLimits,
    isSecurityActive,
    encryptSensitiveData,
    obfuscateLog,
    validateWorkflowLimits,
    resolveSecurityEvent,
    getSecurityStatus,
    addSecurityEvent
  };
};

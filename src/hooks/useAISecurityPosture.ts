
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControlService } from '@/services/security/accessControlService';
import { EncryptionService } from '@/services/security/encryptionService';
import { encodeBase64FromArrayBuffer, decodeBase64 } from '@/services/security/base64Service';
import { supabase } from '@/integrations/supabase/client';
import { SecurityEvent, SecurityIssue, SecurityPosture, WorkflowLimits } from '@/types/security';

export const useAISecurityPosture = () => {
  const { user, profile } = useAuth();
  const [securityPosture, setSecurityPosture] = useState<SecurityPosture>({
    score: 85,
    level: 'secure',
    issues: [],
    lastScan: null,
    isScanning: false
  });
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [workflowLimits] = useState<WorkflowLimits>({
    maxWorkflows: 50,
    currentWorkflows: 12,
    maxExecutionTime: 30000,
    maxMemoryUsage: 1024
  });

  useEffect(() => {
    if (user?.id && profile?.company_id) {
      refreshSecurityScore();
      loadSecurityEvents();
    }
  }, [user?.id, profile?.company_id]);

  const loadSecurityEvents = () => {
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'unusual_pattern',
        severity: 'medium',
        message: 'Unusual access pattern detected from new IP address',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resolved: false,
        source: '192.168.1.100',
        affectedResource: 'user_authentication'
      },
      {
        id: '2',
        type: 'rate_limit',
        severity: 'low',
        message: 'API rate limit approached for workflow automation',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        resolved: true,
        source: 'workflow_engine',
        affectedResource: 'api_gateway'
      }
    ];
    setSecurityEvents(mockEvents);
  };

  const refreshSecurityScore = async () => {
    setSecurityPosture(prev => ({ ...prev, isScanning: true }));
    
    try {
      let score = 100;
      const issues: SecurityIssue[] = [];
      
      // Simulate security checks
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check access control
      try {
        const accessControl = AccessControlService.getInstance();
        const hasProperAccess = await accessControl.checkPermission(user?.id || '', 'read', 'security_dashboard');
        
        if (!hasProperAccess) {
          score -= 15;
          issues.push({
            type: 'access_control',
            severity: 'high',
            message: 'Access control configuration needs review',
            description: 'Some security permissions may not be properly configured',
            recommendation: 'Review and update access control policies'
          });
        }
      } catch (error) {
        score -= 10;
        issues.push({
          type: 'access_control',
          severity: 'medium',
          message: 'Access control system unavailable',
          description: 'Unable to verify access control status',
          recommendation: 'Check access control service connectivity'
        });
      }
      
      // Check encryption
      try {
        const encryption = EncryptionService.getInstance();
        const testData = 'security-test';
        const encrypted = await encryption.encrypt(testData);
        const decrypted = await encryption.decrypt(encrypted);
        
        if (decrypted !== testData) {
          score -= 20;
          issues.push({
            type: 'encryption',
            severity: 'critical',
            message: 'Encryption system integrity compromised',
            description: 'Data encryption/decryption is not working correctly',
            recommendation: 'Immediate review of encryption implementation required'
          });
        }
      } catch (error) {
        score -= 15;
        issues.push({
          type: 'encryption',
          severity: 'high',
          message: 'Encryption service error',
          description: 'Unable to verify encryption functionality',
          recommendation: 'Check encryption service configuration'
        });
      }
      
      // Check data integrity
      try {
        const testBuffer = new TextEncoder().encode('integrity-test');
        const encoded = encodeBase64FromArrayBuffer(testBuffer.buffer);
        const decoded = decodeBase64(encoded);
        
        if (!decoded || decoded.length !== testBuffer.length) {
          score -= 10;
          issues.push({
            type: 'data_integrity',
            severity: 'medium',
            message: 'Data integrity check failed',
            description: 'Base64 encoding/decoding may have issues',
            recommendation: 'Review data processing pipeline'
          });
        }
      } catch (error) {
        score -= 5;
        issues.push({
          type: 'data_integrity',
          severity: 'low',
          message: 'Data integrity check inconclusive',
          description: 'Unable to complete data integrity verification',
          recommendation: 'Monitor data processing for anomalies'
        });
      }
      
      const level: SecurityPosture['level'] = score >= 90 ? 'secure' : score >= 70 ? 'warning' : 'critical';
      
      setSecurityPosture({
        score: Math.max(0, score),
        level,
        issues,
        lastScan: new Date(),
        isScanning: false
      });
      
      setSecurityIssues(issues);
      
    } catch (error) {
      console.error('Security scan error:', error);
      setSecurityPosture(prev => ({
        ...prev,
        isScanning: false,
        score: 0,
        level: 'critical',
        issues: [{
          type: 'authentication',
          severity: 'critical',
          message: 'Security scan failed',
          description: 'Unable to complete security assessment',
          recommendation: 'Contact system administrator'
        }]
      }));
    }
  };

  const getSecurityStatus = (): string => {
    if (securityPosture.score >= 90) return 'secure';
    if (securityPosture.score >= 70) return 'warning';
    return 'critical';
  };

  const resolveSecurityEvent = (eventId: string) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, resolved: true } : event
      )
    );
  };

  const validateWorkflowLimits = () => {
    return workflowLimits.currentWorkflows < workflowLimits.maxWorkflows;
  };

  return {
    securityPosture,
    securityIssues,
    securityEvents,
    workflowLimits,
    refreshSecurityScore,
    getSecurityStatus,
    resolveSecurityEvent,
    validateWorkflowLimits
  };
};

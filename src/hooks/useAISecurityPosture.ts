import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControlService } from '@/services/security/accessControlService';
import { EncryptionService } from '@/services/security/encryptionService';
import { base64Service } from '@/services/security/base64Service';
import { supabase } from '@/integrations/supabase/client';

interface SecurityIssue {
  type: string;
  severity: 'high' | 'medium' | 'low' | 'critical';
  description: string;
  recommendation: string;
}

interface SecurityPosture {
  score: number;
  issues: SecurityIssue[];
  lastScan: Date | null;
  isScanning: boolean;
}

export const useAISecurityPosture = () => {
  const { user, profile } = useAuth();
  const [securityPosture, setSecurityPosture] = useState<SecurityPosture>({
    score: 100,
    issues: [],
    lastScan: null,
    isScanning: false
  });
  const [securityIssues, setSecurityIssues] = useState<SecurityIssue[]>([]);

  useEffect(() => {
    if (user?.id && profile?.company_id) {
      refreshSecurityScore();
    }
  }, [user?.id, profile?.company_id]);

  const refreshSecurityScore = async () => {
    setSecurityPosture(prev => ({ ...prev, isScanning: true }));
    try {
      const score = await calculateSecurityScore();
      setSecurityPosture(prev => ({
        ...prev,
        score,
        lastScan: new Date(),
        isScanning: false
      }));
    } catch (error) {
      console.error('Failed to refresh security score:', error);
      setSecurityPosture(prev => ({ ...prev, isScanning: false }));
    }
  };

  const calculateSecurityScore = async (): Promise<number> => {
    try {
      let score = 100;
      const issues: SecurityIssue[] = [];

      // Check encryption status
      try {
        const testData = 'security-test-data';
        const encrypted = await EncryptionService.encryptSensitiveData(testData);
        const decrypted = await EncryptionService.decryptSensitiveData(encrypted);
        
        if (decrypted !== testData) {
          score -= 20;
          issues.push({
            type: 'encryption',
            severity: 'high',
            description: 'Encryption/decryption cycle failed',
            recommendation: 'Review encryption service configuration'
          });
        }
      } catch (error) {
        score -= 25;
        issues.push({
          type: 'encryption',
          severity: 'critical',
          description: 'Encryption service unavailable',
          recommendation: 'Restart encryption service and verify keys'
        });
      }

      // Check access control
      try {
        const hasAccess = await AccessControlService.checkAccess('test_resource', 'read', 'sales_rep');
        if (typeof hasAccess !== 'boolean') {
          score -= 15;
          issues.push({
            type: 'access_control',
            severity: 'medium',
            description: 'Access control service returning invalid responses',
            recommendation: 'Review access control service implementation'
          });
        }
      } catch (error) {
        score -= 20;
        issues.push({
          type: 'access_control',
          severity: 'high',
          description: 'Access control service error',
          recommendation: 'Check access control service configuration'
        });
      }

      // Check data integrity
      try {
        const testBuffer = new TextEncoder().encode('integrity-test');
        const encoded = base64Service.encodeBase64FromArrayBuffer(testBuffer.buffer);
        const decoded = base64Service.decodeBase64(encoded);
        
        if (!decoded || decoded.byteLength !== testBuffer.length) {
          score -= 10;
          issues.push({
            type: 'data_integrity',
            severity: 'medium',
            description: 'Data encoding/decoding inconsistency',
            recommendation: 'Verify base64 service implementation'
          });
        }
      } catch (error) {
        score -= 15;
        issues.push({
          type: 'data_integrity',
          severity: 'high',
          description: 'Data integrity check failed',
          recommendation: 'Review data processing pipeline'
        });
      }

      setSecurityIssues(issues);
      return Math.max(0, score);

    } catch (error) {
      console.error('Security score calculation failed:', error);
      return 0;
    }
  };

  return {
    securityPosture,
    securityIssues,
    refreshSecurityScore
  };
};

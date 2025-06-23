
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { nativeAutomationEngine } from '@/services/ai/automationEngine';
import { emailAutomationService } from '@/services/ai/emailAutomationService';
import { industryTemplateService } from '@/services/ai/industryTemplates';
import { AutomationFlow, AutomationResult, EmailTemplate } from '@/services/ai/types/automationTypes';

// Simple logger for client-side
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  }
};

export const useNativeAutomation = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  const createAutomationFlow = useCallback(async (
    flow: Omit<AutomationFlow, 'id' | 'createdBy' | 'companyId'>
  ): Promise<AutomationResult> => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return { success: false, message: 'Authentication required' };
    }

    setIsLoading(true);
    try {
      const result = await nativeAutomationEngine.createAutomationFlow({
        ...flow,
        companyId: profile.company_id,
        createdBy: user.id
      });

      if (result.success) {
        toast.success('Automation flow created successfully');
      } else {
        toast.error(result.message);
      }

      return result;
    } catch (error) {
      const message = 'Failed to create automation flow';
      toast.error(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profile?.company_id]);

  const createEmailTemplate = useCallback(async (
    template: Omit<EmailTemplate, 'id' | 'companyId'>
  ): Promise<EmailTemplate | null> => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return null;
    }

    setIsLoading(true);
    try {
      const templateWithCompany: Omit<EmailTemplate, 'id'> = {
        ...template,
        companyId: profile.company_id
      };

      const result = await emailAutomationService.createEmailTemplate(templateWithCompany);

      toast.success('Email template created successfully');
      return result;
    } catch (error) {
      toast.error('Failed to create email template');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profile?.company_id]);

  const setupIndustryTemplates = useCallback(async (industry: string): Promise<void> => {
    if (!user?.id || !profile?.company_id) {
      toast.error('Authentication required');
      return;
    }

    setIsLoading(true);
    try {
      await industryTemplateService.setupIndustryTemplates(
        industry,
        profile.company_id,
        user.id
      );

      toast.success(`${industry} templates setup successfully`);
    } catch (error) {
      toast.error('Failed to setup industry templates');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profile?.company_id]);

  const triggerAutomation = useCallback(async (
    trigger: string,
    eventData: Record<string, any>
  ): Promise<void> => {
    if (!user?.id || !profile?.company_id) {
      return;
    }

    try {
      const enrichedEventData = {
        ...eventData,
        userId: user.id,
        companyId: profile.company_id,
        timestamp: new Date().toISOString()
      };

      await emailAutomationService.evaluateAutomationTriggers(trigger, enrichedEventData);
    } catch (error) {
      logger.error('Error triggering automation:', error);
    }
  }, [user?.id, profile?.company_id]);

  const getAvailableIndustries = useCallback(() => {
    return industryTemplateService.getAvailableIndustries();
  }, []);

  const getIndustryTemplates = useCallback((industry: string) => {
    return industryTemplateService.getTemplatesForIndustry(industry);
  }, []);

  const getIndustryFlows = useCallback((industry: string) => {
    return industryTemplateService.getFlowsForIndustry(industry);
  }, []);

  return {
    isLoading,
    flows,
    templates,
    createAutomationFlow,
    createEmailTemplate,
    setupIndustryTemplates,
    triggerAutomation,
    getAvailableIndustries,
    getIndustryTemplates,
    getIndustryFlows
  };
};

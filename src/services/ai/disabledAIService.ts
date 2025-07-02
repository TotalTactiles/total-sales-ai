
import { aiConfig, generateMockAIResponse, getMockAIMetrics } from '@/config/ai';
import { logger } from '@/utils/logger';

export class DisabledAIService {
  private static instance: DisabledAIService;

  static getInstance(): DisabledAIService {
    if (!DisabledAIService.instance) {
      DisabledAIService.instance = new DisabledAIService();
    }
    return DisabledAIService.instance;
  }

  async generateResponse(prompt: string, context?: any): Promise<string> {
    logger.info('AI Service (Disabled): Mock response generated', { prompt: prompt.substring(0, 50) });
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    return generateMockAIResponse('generic', context);
  }

  async generateSalesResponse(prompt: string, context?: any): Promise<string> {
    logger.info('AI Sales Service (Disabled): Mock response generated', { prompt: prompt.substring(0, 50) });
    
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    return generateMockAIResponse('sales', context);
  }

  async generateManagerResponse(prompt: string, context?: any): Promise<string> {
    logger.info('AI Manager Service (Disabled): Mock response generated', { prompt: prompt.substring(0, 50) });
    
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));
    
    return generateMockAIResponse('manager', context);
  }

  async executeAutomation(workflowId: string, data: any): Promise<any> {
    logger.info('AI Automation (Disabled): Mock automation executed', { workflowId });
    
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    return {
      success: true,
      executionId: `mock_${Date.now()}`,
      message: generateMockAIResponse('automation'),
      data: {
        processed: true,
        timestamp: new Date().toISOString(),
        metrics: getMockAIMetrics()
      }
    };
  }

  async analyzeLeadScore(leadData: any): Promise<number> {
    logger.info('AI Lead Scoring (Disabled): Mock score generated', { leadId: leadData.id });
    
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    
    // Generate realistic lead scores based on mock data
    const baseScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
    return Math.min(100, baseScore);
  }

  async generateEmailDraft(recipientData: any, context?: any): Promise<string> {
    logger.info('AI Email Draft (Disabled): Mock email generated', { recipient: recipientData.name });
    
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const templates = [
      `Hi ${recipientData.name},\n\nI hope this email finds you well. Based on our previous conversation, I wanted to follow up on the solutions we discussed for ${recipientData.company}.\n\nI believe our platform could significantly impact your team's efficiency. Would you be available for a brief call this week to explore this further?\n\nBest regards,\n[Your Name]`,
      `Hello ${recipientData.name},\n\nThank you for your interest in our services. I've prepared a customized proposal that addresses the specific challenges you mentioned for ${recipientData.company}.\n\nI'd love to walk you through the details and answer any questions you might have. Are you available for a 15-minute call tomorrow?\n\nLooking forward to hearing from you,\n[Your Name]`,
      `Hi ${recipientData.name},\n\nI wanted to reach out regarding the ROI analysis we discussed. After reviewing ${recipientData.company}'s requirements, I'm confident we can deliver the 20% efficiency improvement you're looking for.\n\nShall we schedule a demo to show you exactly how this would work?\n\nBest,\n[Your Name]`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  async generateCallScript(leadData: any, callType: string): Promise<string> {
    logger.info('AI Call Script (Disabled): Mock script generated', { leadId: leadData.id, callType });
    
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    
    const scripts = {
      cold: `Opening: "Hi ${leadData.name}, this is [Your Name] from [Company]. I know you're busy, so I'll be brief. I noticed ${leadData.company} is in the [industry] space, and we've been helping similar companies increase their efficiency by 25%. Do you have 30 seconds for me to explain how?"`,
      follow_up: `Opening: "Hi ${leadData.name}, thanks for taking my call. I wanted to follow up on our conversation about [previous topic]. I've done some research on ${leadData.company}'s challenges and have some specific ideas that might interest you."`,
      demo: `Opening: "Hi ${leadData.name}, I'm excited to show you how our solution can address the specific requirements you mentioned for ${leadData.company}. I've prepared a customized demo that should take about 15 minutes. Shall we get started?"`
    };
    
    return scripts[callType as keyof typeof scripts] || scripts.cold;
  }

  getMetrics() {
    return getMockAIMetrics();
  }

  isEnabled(): boolean {
    return aiConfig.enabled;
  }

  getConfig() {
    return aiConfig;
  }
}

export const disabledAIService = DisabledAIService.getInstance();

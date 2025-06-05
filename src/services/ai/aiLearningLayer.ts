import { logger } from '@/utils/logger';

import { supabase } from '@/integrations/supabase/client';
import { dataEncryptionService } from '../security/dataEncryptionService';
import { parseImprovementSuggestions } from './improvementParser';

interface LearningData {
  id: string;
  userId: string;
  companyId: string;
  dataType: 'user_interaction' | 'ai_output' | 'system_metric' | 'market_signal';
  content: any;
  timestamp: Date;
  source: string;
  confidence: number;
}

interface AIImprovement {
  id: string;
  category: 'ux_ui' | 'feature_priority' | 'automation_flow' | 'system_performance';
  suggestion: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  implementationComplexity: 'simple' | 'moderate' | 'complex';
  estimatedValue: number;
  confidence: number;
  generatedBy: 'claude' | 'chatgpt' | 'hybrid';
  companyId: string;
  timestamp: Date;
}

export class AILearningLayer {
  private static instance: AILearningLayer;
  private learningBuffer: LearningData[] = [];
  private improvementCache: AIImprovement[] = [];

  static getInstance(): AILearningLayer {
    if (!AILearningLayer.instance) {
      AILearningLayer.instance = new AILearningLayer();
      // Start background processing
      setInterval(() => {
        AILearningLayer.instance.processLearningBuffer();
      }, 30000); // Process every 30 seconds
    }
    return AILearningLayer.instance;
  }

  async ingestLearningData(data: Omit<LearningData, 'id' | 'timestamp'>): Promise<void> {
    const learningData: LearningData = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };

    // Encrypt sensitive content
    if (data.dataType === 'user_interaction' || data.dataType === 'ai_output') {
      learningData.content = await dataEncryptionService.encryptSensitiveData(data.content);
    }

    this.learningBuffer.push(learningData);

    // Store in database for persistence
    try {
      await supabase.from('ai_brain_logs').insert({
        type: 'learning_data',
        event_summary: `${data.dataType} from ${data.source}`,
        payload: {
          learningData: {
            dataType: data.dataType,
            source: data.source,
            confidence: data.confidence,
            userId: data.userId,
            timestamp: learningData.timestamp.toISOString()
          }
        },
        company_id: data.companyId,
        visibility: 'admin_only'
      });
    } catch (error) {
      logger.error('Failed to store learning data:', error);
    }
  }

  private async processLearningBuffer(): Promise<void> {
    if (this.learningBuffer.length === 0) return;

    const batchToProcess = this.learningBuffer.splice(0, 50); // Process in batches
    
    try {
      // Group by company for better analysis
      const companiesData = this.groupByCompany(batchToProcess);
      
      for (const [companyId, companyData] of companiesData.entries()) {
        await this.generateImprovements(companyId, companyData);
      }
    } catch (error) {
      logger.error('Error processing learning buffer:', error);
    }
  }

  private groupByCompany(data: LearningData[]): Map<string, LearningData[]> {
    const grouped = new Map<string, LearningData[]>();
    
    for (const item of data) {
      if (!grouped.has(item.companyId)) {
        grouped.set(item.companyId, []);
      }
      grouped.get(item.companyId)!.push(item);
    }
    
    return grouped;
  }

  private async generateImprovements(companyId: string, data: LearningData[]): Promise<void> {
    try {
      // Analyze patterns and generate improvements using Claude
      const { claudeAIService } = await import('./claudeAIService');
      
      const analysisData = data.map(d => ({
        type: d.dataType,
        source: d.source,
        confidence: d.confidence,
        timestamp: d.timestamp
      }));

      const response = await claudeAIService.analyzePatterns(
        analysisData,
        `Company ${companyId} system improvement analysis`
      );

      // Parse Claude's response to extract structured improvements
      const parsed = parseImprovementSuggestions(response.response);
      const improvements: AIImprovement[] = parsed.map((imp) => ({
        id: crypto.randomUUID(),
        generatedBy: 'claude',
        companyId,
        timestamp: new Date(),
        ...imp
      }));
      
      this.improvementCache.push(...improvements);
      
      // Store improvements in database
      for (const improvement of improvements) {
        await supabase.from('ai_brain_insights').insert({
          type: 'system_improvement',
          company_id: companyId,
          context: {
            category: improvement.category,
            suggestion: improvement.suggestion,
            impact: improvement.impact,
            complexity: improvement.implementationComplexity,
            estimatedValue: improvement.estimatedValue,
            confidence: improvement.confidence,
            generatedBy: improvement.generatedBy
          },
          triggered_by: 'ai_learning_layer'
        });
      }
    } catch (error) {
      logger.error('Failed to generate improvements for company:', companyId, error);
    }
  }


  async getCompanyImprovements(companyId: string): Promise<AIImprovement[]> {
    return this.improvementCache.filter(improvement => 
      improvement.companyId === companyId
    ).sort((a, b) => b.estimatedValue - a.estimatedValue);
  }

  async markImprovementAsImplemented(improvementId: string): Promise<void> {
    this.improvementCache = this.improvementCache.filter(
      improvement => improvement.id !== improvementId
    );
    
    // Update database
    try {
      await supabase
        .from('ai_brain_insights')
        .update({ accepted: true })
        .eq('id', improvementId);
    } catch (error) {
      logger.error('Failed to mark improvement as implemented:', error);
    }
  }
}

export const aiLearningLayer = AILearningLayer.getInstance();

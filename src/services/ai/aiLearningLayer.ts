
import { supabase } from '@/integrations/supabase/client';
import { dataEncryptionService } from '../security/dataEncryptionService';

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
      console.error('Failed to store learning data:', error);
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
      console.error('Error processing learning buffer:', error);
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
      const improvements = this.parseImprovementSuggestions(response.response, companyId);
      
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
      console.error('Failed to generate improvements for company:', companyId, error);
    }
  }

  private parseImprovementSuggestions(response: string, companyId: string): AIImprovement[] {
    // Parse Claude's response to extract structured improvement suggestions
    const improvements: AIImprovement[] = [];
    
    try {
      // Look for structured patterns in Claude's response
      const lines = response.split('\n');
      let currentCategory: any = null;
      let currentSuggestion = '';
      
      for (const line of lines) {
        if (line.includes('UX/UI') || line.includes('User Experience')) {
          currentCategory = 'ux_ui';
        } else if (line.includes('Feature') || line.includes('Priority')) {
          currentCategory = 'feature_priority';
        } else if (line.includes('Automation') || line.includes('Workflow')) {
          currentCategory = 'automation_flow';
        } else if (line.includes('Performance') || line.includes('System')) {
          currentCategory = 'system_performance';
        } else if (line.trim() && currentCategory) {
          currentSuggestion += line.trim() + ' ';
          
          // If we have enough content, create an improvement
          if (currentSuggestion.length > 50) {
            improvements.push({
              id: crypto.randomUUID(),
              category: currentCategory,
              suggestion: currentSuggestion.trim(),
              impact: this.estimateImpact(currentSuggestion),
              implementationComplexity: this.estimateComplexity(currentSuggestion),
              estimatedValue: this.estimateValue(currentSuggestion),
              confidence: 0.75,
              generatedBy: 'claude',
              companyId,
              timestamp: new Date()
            });
            
            currentSuggestion = '';
          }
        }
      }
    } catch (error) {
      console.error('Error parsing improvement suggestions:', error);
    }
    
    return improvements;
  }

  private estimateImpact(suggestion: string): 'low' | 'medium' | 'high' | 'critical' {
    const highImpactKeywords = ['conversion', 'revenue', 'critical', 'major', 'significant'];
    const mediumImpactKeywords = ['improve', 'enhance', 'optimize', 'better'];
    
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (highImpactKeywords.some(keyword => lowerSuggestion.includes(keyword))) {
      return 'high';
    } else if (mediumImpactKeywords.some(keyword => lowerSuggestion.includes(keyword))) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private estimateComplexity(suggestion: string): 'simple' | 'moderate' | 'complex' {
    const complexKeywords = ['architecture', 'rebuild', 'major refactor', 'database'];
    const moderateKeywords = ['integrate', 'implement', 'add feature', 'modify'];
    
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (complexKeywords.some(keyword => lowerSuggestion.includes(keyword))) {
      return 'complex';
    } else if (moderateKeywords.some(keyword => lowerSuggestion.includes(keyword))) {
      return 'moderate';
    } else {
      return 'simple';
    }
  }

  private estimateValue(suggestion: string): number {
    // Simple heuristic to estimate value (0-100)
    let value = 50; // Base value
    
    const valueKeywords = {
      'conversion': 30,
      'revenue': 35,
      'efficiency': 20,
      'user experience': 25,
      'automation': 25,
      'performance': 15
    };
    
    const lowerSuggestion = suggestion.toLowerCase();
    
    for (const [keyword, points] of Object.entries(valueKeywords)) {
      if (lowerSuggestion.includes(keyword)) {
        value += points;
      }
    }
    
    return Math.min(value, 100);
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
      console.error('Failed to mark improvement as implemented:', error);
    }
  }
}

export const aiLearningLayer = AILearningLayer.getInstance();

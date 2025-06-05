export interface ParsedImprovement {
  category: 'ux_ui' | 'feature_priority' | 'automation_flow' | 'system_performance';
  suggestion: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  implementationComplexity: 'simple' | 'moderate' | 'complex';
  estimatedValue: number;
  confidence: number;
}

export function parseImprovementSuggestions(response: string): ParsedImprovement[] {
  const improvements: ParsedImprovement[] = [];
  try {
    const lines = response.split('\n');
    let currentCategory: ParsedImprovement['category'] | null = null;
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
        if (currentSuggestion.length > 50) {
          improvements.push({
            category: currentCategory,
            suggestion: currentSuggestion.trim(),
            impact: estimateImpact(currentSuggestion),
            implementationComplexity: estimateComplexity(currentSuggestion),
            estimatedValue: estimateValue(currentSuggestion),
            confidence: 0.75
          });
          currentSuggestion = '';
        }
      }
    }

    if (currentSuggestion.trim() && currentCategory) {
      improvements.push({
        category: currentCategory,
        suggestion: currentSuggestion.trim(),
        impact: estimateImpact(currentSuggestion),
        implementationComplexity: estimateComplexity(currentSuggestion),
        estimatedValue: estimateValue(currentSuggestion),
        confidence: 0.75
      });
    }
  } catch (error) {
    console.error('Error parsing improvement suggestions:', error);
  }
  return improvements;
}

function estimateImpact(suggestion: string): ParsedImprovement['impact'] {
  const highImpactKeywords = ['conversion', 'revenue', 'critical', 'major', 'significant'];
  const mediumImpactKeywords = ['improve', 'enhance', 'optimize', 'better'];
  const lowerSuggestion = suggestion.toLowerCase();
  if (highImpactKeywords.some(keyword => lowerSuggestion.includes(keyword))) {
    return 'high';
  }
  if (mediumImpactKeywords.some(keyword => lowerSuggestion.includes(keyword))) {
    return 'medium';
  }
  return 'low';
}

function estimateComplexity(suggestion: string): ParsedImprovement['implementationComplexity'] {
  const complexKeywords = ['architecture', 'rebuild', 'major refactor', 'database'];
  const moderateKeywords = ['integrate', 'implement', 'add feature', 'modify'];
  const lowerSuggestion = suggestion.toLowerCase();
  if (complexKeywords.some(keyword => lowerSuggestion.includes(keyword))) {
    return 'complex';
  }
  if (moderateKeywords.some(keyword => lowerSuggestion.includes(keyword))) {
    return 'moderate';
  }
  return 'simple';
}

function estimateValue(suggestion: string): number {
  let value = 50;
  const valueKeywords: Record<string, number> = {
    conversion: 30,
    revenue: 35,
    efficiency: 20,
    'user experience': 25,
    automation: 25,
    performance: 15
  };
  const lowerSuggestion = suggestion.toLowerCase();
  for (const [keyword, points] of Object.entries(valueKeywords)) {
    if (lowerSuggestion.includes(keyword)) {
      value += points;
    }
  }
  return Math.min(value, 100);
}

import { describe, it, expect } from 'vitest';
import { parseImprovementSuggestions } from '../src/services/ai/improvementParser';

describe('parseImprovementSuggestions', () => {
  it('captures trailing suggestion shorter than threshold', () => {
    const response = 'UX/UI\nImprove the login page.';
    const result = parseImprovementSuggestions(response);
    expect(result).toEqual([
      {
        category: 'ux_ui',
        suggestion: 'Improve the login page.',
        impact: 'medium',
        implementationComplexity: 'simple',
        estimatedValue: 50,
        confidence: 0.75
      }
    ]);
  });
});

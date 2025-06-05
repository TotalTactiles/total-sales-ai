import test from 'node:test';
import assert from 'node:assert';
import { parseImprovementSuggestions } from '../src/services/ai/improvementParser.js';

const response = `Here are your recommendations:\n\n\`\`\`json\n{
  "improvements": [
    {
      "category": "ux_ui",
      "suggestion": "Improve onboarding flow",
      "impact": "high",
      "implementationComplexity": "moderate",
      "estimatedValue": 80,
      "confidence": 0.9
    },
    {
      "category": "automation_flow",
      "suggestion": "Automate lead assignment using rules",
      "impact": "medium",
      "implementationComplexity": "simple",
      "estimatedValue": 60,
      "confidence": 0.8
    }
  ]
}
\`\`\``;

test('parseImprovementSuggestions extracts JSON improvements', () => {
  const improvements = parseImprovementSuggestions(response);
  assert.strictEqual(improvements.length, 2);
  assert.strictEqual(improvements[0].category, 'ux_ui');
  assert.strictEqual(improvements[1].category, 'automation_flow');
});

export function parseImprovementSuggestions(response) {
  const improvements = [];

  try {
    let jsonString = '';
    const fenced = response.match(/```json\s*([\s\S]*?)```/i);
    if (fenced) {
      jsonString = fenced[1];
    } else {
      const match = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        jsonString = match[0];
      } else {
        jsonString = response;
      }
    }

    const parsed = JSON.parse(jsonString.trim());
    const items = Array.isArray(parsed) ? parsed : parsed.improvements;

    if (Array.isArray(items)) {
      for (const item of items) {
        if (!item.suggestion) continue;
        improvements.push({
          category: item.category,
          suggestion: item.suggestion,
          impact: item.impact,
          implementationComplexity: item.implementationComplexity || item.complexity,
          estimatedValue: item.estimatedValue,
          confidence: item.confidence
        });
      }
    }
  } catch (error) {
    console.error('Error parsing improvement suggestions:', error);
  }

  return improvements;
}

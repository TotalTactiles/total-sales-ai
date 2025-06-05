import { expect, test } from 'bun:test';
import { aiLearningLayer } from '../src/services/ai/aiLearningLayer';

const parse = aiLearningLayer["parseImprovementSuggestions"].bind(aiLearningLayer);

test('plain JSON object without code fences', () => {
  const response = '{"improvements": [{"category":"ux_ui","suggestion":"Improve navigation structure so users find key pages faster, boosting overall conversion rates significantly.","impact":"high","implementationComplexity":"moderate","estimatedValue":80}]}';
  const result = parse(response, 'company1');
  expect(result.length).toBe(1);
  expect(result[0].category).toBe('ux_ui');
});

test('array of improvements only', () => {
  const response = '[{"category":"feature_priority","suggestion":"Add analytics dashboard to track metrics which helps refine future features effectively.","impact":"medium","implementationComplexity":"complex","estimatedValue":60}]';
  const result = parse(response, 'company2');
  expect(result.length).toBe(1);
  expect(result[0].category).toBe('feature_priority');
});

test('invalid JSON results in empty array', () => {
  const response = '{ invalid json';
  const result = parse(response, 'company3');
  expect(result).toEqual([]);
});

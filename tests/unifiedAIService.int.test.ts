import { describe, it, expect, beforeEach, vi } from 'vitest';

var invokeMock: any;

vi.mock('@/integrations/supabase/client', () => {
  invokeMock = vi.fn();
  return { supabase: { functions: { invoke: invokeMock } } };
});

import { unifiedAIService } from '@/services/ai/unifiedAIService';

describe('unifiedAIService integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns chatgpt response when available', async () => {
    invokeMock.mockImplementation(async (fn) => {
      if (fn === 'openai-chat') return { data: { response: 'chat' } } as any;
      throw new Error('unused');
    });
    const res = await unifiedAIService.generateResponse('hello');
    expect(res.response).toBe('chat');
    expect(res.source).toBe('chatgpt');
  });

  it('falls back to claude when chatgpt fails', async () => {
    invokeMock.mockImplementation(async (fn) => {
      if (fn === 'openai-chat') throw new Error('fail');
      if (fn === 'claude-chat') return { data: { response: 'claude' } } as any;
    });
    const res = await unifiedAIService.generateResponse('hello');
    expect(res.response).toBe('claude');
    expect(res.source).toBe('claude');
  });

  it('falls back to mock when all fail', async () => {
    invokeMock.mockRejectedValue(new Error('fail'));
    const res = await unifiedAIService.generateResponse('hello', undefined, undefined, 'openai');
    expect(res.source).toBe('mock');
  });
});

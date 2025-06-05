import { describe, it, expect, beforeEach, vi } from 'vitest';

var invokeMock: any;
var insertMock: any;
var fromMock: any;

vi.mock('@/integrations/supabase/client', () => {
  invokeMock = vi.fn();
  insertMock = vi.fn();
  fromMock = vi.fn(() => ({ insert: insertMock }));
  return { supabase: { functions: { invoke: invokeMock }, from: fromMock } };
});

import { ActionExecutors } from '@/services/ai/automation/actionExecutors';
const executors = new ActionExecutors();

const baseAction = { id: '1', type: 'email', content: 'Hi {{name}}' } as any;
const context = { email: 'test@example.com', name: 'Tester', leadId: 'l1', leadName: 'Tester' };

describe('ActionExecutors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('executeEmailAction succeeds on supabase success', async () => {
    invokeMock.mockResolvedValue({ data: { success: true, messageId: 'm1' } });
    const result = await executors.executeEmailAction(baseAction, context, 'u1', 'c1');
    expect(invokeMock).toHaveBeenCalledWith('gmail-send', expect.anything());
    expect(result).toEqual({ success: true, message: 'Email sent successfully', data: { messageId: 'm1' } });
  });

  it('executeEmailAction handles errors', async () => {
    invokeMock.mockRejectedValue(new Error('fail'));
    const result = await executors.executeEmailAction(baseAction, context, 'u1', 'c1');
    expect(result.success).toBe(false);
    expect(result.message).toContain('fail');
  });

  it('executeTaskAction inserts notification', async () => {
    insertMock.mockResolvedValue({ error: null });
    const taskAction = { id: '2', type: 'task', content: 'Do it', metadata: { priority: 'high' } } as any;
    const result = await executors.executeTaskAction(taskAction, context, 'u1', 'c1');
    expect(fromMock).toHaveBeenCalledWith('notifications');
    expect(insertMock).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });
});

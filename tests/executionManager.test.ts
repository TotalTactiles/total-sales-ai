import { describe, it, expect, beforeEach, vi } from 'vitest';

var insertMock: any;
var updateMock: any;
var builder: any;
var fromMock: any;

vi.mock('@/integrations/supabase/client', () => {
  insertMock = vi.fn().mockReturnThis();
  updateMock = vi.fn().mockReturnThis();
  builder = {
    insert: insertMock,
    update: updateMock,
    select: vi.fn().mockReturnThis(),
    single: vi.fn(),
    eq: vi.fn().mockReturnThis()
  };
  fromMock = vi.fn(() => builder);
  return { supabase: { from: fromMock, functions: { invoke: vi.fn() } } };
});

var emailMock: any;
vi.mock('@/services/ai/automation/actionExecutors', () => {
  emailMock = vi.fn();
  return { actionExecutors: { executeEmailAction: emailMock } };
});

import { ExecutionManager } from '@/services/ai/automation/executionManager';
const manager = new ExecutionManager();

const action = { id: 'a1', type: 'email', content: 'Hi' } as any;
const context = { email: 't@e.com', leadId: 'l1', leadName: 'Tester' };

describe('ExecutionManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createExecution inserts execution log and returns id', async () => {
    builder.single.mockResolvedValue({ data: { id: 'e1' }, error: null });
    const id = await manager.createExecution({
      flowId: 'f1',
      leadId: 'l1',
      userId: 'u1',
      companyId: 'c1',
      status: 'pending',
      currentActionIndex: 0,
      startedAt: new Date(),
      logs: []
    });
    expect(fromMock).toHaveBeenCalledWith('ai_brain_logs');
    expect(id).toBe('e1');
  });

  it('executeActions runs actions and completes', async () => {
    emailMock.mockResolvedValue({ success: true, message: 'ok' });
    const result = await manager.executeActions('e1', [action], context, 'u1', 'c1');
    expect(emailMock).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it('executeAction returns failure for unknown type', async () => {
    // @ts-ignore
    const res = await manager['executeAction']({ id: 'x', type: 'weird' } as any, context, 'u1', 'c1');
    expect(res.success).toBe(false);
    expect(res.message).toContain('Unknown action type');
    expect(emailMock).not.toHaveBeenCalled();
  });
});

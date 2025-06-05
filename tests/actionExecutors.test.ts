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

  it('executeSmsAction skips when no phone', async () => {
    const smsAction = { id: '3', type: 'sms', content: 'Ping' } as any;
    const res = await executors.executeSmsAction(smsAction, {}, 'u1', 'c1');
    expect(res.success).toBe(false);
    expect(res.message).toContain('No phone');
  });

  it('executeSmsAction sends sms on success', async () => {
    invokeMock.mockResolvedValue({ data: { messageId: 's1' } });
    const smsAction = { id: '3', type: 'sms', content: 'Ping' } as any;
    const res = await executors.executeSmsAction(smsAction, { ...context, phone: '+123' }, 'u1', 'c1');
    expect(invokeMock).toHaveBeenCalledWith('twilio-sms', expect.anything());
    expect(res.success).toBe(true);
  });

  it('executeNoteAction succeeds', async () => {
    insertMock.mockResolvedValue({ error: null });
    const noteAction = { id: '4', type: 'note', content: 'note' } as any;
    const res = await executors.executeNoteAction(noteAction, context, 'u1', 'c1');
    expect(fromMock).toHaveBeenCalledWith('ai_brain_logs');
    expect(res.success).toBe(true);
  });

  it('executeNoteAction handles failure', async () => {
    insertMock.mockResolvedValue({ error: new Error('fail') });
    const noteAction = { id: '4', type: 'note', content: 'note' } as any;
    const res = await executors.executeNoteAction(noteAction, context, 'u1', 'c1');
    expect(res.success).toBe(false);
  });

  it('executeCallAction skips when no phone', async () => {
    const callAction = { id: '5', type: 'call', content: 'call' } as any;
    const res = await executors.executeCallAction(callAction, context, 'u1', 'c1');
    expect(res.success).toBe(false);
  });

  it('executeCallAction creates reminder', async () => {
    insertMock.mockResolvedValue({ error: null });
    const callAction = { id: '5', type: 'call', content: 'call' } as any;
    const res = await executors.executeCallAction(callAction, { ...context, phone: '+123' }, 'u1', 'c1');
    expect(res.success).toBe(true);
  });

  it('executeCalendarAction succeeds', async () => {
    invokeMock.mockResolvedValue({ data: { eventId: 'e1' } });
    const calAction = { id: '6', type: 'calendar', content: 'meet' } as any;
    const res = await executors.executeCalendarAction(calAction, context, 'u1', 'c1');
    expect(invokeMock).toHaveBeenCalledWith('google-calendar', expect.anything());
    expect(res.success).toBe(true);
  });

  it('executeCalendarAction handles errors', async () => {
    invokeMock.mockRejectedValue(new Error('fail'));
    const calAction = { id: '6', type: 'calendar', content: 'meet' } as any;
    const res = await executors.executeCalendarAction(calAction, context, 'u1', 'c1');
    expect(res.success).toBe(false);
  });
});

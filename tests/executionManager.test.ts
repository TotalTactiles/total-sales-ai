import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutionManager } from '../src/services/ai/automation/executionManager';
import { actionExecutors } from '../src/services/ai/automation/actionExecutors';
import type { AutomationAction } from '../src/services/ai/types/automationTypes';

vi.mock('../src/services/ai/automation/actionExecutors', () => ({
  actionExecutors: {
    executeEmailAction: vi.fn(),
    executeSmsAction: vi.fn(),
    executeTaskAction: vi.fn(),
    executeNoteAction: vi.fn(),
    executeCallAction: vi.fn(),
    executeCalendarAction: vi.fn()
  }
}));

const manager = new ExecutionManager();

describe('ExecutionManager.executeAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns error for unknown action type', async () => {
    const action: AutomationAction = {
      id: 'unknown1',
      type: 'unknown' as any,
      content: 'do something'
    };

    const result = await (manager as any).executeAction(action, {}, 'user', 'company');

    expect(actionExecutors.executeEmailAction).not.toHaveBeenCalled();
    expect(actionExecutors.executeSmsAction).not.toHaveBeenCalled();
    expect(actionExecutors.executeTaskAction).not.toHaveBeenCalled();
    expect(actionExecutors.executeNoteAction).not.toHaveBeenCalled();
    expect(actionExecutors.executeCallAction).not.toHaveBeenCalled();
    expect(actionExecutors.executeCalendarAction).not.toHaveBeenCalled();
    expect(result).toEqual({ success: false, message: 'Unknown action type: unknown' });
  });
});

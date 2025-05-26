
import { AutomationAction } from '../types/automationTypes';

export class TypeConverters {
  convertActionsToSimpleJson(actions: AutomationAction[]): any[] {
    return actions.map(action => ({
      id: action.id,
      type: action.type,
      content: action.content,
      delay: action.delay,
      conditions: action.conditions?.map(c => ({
        field: c.field,
        operator: c.operator,
        value: c.value
      })) || [],
      metadata: action.metadata || {},
      nextActions: action.nextActions?.map(next => ({
        id: next.id,
        type: next.type,
        content: next.content,
        delay: next.delay,
        conditions: next.conditions?.map(c => ({
          field: c.field,
          operator: c.operator,
          value: c.value
        })) || [],
        metadata: next.metadata || {},
        nextActions: next.nextActions?.map(level2 => ({
          id: level2.id,
          type: level2.type,
          content: level2.content,
          delay: level2.delay,
          conditions: level2.conditions?.map(c => ({
            field: c.field,
            operator: c.operator,
            value: c.value
          })) || [],
          metadata: level2.metadata || {}
        })) || []
      })) || []
    }));
  }

  convertSimpleJsonToActions(jsonActions: any[]): AutomationAction[] {
    if (!Array.isArray(jsonActions)) return [];
    
    return jsonActions.map(action => ({
      id: action.id || crypto.randomUUID(),
      type: action.type || 'email',
      content: action.content || '',
      delay: action.delay,
      conditions: Array.isArray(action.conditions) ? action.conditions : [],
      metadata: action.metadata || {},
      nextActions: Array.isArray(action.nextActions) ? action.nextActions.map((next: any) => ({
        id: next.id || crypto.randomUUID(),
        type: next.type || 'email',
        content: next.content || '',
        delay: next.delay,
        conditions: Array.isArray(next.conditions) ? next.conditions : [],
        metadata: next.metadata || {},
        nextActions: Array.isArray(next.nextActions) ? next.nextActions.map((level2: any) => ({
          id: level2.id || crypto.randomUUID(),
          type: level2.type || 'email',
          content: level2.content || '',
          delay: level2.delay,
          conditions: Array.isArray(level2.conditions) ? level2.conditions : [],
          metadata: level2.metadata || {}
        })) : []
      })) : []
    }));
  }
}

export const typeConverters = new TypeConverters();


// Central action type definitions with string enforcement
export const ActionTypes = {
  // AI Actions
  AI_COMMAND: 'ai_command',
  AI_RESPONSE: 'ai_response',
  VOICE_COMMAND: 'voice_command',
  VOICE_RESPONSE: 'voice_response',
  
  // Lead Actions
  CREATE_LEAD: 'create_lead',
  UPDATE_LEAD: 'update_lead',
  DELETE_LEAD: 'delete_lead',
  FETCH_LEADS: 'fetch_leads',
  
  // Communication Actions
  SEND_EMAIL: 'send_email',
  SEND_SMS: 'send_sms',
  DRAFT_EMAIL: 'draft_email',
  SCHEDULE_CALL: 'schedule_call',
  
  // Navigation Actions
  NAVIGATE_TO: 'navigate_to',
  OPEN_WORKSPACE: 'open_workspace',
  SWITCH_TAB: 'switch_tab',
  
  // UI Actions
  TOGGLE_MODAL: 'toggle_modal',
  EXPAND_SECTION: 'expand_section',
  MINIMIZE_WIDGET: 'minimize_widget',
  
  // Default fallback
  DEFAULT_ACTION: 'default_action'
} as const;

export type ActionType = typeof ActionTypes[keyof typeof ActionTypes];

export interface ActionPayload {
  type: ActionType;
  data?: Record<string, any>;
  context?: string;
  fallback?: string;
}

// Utility functions for action validation
export function validateStringParam(param: any, fallback: string): string {
  if (typeof param === 'string' && param.trim().length > 0) {
    return param;
  }
  console.warn(`Invalid string parameter, using fallback: ${fallback}`);
  return fallback;
}

export function validateAction(action: any): ActionType {
  if (typeof action === 'string' && Object.values(ActionTypes).includes(action as ActionType)) {
    return action as ActionType;
  }
  console.warn(`Invalid action type, using default: ${ActionTypes.DEFAULT_ACTION}`);
  return ActionTypes.DEFAULT_ACTION;
}

export function createSafeAction(type: string, data?: any, context?: string): ActionPayload {
  return {
    type: validateAction(type),
    data: data || {},
    context: validateStringParam(context, 'default_context'),
    fallback: ActionTypes.DEFAULT_ACTION
  };
}

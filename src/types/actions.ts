
export enum ActionTypes {
  AI_COMMAND = 'ai_command',
  VOICE_COMMAND = 'voice_command',
  USER_ACTION = 'user_action'
}

export const validateStringParam = (value: any, fallback: string): string => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value.trim();
  }
  return fallback;
};

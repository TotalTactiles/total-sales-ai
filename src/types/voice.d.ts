
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export interface VoiceCommand {
  transcript: string;
  confidence: number;
  intent: string;
  parameters: Record<string, any>;
}

export interface VoiceResponse {
  text: string;
  action?: {
    type: string;
    data: any;
  };
  success: boolean;
}

export interface WorkspaceContext {
  workspace: string;
  currentPage: string;
  userRole: string;
  leadId?: string;
  teamId?: string;
  companyId?: string;
}

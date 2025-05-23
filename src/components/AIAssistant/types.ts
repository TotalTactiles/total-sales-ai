
export interface AIMessage {
  id: number;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  suggestedActions?: string[];
}

export interface AINotification {
  id: number;
  title: string;
  message: string;
  type: 'alert' | 'tip' | 'achievement';
  icon: string;
  read: boolean;
  timestamp: Date;
}


export interface Question {
  id: string;
  type: 'select' | 'input' | 'ai-config';
  label: string;
  options?: string[];
  allowCustomInput?: boolean;
  fields?: string[];
}

export const salesRepQuestions: Question[] = [
  {
    id: "industry",
    type: "select",
    label: "What industry do you work in?",
    options: ["Real Estate", "Finance", "Coaching", "Software Sales", "Recruitment", "Other"],
    allowCustomInput: true
  },
  {
    id: "sales_personality",
    type: "select",
    label: "What type of sales personality best describes you?",
    options: ["Hard Worker", "Lone Wolf", "Relationship Builder", "Challenger", "Problem Solver"]
  },
  {
    id: "primary_goal",
    type: "select",
    label: "What's your biggest goal right now?",
    options: ["Make X sales", "Hit $10k+ commission", "Master objections", "Close deals faster"]
  },
  {
    id: "motivation_trigger",
    type: "select",
    label: "What gets you fired up/focused?",
    options: ["Visual tracker", "Verbal encouragement", "Deadline pressure", "Competition"]
  },
  {
    id: "weakness",
    type: "select",
    label: "What's your biggest weakness right now?",
    options: ["Lack of leads", "Confidence", "Knowledge gap", "Closing", "Inconsistency"]
  },
  {
    id: "ai_assistant",
    type: "ai-config",
    label: "Personalise your AI assistant",
    fields: ["name", "tone", "conversation_style", "voice_style"]
  },
  {
    id: "mental_state_trigger",
    type: "input",
    label: "Complete the sentence: I am at my best/worst when...",
  },
  {
    id: "wishlist",
    type: "input",
    label: "If we had a magic wand, what would 10x your results?",
  }
];


import { Question } from './salesRepQuestions';

export const managerQuestions: Question[] = [
  {
    id: "industry",
    type: "select",
    label: "What industry are you in?",
    options: ["Real Estate", "Finance", "Coaching", "Software", "Other"],
    allowCustomInput: true
  },
  {
    id: "role",
    type: "input",
    label: "What is your role, and what roles do you manage?"
  },
  {
    id: "team_size",
    type: "select",
    label: "How many sales reps will use this OS?",
    options: ["1", "2–5", "6–10", "11+"]
  },
  {
    id: "management_style",
    type: "select",
    label: "What kind of manager are you?",
    options: ["Data Analyst", "People Coach", "Tough Love", "Builder"]
  },
  {
    id: "preferred_team_personality",
    type: "select",
    label: "What type of sales personality do you want your team to develop?",
    options: ["Hard Worker", "Lone Wolf", "Relationship Builder", "Challenger", "Problem Solver"]
  },
  {
    id: "business_goal",
    type: "input",
    label: "What's your main business goal right now?"
  },
  {
    id: "team_obstacle",
    type: "select",
    label: "What's your team's biggest current obstacle?",
    options: ["Low close rate", "Low motivation", "Too much admin", "Lack of playbook", "Other"],
    allowCustomInput: true
  },
  {
    id: "ai_assistant",
    type: "ai-config",
    label: "Set up your AI assistant (CEO-style)",
    fields: ["name", "tone", "command_style", "voice_style"]
  },
  {
    id: "influence_style",
    type: "select",
    label: "What sales style inspires your team?",
    options: ["Hormozi", "Chris Voss", "Jordan Belfort", "Relationship-based", "Other"]
  }
];

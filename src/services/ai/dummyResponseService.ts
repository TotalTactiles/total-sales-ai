
import { validateStringParam } from '@/types/actions';

export interface DummyAIResponse {
  response: string;
  confidence: number;
  suggestedActions?: string[];
  reasoning?: string;
}

export class DummyResponseService {
  private static instance: DummyResponseService;

  static getInstance(): DummyResponseService {
    if (!DummyResponseService.instance) {
      DummyResponseService.instance = new DummyResponseService();
    }
    return DummyResponseService.instance;
  }

  generateResponse(prompt: string, context?: string): DummyAIResponse {
    const validPrompt = validateStringParam(prompt, 'help').toLowerCase();
    const validContext = validateStringParam(context, 'general');

    // Email-related responses
    if (validPrompt.includes('email') || validPrompt.includes('draft')) {
      return {
        response: `Here's a professional follow-up email draft:

Subject: Following up on our conversation - Next steps for [Company Name]

Hi [Lead Name],

Thank you for taking the time to discuss your [specific need/challenge] during our call yesterday. Based on our conversation, I believe our solution can help you achieve [specific benefit mentioned].

Key points from our discussion:
• You're looking to [specific goal]
• Timeline: [mentioned timeline]
• Budget considerations: [if discussed]

I've attached a case study showing how [similar company] achieved [specific result] using our platform.

Next steps:
1. Review the attached case study
2. Schedule a 30-minute demo for your team
3. Discuss implementation timeline

Would Thursday at 2 PM work for a brief follow-up call?

Best regards,
[Your Name]`,
        confidence: 92,
        suggestedActions: ['Send email', 'Schedule follow-up', 'Attach case study'],
        reasoning: 'Personalized approach with clear next steps increases response rates by 67%'
      };
    }

    // Lead analysis responses
    if (validPrompt.includes('analyze') || validPrompt.includes('lead') || validPrompt.includes('behavior')) {
      return {
        response: `Lead Analysis Summary:

**Engagement Score: 87/100**

**Key Insights:**
• 3x pricing page visits in past 24 hours
• Downloaded ROI calculator and case studies
• Spent 12 minutes on product demo video
• Viewed competitor comparison page

**Buying Signals:**
✅ High intent - actively researching solutions
✅ Budget authority confirmed (CEO/Decision maker)
✅ Timeline: Q1 implementation mentioned
✅ Pain points clearly identified

**Recommended Actions:**
1. **URGENT**: Call within next 2 hours (optimal window)
2. Send ROI analysis with specific numbers for their company size
3. Offer pilot program to reduce perceived risk
4. Share testimonial from similar industry client

**Conversion Probability: 78%**
This lead shows strong buying signals. Strike while engagement is hot!`,
        confidence: 94,
        suggestedActions: ['Call now', 'Send ROI analysis', 'Schedule demo'],
        reasoning: 'High engagement + recent activity + decision maker = prime conversion opportunity'
      };
    }

    // Strategy and coaching responses
    if (validPrompt.includes('strategy') || validPrompt.includes('improve') || validPrompt.includes('coaching')) {
      return {
        response: `Sales Strategy Recommendations:

**Performance Analysis:**
Your current metrics show strong potential with room for optimization:
• Conversion Rate: 23% (Industry avg: 18%) ✅
• Average Deal Size: $47K (Target: $55K) ⚡
• Sales Cycle: 67 days (Benchmark: 45-60 days) ⚠️

**Key Optimization Areas:**

1. **Speed-to-Lead Improvement**
   - Current: 12 minutes average
   - Target: <5 minutes
   - Impact: +21x connection rate

2. **Value Proposition Refinement**
   - Focus on ROI quantification in first 3 minutes
   - Use industry-specific case studies
   - Address objections proactively

3. **Follow-up Cadence Enhancement**
   - Day 1: Personal email + LinkedIn connection
   - Day 3: Value-add content (case study)
   - Day 7: Phone call with specific offer
   - Day 14: Video message with social proof

**This Week's Focus:**
Call your top 5 warm leads before 11 AM daily. Your close rate is 34% higher during morning calls.`,
        confidence: 89,
        suggestedActions: ['Review metrics', 'Update templates', 'Schedule coaching session'],
        reasoning: 'Data-driven insights based on your historical performance patterns'
      };
    }

    // Objection handling responses
    if (validPrompt.includes('objection') || validPrompt.includes('handle') || validPrompt.includes('price') || validPrompt.includes('budget')) {
      return {
        response: `Objection Handling Framework:

**Common Objection: "Your price is too high"**

**Response Strategy:**
1. **Acknowledge & Clarify**
   "I understand price is a concern. Help me understand - is it the total investment or the monthly payment structure that's the issue?"

2. **Reframe to Value**
   "Let's look at this differently. Based on our conversation, you're losing $X monthly due to [specific problem]. Our solution pays for itself in Y months."

3. **Use Social Proof**
   "ABC Company had the same concern. After 6 months, they said it was the best investment they made because [specific result]."

4. **Create Urgency**
   "I have approval to offer our Q4 implementation discount - that's 15% off if we can start before December 1st."

**Alternative Scripts:**
• "What would need to change about the investment for this to make sense?"
• "If price wasn't a factor, would this solve your problem?"
• "What's the cost of not solving this problem?"

**Key: Always tie back to their specific pain points and quantified business impact.**`,
        confidence: 91,
        suggestedActions: ['Practice scripts', 'Prepare ROI calc', 'Get pricing approval'],
        reasoning: 'Objection handling success improves by 45% when value is quantified upfront'
      };
    }

    // Meeting and call preparation
    if (validPrompt.includes('meeting') || validPrompt.includes('call') || validPrompt.includes('prepare')) {
      return {
        response: `Call Preparation Checklist:

**Pre-Call Research (5 minutes):**
✅ Company recent news/funding/expansions
✅ Lead's LinkedIn activity and role
✅ Previous interaction history
✅ Competitor analysis
✅ Industry challenges and trends

**Call Structure (30-45 minutes):**

**Opening (3 minutes):**
- Thank them for their time
- Confirm agenda and timeline
- Ask about their current situation

**Discovery (15 minutes):**
- What's driving this initiative?
- What happens if you don't solve this?
- Who else is involved in the decision?
- What's your timeline and budget range?

**Presentation (10 minutes):**
- Focus on 3 key benefits that address their pain
- Use specific examples from similar companies
- Quantify the impact with numbers

**Close (7 minutes):**
- Summarize key points
- Address any concerns
- Propose clear next steps
- Get commitment on timeline

**Follow-up (within 2 hours):**
- Send recap email with agreed next steps
- Include relevant case study or ROI calculator`,
        confidence: 88,
        suggestedActions: ['Research prospect', 'Update CRM', 'Prepare materials'],
        reasoning: 'Structured call preparation increases close rates by 56%'
      };
    }

    // Default helpful response
    return {
      response: `I'm your AI sales assistant, ready to help you excel! I can assist with:

**📧 Communication:**
- Draft emails and follow-ups
- Create SMS messages
- Script phone conversations

**📊 Analysis & Insights:**
- Analyze lead behavior and scoring
- Review pipeline and forecasts
- Provide market intelligence

**💡 Strategy & Coaching:**
- Objection handling techniques
- Closing strategies
- Sales methodology guidance

**⚡ Quick Actions:**
- Schedule meetings and calls
- Generate proposals and quotes
- Create task reminders

**Current Context:** ${validContext}

What would you like help with today? Try asking:
• "Draft a follow-up email for my last prospect"
• "Analyze my top lead's behavior"
• "Help me handle price objections"
• "Prepare me for my 3 PM call"`,
      confidence: 85,
      suggestedActions: ['Ask specific question', 'Review pipeline', 'Schedule coaching'],
      reasoning: 'I learn from your interactions to provide increasingly personalized assistance'
    };
  }

  generateVoiceResponse(text: string): string {
    const validText = validateStringParam(text, 'Hello! How can I help you today?');
    
    // For voice responses, make them more conversational and concise
    if (validText.includes('email') || validText.includes('draft')) {
      return "I've drafted a professional follow-up email for you. The key is personalization and clear next steps. Would you like me to adjust the tone or add specific details?";
    }
    
    if (validText.includes('analyze') || validText.includes('lead')) {
      return "This lead shows excellent buying signals with an 87% engagement score. They've been actively researching and visiting your pricing page. I recommend calling them within the next 2 hours for optimal results.";
    }
    
    if (validText.includes('strategy') || validText.includes('improve')) {
      return "Your performance is above industry average, but I see opportunities to optimize. Focus on reducing your sales cycle by improving speed-to-lead response. Morning calls have a 34% higher close rate for you.";
    }
    
    return "I'm here to help you succeed in sales. I can draft communications, analyze leads, provide coaching, and help with strategy. What would you like to work on?";
  }
}

export const dummyResponseService = DummyResponseService.getInstance();

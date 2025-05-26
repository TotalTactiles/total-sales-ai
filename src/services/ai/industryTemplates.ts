
import { AutomationFlow, EmailTemplate } from './types/automationTypes';

// Pre-built industry-specific automation templates
export const INDUSTRY_EMAIL_TEMPLATES: Record<string, EmailTemplate[]> = {
  'real_estate': [
    {
      id: 'real_estate_welcome',
      name: 'New Lead Welcome',
      subject: 'Welcome {{name}}! Let\'s find your dream home',
      body: `Hi {{name}},

Thank you for your interest in {{property_type}} in {{location}}! 

I'm {{agent_name}}, your dedicated real estate agent. I've helped hundreds of families find their perfect home, and I'm excited to help you too.

Here's what happens next:
1. I'll send you listings that match your criteria
2. We'll schedule a call to discuss your needs
3. I'll arrange viewings for your top choices

Your budget: {{budget}}
Preferred location: {{location}}
Property type: {{property_type}}

Best regards,
{{agent_name}}`,
      variables: ['name', 'property_type', 'location', 'agent_name', 'budget'],
      industry: 'real_estate',
      companyId: ''
    }
  ],
  'saas': [
    {
      id: 'saas_trial_welcome',
      name: 'Free Trial Welcome',
      subject: 'Welcome to {{product_name}} - Your trial starts now!',
      body: `Hi {{name}},

Welcome to {{product_name}}! Your 14-day free trial is now active.

Quick start guide:
1. Set up your account: {{setup_link}}
2. Import your data: {{import_link}}
3. Explore key features: {{features_link}}

Need help? Our support team is here:
- Live chat: Available 24/7
- Email: support@{{company_domain}}
- Documentation: {{docs_link}}

Questions? Just reply to this email!

Best,
{{sender_name}}
{{company_name}} Team`,
      variables: ['name', 'product_name', 'setup_link', 'import_link', 'features_link', 'company_domain', 'docs_link', 'sender_name', 'company_name'],
      industry: 'saas',
      companyId: ''
    }
  ],
  'ecommerce': [
    {
      id: 'ecommerce_cart_abandonment',
      name: 'Cart Abandonment Recovery',
      subject: 'Don\'t forget your items, {{name}}!',
      body: `Hi {{name}},

You left some great items in your cart! 

{{cart_items}}

Total: {{cart_total}}

Complete your purchase now and get:
✅ Free shipping on orders over $50
✅ 30-day money-back guarantee
✅ 24/7 customer support

{{checkout_link}}

Still have questions? Reply to this email or call us at {{phone}}.

Happy shopping!
{{store_name}} Team`,
      variables: ['name', 'cart_items', 'cart_total', 'checkout_link', 'phone', 'store_name'],
      industry: 'ecommerce',
      companyId: ''
    }
  ]
};

export const INDUSTRY_AUTOMATION_FLOWS: Record<string, Omit<AutomationFlow, 'id' | 'companyId' | 'createdBy'>[]> = {
  'real_estate': [
    {
      name: 'New Lead Nurture Sequence',
      trigger: {
        type: 'lead_created',
        conditions: [
          { field: 'source', operator: 'equals', value: 'website' }
        ]
      },
      actions: [
        {
          id: 'welcome_email',
          type: 'email',
          content: 'Welcome {{name}}! Let\'s find your dream home',
          delay: 0,
          metadata: { templateId: 'real_estate_welcome' }
        },
        {
          id: 'schedule_call',
          type: 'task',
          content: 'Schedule discovery call with {{name}} - Budget: {{budget}}, Location: {{location}}',
          delay: 24,
          metadata: { priority: 'high' }
        },
        {
          id: 'follow_up_email',
          type: 'email',
          content: 'Following up on your home search - any questions?',
          delay: 72
        }
      ],
      isActive: true,
      industry: 'real_estate'
    }
  ],
  'saas': [
    {
      name: 'Free Trial Onboarding',
      trigger: {
        type: 'lead_created',
        conditions: [
          { field: 'trial_started', operator: 'equals', value: true }
        ]
      },
      actions: [
        {
          id: 'welcome_email',
          type: 'email',
          content: 'Welcome to your free trial!',
          delay: 0,
          metadata: { templateId: 'saas_trial_welcome' }
        },
        {
          id: 'setup_reminder',
          type: 'email',
          content: 'Need help getting started? Here\'s a quick guide',
          delay: 24
        },
        {
          id: 'feature_highlight',
          type: 'email',
          content: 'Discover our most popular features',
          delay: 72
        },
        {
          id: 'trial_ending_reminder',
          type: 'email',
          content: 'Your trial ends in 3 days - ready to upgrade?',
          delay: 264 // 11 days
        }
      ],
      isActive: true,
      industry: 'saas'
    }
  ],
  'ecommerce': [
    {
      name: 'Cart Abandonment Recovery',
      trigger: {
        type: 'custom',
        conditions: [
          { field: 'event_type', operator: 'equals', value: 'cart_abandoned' }
        ]
      },
      actions: [
        {
          id: 'cart_reminder_1',
          type: 'email',
          content: 'Don\'t forget your items!',
          delay: 1,
          metadata: { templateId: 'ecommerce_cart_abandonment' }
        },
        {
          id: 'cart_reminder_2',
          type: 'email',
          content: 'Still thinking about your purchase? Here\'s 10% off!',
          delay: 24
        },
        {
          id: 'final_reminder',
          type: 'email',
          content: 'Last chance - your cart expires soon',
          delay: 72
        }
      ],
      isActive: true,
      industry: 'ecommerce'
    }
  ]
};

export class IndustryTemplateService {
  async setupIndustryTemplates(industry: string, companyId: string, userId: string): Promise<void> {
    try {
      // Setup email templates
      const emailTemplates = INDUSTRY_EMAIL_TEMPLATES[industry] || [];
      for (const template of emailTemplates) {
        template.companyId = companyId;
        // Create template logic would go here
      }

      // Setup automation flows
      const automationFlows = INDUSTRY_AUTOMATION_FLOWS[industry] || [];
      for (const flow of automationFlows) {
        // Create flow logic would go here
        console.log(`Setting up flow: ${flow.name} for industry: ${industry}`);
      }

    } catch (error) {
      console.error('Error setting up industry templates:', error);
    }
  }

  getAvailableIndustries(): string[] {
    return Object.keys(INDUSTRY_EMAIL_TEMPLATES);
  }

  getTemplatesForIndustry(industry: string): EmailTemplate[] {
    return INDUSTRY_EMAIL_TEMPLATES[industry] || [];
  }

  getFlowsForIndustry(industry: string): Omit<AutomationFlow, 'id' | 'companyId' | 'createdBy'>[] {
    return INDUSTRY_AUTOMATION_FLOWS[industry] || [];
  }
}

export const industryTemplateService = new IndustryTemplateService();

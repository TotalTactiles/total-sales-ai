
import { logger } from './logger';

interface EnvConfig {
  RELEVANCE_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private config: Partial<EnvConfig> = {};
  private isInitialized = false;

  static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  initialize(): void {
    if (this.isInitialized) return;

    this.config = {
      RELEVANCE_API_KEY: import.meta.env.VITE_RELEVANCE_API_KEY || '',
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
      SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
      ANTHROPIC_API_KEY: import.meta.env.VITE_ANTHROPIC_API_KEY || ''
    };

    this.validateConfig();
    this.isInitialized = true;
  }

  private validateConfig(): void {
    const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missing = required.filter(key => !this.config[key as keyof EnvConfig]);

    if (missing.length > 0) {
      logger.error('Missing required environment variables:', missing);
    }

    const optional = ['RELEVANCE_API_KEY', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY'];
    const missingOptional = optional.filter(key => !this.config[key as keyof EnvConfig]);

    if (missingOptional.length > 0) {
      logger.warn('Missing optional environment variables:', missingOptional);
      logger.info('Some AI features may not be available without these keys');
    }
  }

  get(key: keyof EnvConfig): string {
    if (!this.isInitialized) {
      this.initialize();
    }
    
    return this.config[key] || '';
  }

  has(key: keyof EnvConfig): boolean {
    if (!this.isInitialized) {
      this.initialize();
    }
    
    return !!this.config[key];
  }

  isRelevanceAIConfigured(): boolean {
    return this.has('RELEVANCE_API_KEY');
  }

  isSupabaseConfigured(): boolean {
    return this.has('SUPABASE_URL') && this.has('SUPABASE_ANON_KEY');
  }

  getServiceStatus(): Record<string, boolean> {
    return {
      supabase: this.isSupabaseConfigured(),
      relevanceAI: this.isRelevanceAIConfigured(),
      openAI: this.has('OPENAI_API_KEY'),
      anthropic: this.has('ANTHROPIC_API_KEY')
    };
  }
}

export const envConfig = EnvironmentConfig.getInstance();

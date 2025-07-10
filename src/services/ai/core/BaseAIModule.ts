
import { logger } from '@/utils/logger';
import { aiUtils } from './AIUtils';
import { securityManager } from './SecurityManager';

export interface ModuleConfig {
  moduleId: string;
  companyId: string;
  repId: string;
  permissions: string[];
  memoryLimit: number; // in MB
  responseTimeout: number; // in milliseconds
}

export interface ProcessingContext {
  companyId: string;
  repId: string;
  sessionId: string;
  userRole: string;
  currentPage?: string;
  leadId?: string;
  metadata?: any;
}

export interface ModuleResponse {
  success: boolean;
  data?: any;
  error?: string;
  suggestions?: string[];
  nextActions?: string[];
  confidence?: number;
}

export abstract class BaseAIModule {
  protected config: ModuleConfig;
  protected isInitialized = false;
  protected memoryUsage = 0;
  protected lastActivity = new Date();
  protected sessionMemory = new Map<string, any>();

  constructor(config: ModuleConfig) {
    this.config = config;
  }

  /**
   * Initialize the AI module
   */
  async initialize(): Promise<void> {
    try {
      logger.info(`Initializing AI module: ${this.config.moduleId}`);
      
      // Initialize security policy
      securityManager.initializeSecurityPolicy(
        this.config.companyId,
        this.config.repId
      );
      
      // Perform module-specific initialization
      await this.initializeModule();
      
      this.isInitialized = true;
      this.lastActivity = new Date();
      
      logger.info(`AI module initialized successfully: ${this.config.moduleId}`);
    } catch (error) {
      logger.error(`Failed to initialize AI module ${this.config.moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Process input with security validation and error handling
   */
  async process(input: any, context?: ProcessingContext): Promise<ModuleResponse> {
    try {
      // Validate initialization
      if (!this.isInitialized) {
        throw new Error('Module not initialized');
      }

      // Update activity timestamp
      this.lastActivity = new Date();

      // Validate permissions
      const ctx = context || this.getDefaultContext();
      if (!this.validatePermissions(ctx)) {
        return {
          success: false,
          error: 'Insufficient permissions'
        };
      }

      // Rate limit check
      const rateLimitOk = await securityManager.checkRateLimit(ctx.companyId, ctx.repId);
      if (!rateLimitOk) {
        return {
          success: false,
          error: 'Rate limit exceeded'
        };
      }

      // Validate and sanitize input
      const validation = aiUtils.validateInput(input);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid input: ${validation.errors.join(', ')}`
        };
      }

      // Log interaction
      await aiUtils.logInteraction(ctx.repId, `${this.config.moduleId}_process`, input, ctx.companyId);

      // Process the request
      const result = await this.processRequest(validation.sanitizedInput, ctx);

      // Sanitize response
      const sanitizedResult = securityManager.sanitizeData(result, ctx.companyId, ctx.repId);

      return {
        success: true,
        data: sanitizedResult,
        confidence: this.calculateConfidence(input, result)
      };

    } catch (error) {
      logger.error(`Error processing request in ${this.config.moduleId}:`, error);
      
      // Log security event for errors
      securityManager.logSecurityEvent('module_processing_error', {
        moduleId: this.config.moduleId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        error: 'Processing failed'
      };
    }
  }

  /**
   * Health check for the module
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        return false;
      }

      // Check memory usage
      if (this.memoryUsage > this.config.memoryLimit) {
        logger.warn(`Memory usage exceeded for ${this.config.moduleId}: ${this.memoryUsage}MB`);
        return false;
      }

      // Check last activity (consider module stale after 1 hour of inactivity)
      const inactiveTime = Date.now() - this.lastActivity.getTime();
      if (inactiveTime > 3600000) { // 1 hour
        logger.warn(`Module ${this.config.moduleId} inactive for ${inactiveTime}ms`);
        return false;
      }

      // Perform module-specific health check
      return await this.performHealthCheck();
    } catch (error) {
      logger.error(`Health check failed for ${this.config.moduleId}:`, error);
      return false;
    }
  }

  /**
   * Get module status
   */
  getStatus() {
    return {
      moduleId: this.config.moduleId,
      status: this.isInitialized ? 'active' : 'inactive',
      lastHeartbeat: this.lastActivity,
      errorCount: 0, // This would be tracked in a real implementation
      responseTime: 0, // This would be tracked in a real implementation
      memoryUsage: this.memoryUsage
    };
  }

  /**
   * Cleanup module resources
   */
  async cleanup(): Promise<void> {
    try {
      logger.info(`Cleaning up AI module: ${this.config.moduleId}`);
      
      // Perform module-specific cleanup
      await this.cleanupModule();
      
      // Clear memory
      this.sessionMemory.clear();
      this.memoryUsage = 0;
      this.isInitialized = false;
      
      logger.info(`AI module cleaned up: ${this.config.moduleId}`);
    } catch (error) {
      logger.error(`Error cleaning up module ${this.config.moduleId}:`, error);
    }
  }

  // Protected methods to be implemented by subclasses
  protected abstract initializeModule(): Promise<void>;
  protected abstract processRequest(input: any, context: ProcessingContext): Promise<any>;
  protected abstract performHealthCheck(): Promise<boolean>;
  protected abstract cleanupModule(): Promise<void>;

  // Protected utility methods
  protected validatePermissions(context: ProcessingContext): boolean {
    return securityManager.validateRepAccess(
      context.repId,
      context.repId,
      context.companyId,
      'ai_chat'
    );
  }

  protected getDefaultContext(): ProcessingContext {
    return {
      companyId: this.config.companyId,
      repId: this.config.repId,
      sessionId: crypto.randomUUID(),
      userRole: 'sales_rep'
    };
  }

  protected calculateConfidence(input: any, result: any): number {
    // Basic confidence calculation - can be overridden in subclasses
    if (!result || (typeof result === 'string' && result.length < 10)) {
      return 0.3;
    }
    return 0.8;
  }

  protected updateMemoryUsage(): void {
    // Estimate memory usage based on session memory size
    const memoryEstimate = JSON.stringify(Array.from(this.sessionMemory.entries())).length / 1024 / 1024;
    this.memoryUsage = memoryEstimate;
  }

  protected async storeSessionMemory(key: string, value: any): Promise<void> {
    try {
      const encrypted = await aiUtils.encryptMemory(value);
      this.sessionMemory.set(key, encrypted);
      this.updateMemoryUsage();
    } catch (error) {
      logger.error('Failed to store session memory:', error);
    }
  }

  protected async retrieveSessionMemory(key: string): Promise<any> {
    try {
      const encrypted = this.sessionMemory.get(key);
      if (encrypted) {
        return await aiUtils.decryptMemory(encrypted);
      }
      return null;
    } catch (error) {
      logger.error('Failed to retrieve session memory:', error);
      return null;
    }
  }
}

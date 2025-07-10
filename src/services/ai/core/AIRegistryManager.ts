
import { logger } from '@/utils/logger';

interface ModuleStatus {
  moduleId: string;
  status: 'active' | 'inactive' | 'error' | 'initializing';
  lastHeartbeat: Date;
  errorCount: number;
  responseTime: number;
  memoryUsage: number;
}

interface AIModule {
  initialize(): Promise<void>;
  process(input: any): Promise<any>;
  cleanup(): void;
  getStatus(): ModuleStatus;
  healthCheck(): Promise<boolean>;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
}

class CircuitBreaker {
  private failures: number = 0;
  private lastFailTime: Date | null = null;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (this.shouldAttemptReset()) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private shouldAttemptReset(): boolean {
    return this.lastFailTime && 
           (Date.now() - this.lastFailTime.getTime()) > this.config.resetTimeout;
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailTime = new Date();
    
    if (this.failures >= this.config.failureThreshold) {
      this.state = 'open';
    }
  }
}

export class AIRegistryManager {
  private static instance: AIRegistryManager;
  private modules = new Map<string, AIModule>();
  private moduleStatus = new Map<string, ModuleStatus>();
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  static getInstance(): AIRegistryManager {
    if (!AIRegistryManager.instance) {
      AIRegistryManager.instance = new AIRegistryManager();
    }
    return AIRegistryManager.instance;
  }

  async registerModule(moduleId: string, module: AIModule): Promise<void> {
    try {
      logger.info(`Registering AI module: ${moduleId}`);
      
      // Initialize the module
      await module.initialize();
      
      // Set up circuit breaker
      const circuitBreaker = new CircuitBreaker({
        failureThreshold: 5,
        resetTimeout: 60000, // 1 minute
        monitoringPeriod: 300000 // 5 minutes
      });

      this.modules.set(moduleId, module);
      this.circuitBreakers.set(moduleId, circuitBreaker);
      
      // Initialize status
      this.moduleStatus.set(moduleId, {
        moduleId,
        status: 'active',
        lastHeartbeat: new Date(),
        errorCount: 0,
        responseTime: 0,
        memoryUsage: 0
      });

      // Start heartbeat monitoring if first module
      if (this.modules.size === 1) {
        this.startHeartbeatMonitoring();
      }

      logger.info(`AI module registered successfully: ${moduleId}`);
    } catch (error) {
      logger.error(`Failed to register AI module ${moduleId}:`, error);
      throw error;
    }
  }

  async unregisterModule(moduleId: string): Promise<void> {
    try {
      const module = this.modules.get(moduleId);
      if (module) {
        await module.cleanup();
        this.modules.delete(moduleId);
        this.moduleStatus.delete(moduleId);
        this.circuitBreakers.delete(moduleId);
        
        logger.info(`AI module unregistered: ${moduleId}`);
      }

      // Stop heartbeat monitoring if no modules left
      if (this.modules.size === 0) {
        this.stopHeartbeatMonitoring();
      }
    } catch (error) {
      logger.error(`Failed to unregister AI module ${moduleId}:`, error);
      throw error;
    }
  }

  async processRequest(moduleId: string, input: any): Promise<any> {
    const module = this.modules.get(moduleId);
    const circuitBreaker = this.circuitBreakers.get(moduleId);
    
    if (!module || !circuitBreaker) {
      throw new Error(`Module ${moduleId} not found`);
    }

    const startTime = Date.now();
    
    try {
      const result = await circuitBreaker.execute(() => module.process(input));
      
      // Update performance metrics
      const responseTime = Date.now() - startTime;
      this.updateModuleMetrics(moduleId, responseTime, true);
      
      return result;
    } catch (error) {
      this.updateModuleMetrics(moduleId, Date.now() - startTime, false);
      throw error;
    }
  }

  getModuleStatus(moduleId: string): ModuleStatus | null {
    return this.moduleStatus.get(moduleId) || null;
  }

  getAllModuleStatuses(): ModuleStatus[] {
    return Array.from(this.moduleStatus.values());
  }

  private updateModuleMetrics(moduleId: string, responseTime: number, success: boolean): void {
    const status = this.moduleStatus.get(moduleId);
    if (status) {
      status.responseTime = responseTime;
      status.lastHeartbeat = new Date();
      
      if (!success) {
        status.errorCount++;
        status.status = 'error';
      } else if (status.status === 'error' && status.errorCount > 0) {
        // Reset error count on successful request
        status.errorCount = Math.max(0, status.errorCount - 1);
        if (status.errorCount === 0) {
          status.status = 'active';
        }
      }
    }
  }

  private startHeartbeatMonitoring(): void {
    this.heartbeatInterval = setInterval(async () => {
      for (const [moduleId, module] of this.modules) {
        try {
          const isHealthy = await module.healthCheck();
          const status = this.moduleStatus.get(moduleId);
          
          if (status) {
            status.lastHeartbeat = new Date();
            status.status = isHealthy ? 'active' : 'error';
          }
        } catch (error) {
          logger.error(`Health check failed for module ${moduleId}:`, error);
          const status = this.moduleStatus.get(moduleId);
          if (status) {
            status.status = 'error';
            status.errorCount++;
          }
        }
      }
    }, 30000); // Check every 30 seconds
  }

  private stopHeartbeatMonitoring(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Cleanup method for shutdown
  async cleanup(): Promise<void> {
    this.stopHeartbeatMonitoring();
    
    const cleanupPromises = Array.from(this.modules.entries()).map(
      ([moduleId, module]) => this.unregisterModule(moduleId)
    );
    
    await Promise.all(cleanupPromises);
    logger.info('AI Registry Manager cleaned up');
  }
}

export const aiRegistryManager = AIRegistryManager.getInstance();

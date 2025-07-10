
import { BaseAIModule, ModuleConfig, ProcessingContext, ModuleResponse } from '../core/BaseAIModule';
import { aiRegistryManager } from '../core/AIRegistryManager';
import { logger } from '@/utils/logger';

interface VoiceActivationConfig {
  wakePhrase: string;
  confidenceThreshold: number;
  noiseThreshold: number;
  debounceTime: number;
}

interface TaskDelegationRule {
  keywords: string[];
  contextPatterns: string[];
  targetModule: string;
  priority: number;
}

interface ActivityMonitoringConfig {
  debounceTime: number;
  trackingEvents: string[];
  idleTimeout: number;
}

export class TsamOrchestratorCore extends BaseAIModule {
  private voiceActivationConfig: VoiceActivationConfig;
  private taskDelegationRules: TaskDelegationRule[];
  private activityMonitoringConfig: ActivityMonitoringConfig;
  private isListening = false;
  private currentContext: any = {};
  private activityTimer: NodeJS.Timeout | null = null;

  constructor(config: ModuleConfig) {
    super(config);
    this.initializeConfigurations();
  }

  protected async initializeModule(): Promise<void> {
    logger.info('Initializing TSAM Orchestrator Core');

    // Initialize voice activation
    await this.initializeVoiceActivation();

    // Initialize activity monitoring
    this.initializeActivityMonitoring();

    // Load task delegation rules
    this.loadTaskDelegationRules();

    logger.info('TSAM Orchestrator Core initialized');
  }

  protected async processRequest(input: any, context: ProcessingContext): Promise<any> {
    try {
      // Determine request type
      const requestType = this.determineRequestType(input, context);
      
      switch (requestType) {
        case 'voice_activation':
          return await this.handleVoiceActivation(input, context);
        case 'task_delegation':
          return await this.handleTaskDelegation(input, context);
        case 'context_switch':
          return await this.handleContextSwitch(input, context);
        case 'direct_query':
          return await this.handleDirectQuery(input, context);
        default:
          return await this.handleGeneralQuery(input, context);
      }
    } catch (error) {
      logger.error('Error processing request in TSAM Orchestrator:', error);
      throw error;
    }
  }

  protected async performHealthCheck(): Promise<boolean> {
    try {
      // Check voice activation system
      if (!this.isVoiceSystemHealthy()) {
        return false;
      }

      // Check memory usage
      if (this.memoryUsage > this.config.memoryLimit * 0.8) {
        logger.warn('TSAM Orchestrator memory usage high');
        await this.performMemoryCleanup();
      }

      return true;
    } catch (error) {
      logger.error('TSAM Orchestrator health check failed:', error);
      return false;
    }
  }

  protected async cleanupModule(): Promise<void> {
    // Stop voice activation
    this.stopVoiceActivation();

    // Stop activity monitoring
    this.stopActivityMonitoring();

    // Clear context
    this.currentContext = {};

    logger.info('TSAM Orchestrator Core cleaned up');
  }

  // Voice Activation Methods
  private async initializeVoiceActivation(): Promise<void> {
    try {
      // Initialize Web Audio API for voice detection
      if (typeof window !== 'undefined' && window.navigator.mediaDevices) {
        // Request microphone permissions
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Set up audio processing
        const audioContext = new AudioContext();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        
        // Implement voice detection logic
        await this.setupVoiceDetection(mediaStreamSource, audioContext);
        
        this.isListening = true;
        logger.info('Voice activation initialized');
      }
    } catch (error) {
      logger.error('Failed to initialize voice activation:', error);
      // Graceful fallback - continue without voice activation
    }
  }

  private async setupVoiceDetection(source: MediaStreamAudioSourceNode, context: AudioContext): Promise<void> {
    // Create analyzer for audio processing
    const analyzer = context.createAnalyser();
    analyzer.fftSize = 2048;
    source.connect(analyzer);

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);
    
    // Start monitoring for wake phrase
    const checkForWakePhrase = () => {
      analyzer.getByteFrequencyData(dataArray);
      
      // Simple volume-based detection (in production, use more sophisticated ML models)
      const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      
      if (volume > this.voiceActivationConfig.noiseThreshold) {
        this.handlePotentialWakePhrase();
      }
      
      if (this.isListening) {
        requestAnimationFrame(checkForWakePhrase);
      }
    };
    
    checkForWakePhrase();
  }

  private handlePotentialWakePhrase(): void {
    // Debounce to prevent multiple triggers
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }
    
    this.activityTimer = setTimeout(() => {
      this.processVoiceActivation();
    }, this.voiceActivationConfig.debounceTime);
  }

  private async processVoiceActivation(): Promise<void> {
    try {
      // In production, implement proper speech-to-text and wake phrase detection
      logger.info('Voice activation detected');
      
      // Trigger AI response
      const response = await this.handleVoiceActivation('wake_phrase_detected', this.getDefaultContext());
      
      // Process the response
      if (response.success) {
        this.displayVoiceActivationResponse(response);
      }
    } catch (error) {
      logger.error('Voice activation processing failed:', error);
    }
  }

  // Task Delegation Methods
  private async handleTaskDelegation(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    try {
      // Analyze input to determine target module
      const targetModule = this.determineTargetModule(input, context);
      
      if (!targetModule) {
        return {
          success: false,
          error: 'Unable to determine appropriate AI module'
        };
      }

      // Delegate to target module
      const result = await aiRegistryManager.processRequest(targetModule, input);
      
      return {
        success: true,
        data: result,
        suggestions: [`Task delegated to ${targetModule}`]
      };
    } catch (error) {
      logger.error('Task delegation failed:', error);
      return {
        success: false,
        error: 'Task delegation failed'
      };
    }
  }

  private determineTargetModule(input: any, context: ProcessingContext): string | null {
    const inputStr = String(input).toLowerCase();
    
    // Sort rules by priority (highest first)
    const sortedRules = [...this.taskDelegationRules].sort((a, b) => b.priority - a.priority);
    
    for (const rule of sortedRules) {
      // Check keywords
      const hasKeywords = rule.keywords.some(keyword => inputStr.includes(keyword.toLowerCase()));
      
      // Check context patterns
      let hasContextMatch = false;
      if (rule.contextPatterns.length > 0) {
        hasContextMatch = rule.contextPatterns.some(pattern => {
          const regex = new RegExp(pattern, 'i');
          return regex.test(context.currentPage || '') || 
                 regex.test(context.leadId || '') ||
                 regex.test(JSON.stringify(context.metadata || {}));
        });
      } else {
        hasContextMatch = true; // No context patterns means it matches any context
      }
      
      if (hasKeywords && hasContextMatch) {
        return rule.targetModule;
      }
    }
    
    return null;
  }

  // Activity Monitoring Methods
  private initializeActivityMonitoring(): void {
    if (typeof window !== 'undefined') {
      // Track page navigation
      window.addEventListener('popstate', () => this.handleActivityEvent('navigation'));
      
      // Track clicks (debounced)
      let clickTimer: NodeJS.Timeout;
      document.addEventListener('click', () => {
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
          this.handleActivityEvent('click');
        }, this.activityMonitoringConfig.debounceTime);
      });
      
      // Track page visibility
      document.addEventListener('visibilitychange', () => {
        this.handleActivityEvent(document.hidden ? 'hidden' : 'visible');
      });
    }
  }

  private handleActivityEvent(eventType: string): void {
    // Update current context based on activity
    this.updateCurrentContext(eventType);
    
    // Log activity for AI learning
    logger.info(`Activity detected: ${eventType}`, {
      timestamp: new Date(),
      context: this.currentContext
    });
  }

  private updateCurrentContext(eventType: string): void {
    this.currentContext = {
      ...this.currentContext,
      lastActivity: new Date(),
      activityType: eventType,
      currentPage: window.location.pathname,
      timestamp: Date.now()
    };
    
    // Store in session memory
    this.storeSessionMemory('current_context', this.currentContext);
  }

  // Helper Methods
  private initializeConfigurations(): void {
    this.voiceActivationConfig = {
      wakePhrase: 'hey tsam',
      confidenceThreshold: 0.95,
      noiseThreshold: 50,
      debounceTime: 300
    };

    this.activityMonitoringConfig = {
      debounceTime: 300,
      trackingEvents: ['click', 'navigation', 'visibility'],
      idleTimeout: 300000 // 5 minutes
    };
  }

  private loadTaskDelegationRules(): void {
    this.taskDelegationRules = [
      {
        keywords: ['lead', 'profile', 'contact', 'update lead'],
        contextPatterns: ['/leads/\\d+', '/lead-details'],
        targetModule: 'lead_profile_ai',
        priority: 10
      },
      {
        keywords: ['call', 'dial', 'phone', 'make call'],
        contextPatterns: ['/dialer', '/call'],
        targetModule: 'dialer_ai',
        priority: 9
      },
      {
        keywords: ['email', 'send email', 'email campaign', 'bulk email'],
        contextPatterns: ['/leads', '/email'],
        targetModule: 'lead_management_ai',
        priority: 8
      },
      {
        keywords: ['analytics', 'reports', 'performance', 'metrics'],
        contextPatterns: ['/analytics', '/reports'],
        targetModule: 'analytics_ai',
        priority: 7
      },
      {
        keywords: ['training', 'academy', 'learn', 'drill'],
        contextPatterns: ['/academy', '/training'],
        targetModule: 'academy_ai',
        priority: 6
      }
    ];
  }

  private determineRequestType(input: any, context: ProcessingContext): string {
    const inputStr = String(input).toLowerCase();
    
    if (inputStr.includes('wake') || inputStr === 'wake_phrase_detected') {
      return 'voice_activation';
    }
    
    if (this.shouldDelegateTask(inputStr, context)) {
      return 'task_delegation';
    }
    
    if (context.currentPage !== this.currentContext.currentPage) {
      return 'context_switch';
    }
    
    if (inputStr.startsWith('?') || inputStr.includes('help')) {
      return 'direct_query';
    }
    
    return 'general_query';
  }

  private shouldDelegateTask(input: string, context: ProcessingContext): boolean {
    return this.taskDelegationRules.some(rule => 
      rule.keywords.some(keyword => input.includes(keyword.toLowerCase()))
    );
  }

  private async handleVoiceActivation(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    return {
      success: true,
      data: {
        message: 'TSAM activated. How can I help you?',
        listening: true
      },
      suggestions: [
        'Ask me about leads',
        'Help with calls',
        'Show analytics',
        'Training drills'
      ]
    };
  }

  private async handleContextSwitch(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    this.updateCurrentContext('context_switch');
    
    return {
      success: true,
      data: {
        message: `Context switched to ${context.currentPage}. I'm ready to help with this page.`,
        context: this.currentContext
      }
    };
  }

  private async handleDirectQuery(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    return {
      success: true,
      data: {
        message: 'I can help with leads, calls, analytics, and training. What would you like to do?',
        availableModules: this.taskDelegationRules.map(rule => rule.targetModule)
      }
    };
  }

  private async handleGeneralQuery(input: any, context: ProcessingContext): Promise<ModuleResponse> {
    return {
      success: true,
      data: {
        message: 'I understand you need help. Let me analyze what you need...',
        processing: true
      },
      nextActions: ['Analyzing request...', 'Determining best approach...']
    };
  }

  private isVoiceSystemHealthy(): boolean {
    return this.isListening && this.voiceActivationConfig.confidenceThreshold > 0;
  }

  private async performMemoryCleanup(): Promise<void> {
    // Clear old session data
    const currentTime = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, value] of this.sessionMemory.entries()) {
      try {
        const decrypted = await this.retrieveSessionMemory(key);
        if (decrypted?.timestamp && (currentTime - decrypted.timestamp) > 3600000) { // 1 hour
          expiredKeys.push(key);
        }
      } catch (error) {
        expiredKeys.push(key); // Remove corrupted entries
      }
    }
    
    for (const key of expiredKeys) {
      this.sessionMemory.delete(key);
    }
    
    this.updateMemoryUsage();
    logger.info(`Cleaned up ${expiredKeys.length} expired memory entries`);
  }

  private stopVoiceActivation(): void {
    this.isListening = false;
  }

  private stopActivityMonitoring(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  private displayVoiceActivationResponse(response: ModuleResponse): void {
    // This would integrate with the UI to show voice activation feedback
    logger.info('Voice activation response:', response);
  }
}


import { logger } from '@/utils/logger';
import { encryptionService } from '@/services/security/encryptionService';
import { accessControlService } from '@/services/security/accessControlService';

interface InteractionLog {
  repId: string;
  companyId: string;
  action: string;
  data: any;
  timestamp: Date;
  sanitizedData?: any;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedInput?: string;
}

export class AIUtils {
  private static instance: AIUtils;
  private readonly maxInputLength = 10000;
  private readonly maxOutputLength = 50000;

  static getInstance(): AIUtils {
    if (!AIUtils.instance) {
      AIUtils.instance = new AIUtils();
    }
    return AIUtils.instance;
  }

  /**
   * Sanitize input to prevent injection attacks and ensure data quality
   */
  sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove potentially dangerous characters
    let sanitized = input
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove JavaScript protocols
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
      .replace(/data:/gi, '') // Remove data URLs
      .trim();

    // Limit length
    if (sanitized.length > this.maxInputLength) {
      sanitized = sanitized.substring(0, this.maxInputLength);
      logger.warn('Input truncated due to length limit', { originalLength: input.length });
    }

    // Encode special characters
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    return sanitized;
  }

  /**
   * Format AI output according to specified format
   */
  formatOutput(data: any, format: 'json' | 'text' | 'html'): string {
    try {
      let output: string;

      switch (format) {
        case 'json':
          output = JSON.stringify(data, null, 2);
          break;
        case 'html':
          output = this.toHtmlFormat(data);
          break;
        case 'text':
        default:
          output = this.toTextFormat(data);
          break;
      }

      // Limit output length
      if (output.length > this.maxOutputLength) {
        output = output.substring(0, this.maxOutputLength) + '... [truncated]';
        logger.warn('Output truncated due to length limit');
      }

      return output;
    } catch (error) {
      logger.error('Error formatting output:', error);
      return 'Error formatting response';
    }
  }

  /**
   * Log AI interaction with proper sanitization and security
   */
  async logInteraction(repId: string, action: string, data: any, companyId?: string): Promise<void> {
    try {
      // Sanitize sensitive data
      const sanitizedData = this.sanitizeLogData(data);
      
      const logEntry: InteractionLog = {
        repId,
        companyId: companyId || 'unknown',
        action,
        data: sanitizedData,
        timestamp: new Date(),
        sanitizedData
      };

      // Log to application logger
      logger.info('AI Interaction', {
        repId,
        action,
        timestamp: logEntry.timestamp,
        dataType: typeof data
      });

      // Store in audit system (implement as needed)
      await this.storeAuditLog(logEntry);

    } catch (error) {
      logger.error('Failed to log AI interaction:', error);
    }
  }

  /**
   * Validate user permissions for AI actions
   */
  validatePermissions(repId: string, action: string, context?: any): boolean {
    try {
      // Get user role and company context
      const userRole = context?.userRole || 'sales_rep';
      const resource = this.mapActionToResource(action);
      
      return accessControlService.checkAccess(resource, 'read', userRole, context);
    } catch (error) {
      logger.error('Permission validation failed:', error);
      return false;
    }
  }

  /**
   * Encrypt memory data for secure storage
   */
  async encryptMemory(data: any): Promise<string> {
    try {
      return await encryptionService.encryptSensitiveData(data);
    } catch (error) {
      logger.error('Memory encryption failed:', error);
      throw new Error('Failed to encrypt memory data');
    }
  }

  /**
   * Decrypt memory data for retrieval
   */
  async decryptMemory(encryptedData: string): Promise<any> {
    try {
      return await encryptionService.decryptSensitiveData(encryptedData);
    } catch (error) {
      logger.error('Memory decryption failed:', error);
      throw new Error('Failed to decrypt memory data');
    }
  }

  /**
   * Validate input data structure and content
   */
  validateInput(input: any): ValidationResult {
    const errors: string[] = [];

    if (!input) {
      errors.push('Input is required');
      return { isValid: false, errors };
    }

    if (typeof input === 'string') {
      if (input.length === 0) {
        errors.push('Input cannot be empty');
      }
      if (input.length > this.maxInputLength) {
        errors.push(`Input exceeds maximum length of ${this.maxInputLength} characters`);
      }
    }

    // Check for potentially malicious patterns
    if (typeof input === 'string') {
      const maliciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:.*base64/i
      ];

      for (const pattern of maliciousPatterns) {
        if (pattern.test(input)) {
          errors.push('Input contains potentially malicious content');
          break;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedInput: errors.length === 0 ? this.sanitizeInput(input) : undefined
    };
  }

  /**
   * Generate secure session token for AI interactions
   */
  generateSessionToken(): string {
    return encryptionService.generateSecureToken();
  }

  /**
   * Rate limiting check
   */
  async checkRateLimit(repId: string): Promise<boolean> {
    // Implement rate limiting logic (100 requests per minute)
    // This would typically use Redis or similar for distributed systems
    // For now, return true (implement as needed)
    return true;
  }

  // Private helper methods
  private toTextFormat(data: any): string {
    if (typeof data === 'string') {
      return data;
    }
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  }

  private toHtmlFormat(data: any): string {
    if (typeof data === 'string') {
      return `<div class="ai-response">${this.sanitizeInput(data)}</div>`;
    }
    if (typeof data === 'object') {
      const jsonStr = JSON.stringify(data, null, 2);
      return `<pre class="ai-response-json">${this.sanitizeInput(jsonStr)}</pre>`;
    }
    return `<span class="ai-response">${String(data)}</span>`;
  }

  private sanitizeLogData(data: any): any {
    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      
      // Remove sensitive fields
      const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'ssn', 'creditCard'];
      
      for (const field of sensitiveFields) {
        if (sanitized[field]) {
          sanitized[field] = '[REDACTED]';
        }
      }
      
      return sanitized;
    }
    
    return data;
  }

  private mapActionToResource(action: string): string {
    const actionMap: Record<string, string> = {
      'lead_update': 'leads',
      'lead_read': 'leads',
      'call_log': 'voice_services',
      'ai_chat': 'ai_brain',
      'analytics_view': 'ai_insights'
    };
    
    return actionMap[action] || 'ai_brain';
  }

  private async storeAuditLog(logEntry: InteractionLog): Promise<void> {
    // Implement audit log storage
    // This would typically write to a database or audit service
    logger.info('Audit log stored', { 
      repId: logEntry.repId, 
      action: logEntry.action, 
      timestamp: logEntry.timestamp 
    });
  }
}

export const aiUtils = AIUtils.getInstance();

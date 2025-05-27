
import { validateStringParam, ActionTypes } from '@/types/actions';

export class RuntimeValidator {
  private static instance: RuntimeValidator;
  private validationErrors: string[] = [];

  static getInstance(): RuntimeValidator {
    if (!RuntimeValidator.instance) {
      RuntimeValidator.instance = new RuntimeValidator();
    }
    return RuntimeValidator.instance;
  }

  validateFunction(fn: Function, params: any[], expectedTypes: string[]): boolean {
    try {
      for (let i = 0; i < params.length; i++) {
        const param = params[i];
        const expectedType = expectedTypes[i];
        
        if (expectedType === 'string' && typeof param !== 'string') {
          const error = `Function ${fn.name} parameter ${i} expected string but got ${typeof param}`;
          this.validationErrors.push(error);
          console.warn(error);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Runtime validation error:', error);
      return false;
    }
  }

  validateStringParameters(obj: Record<string, any>): Record<string, string> {
    const validated: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      validated[key] = validateStringParam(value, `default_${key}`);
    }
    
    return validated;
  }

  checkSystemIntegrity(): { status: 'healthy' | 'warning' | 'error', issues: string[] } {
    const issues: string[] = [];
    
    // Check if ActionTypes are properly defined
    if (!ActionTypes || Object.keys(ActionTypes).length === 0) {
      issues.push('ActionTypes not properly defined');
    }
    
    // Check if required services are available
    if (typeof window !== 'undefined') {
      if (!window.speechSynthesis) {
        issues.push('Speech synthesis not available');
      }
    }
    
    // Check validation errors
    if (this.validationErrors.length > 0) {
      issues.push(`${this.validationErrors.length} validation errors detected`);
    }
    
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    if (issues.length > 0) {
      status = issues.some(issue => issue.includes('error')) ? 'error' : 'warning';
    }
    
    return { status, issues };
  }

  getValidationErrors(): string[] {
    return [...this.validationErrors];
  }

  clearValidationErrors(): void {
    this.validationErrors = [];
  }
}

export const runtimeValidator = RuntimeValidator.getInstance();


import { VALIDATION_RULES } from '@/config/constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class Validator {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else if (!VALIDATION_RULES.email.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    const rules = VALIDATION_RULES.password;
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < rules.minLength) {
        errors.push(`Password must be at least ${rules.minLength} characters long`);
      }
      
      if (rules.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      
      if (rules.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      
      if (rules.requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }
    
    return { isValid: errors.length === 0, errors };
  }

  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    
    if (phone && !VALIDATION_RULES.phone.test(phone)) {
      errors.push('Please enter a valid phone number');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  static validateRequired(value: any, fieldName: string): ValidationResult {
    const errors: string[] = [];
    
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${fieldName} is required`);
    }
    
    return { isValid: errors.length === 0, errors };
  }

  static combineValidations(...validations: ValidationResult[]): ValidationResult {
    const allErrors = validations.flatMap(v => v.errors);
    return { isValid: allErrors.length === 0, errors: allErrors };
  }
}

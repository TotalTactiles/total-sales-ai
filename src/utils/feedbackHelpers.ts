
import { toast } from 'sonner';

export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 4000,
  });
};

export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 6000,
  });
};

export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 4000,
  });
};

export const showLoadingToast = (message: string, promise: Promise<any>) => {
  return toast.promise(promise, {
    loading: message,
    success: 'Operation completed successfully!',
    error: 'Operation failed. Please try again.',
  });
};

// Auth-specific feedback
export const showAuthFeedback = {
  loginSuccess: () => showSuccessToast('Welcome back!', 'You have been logged in successfully.'),
  loginError: (error?: string) => showErrorToast('Login failed', error || 'Please check your credentials and try again.'),
  logoutSuccess: () => showSuccessToast('Logged out', 'You have been logged out successfully.'),
  sessionExpired: () => showErrorToast('Session expired', 'Please log in again to continue.'),
  unauthorized: () => showErrorToast('Access denied', 'You do not have permission to access this resource.'),
  signupSuccess: () => showSuccessToast('Account created!', 'Please check your email to verify your account.'),
  signupError: (error?: string) => showErrorToast('Signup failed', error || 'Please try again with different credentials.'),
};

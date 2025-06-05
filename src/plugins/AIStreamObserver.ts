export interface AIStreamObserver {
  onStart?: () => void;
  onUpdate?: (chunk: unknown) => void;
  onComplete?: () => void;
  onError?: (err: unknown) => void;
}

export const noopAIStreamObserver: AIStreamObserver = {
  onStart: undefined,
  onUpdate: undefined,
  onComplete: undefined,
  onError: undefined,
};

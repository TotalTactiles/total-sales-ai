export interface AIStreamObserver {
  onStart?: () => void;
  onUpdate?: (chunk: unknown) => void;
  onComplete?: () => void;
  onError?: (err: unknown) => void;
}

export const AIStreamObserver: AIStreamObserver = {
  onStart: undefined,
  onUpdate: undefined,
  onComplete: undefined,
  onError: undefined,
};

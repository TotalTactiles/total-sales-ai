import { useEffect } from 'react';

interface UseKeyboardShortcutOptions {
  keys: string[];
  callback: () => void;
  enabled?: boolean;
}

export const useKeyboardShortcut = ({ keys, callback, enabled = true }: UseKeyboardShortcutOptions) => {
  useEffect(() => {
    if (!enabled) return;

    let keySequence: string[] = [];
    
    const handleKeyPress = (event: KeyboardEvent) => {
      keySequence.push(event.key);
      
      // Keep only the last N keys where N is the length of target sequence
      if (keySequence.length > keys.length) {
        keySequence = keySequence.slice(-keys.length);
      }
      
      // Check if sequence matches
      if (keySequence.length === keys.length && 
          keySequence.every((key, index) => key === keys[index])) {
        callback();
        keySequence = []; // Reset sequence
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keys, callback, enabled]);
};

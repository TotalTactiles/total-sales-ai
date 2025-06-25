
import { useState, useEffect } from 'react';

export const useDeveloperSecretTrigger = () => {
  const [showDeveloperLogin, setShowDeveloperLogin] = useState(false);

  useEffect(() => {
    let dotSequence = '';
    let timeoutId: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '.') {
        dotSequence += '.';
        
        // Clear timeout if it exists
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        // Check if we have three dots
        if (dotSequence === '...') {
          setShowDeveloperLogin(true);
          dotSequence = '';
          return;
        }
        
        // Reset sequence after 2 seconds of inactivity
        timeoutId = setTimeout(() => {
          dotSequence = '';
        }, 2000);
      } else if (e.key !== 'Shift' && e.key !== 'Meta' && e.key !== 'Control' && e.key !== 'Alt') {
        // Reset on any other meaningful key press
        dotSequence = '';
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return {
    showDeveloperLogin,
    setShowDeveloperLogin
  };
};

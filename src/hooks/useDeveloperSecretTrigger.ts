
import { useState, useEffect } from 'react';

export const useDeveloperSecretTrigger = () => {
  const [showDeveloperLogin, setShowDeveloperLogin] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);

  const secretSequence = ['d', 'e', 'v', 'm', 'o', 'd', 'e'];

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const newSequence = [...keySequence, event.key.toLowerCase()].slice(-secretSequence.length);
      setKeySequence(newSequence);

      if (newSequence.join('') === secretSequence.join('')) {
        setShowDeveloperLogin(true);
        setKeySequence([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

  return {
    showDeveloperLogin,
    setShowDeveloperLogin
  };
};

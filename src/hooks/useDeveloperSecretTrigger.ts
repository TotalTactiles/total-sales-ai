
import { useState } from 'react';

export const useDeveloperSecretTrigger = () => {
  const [showDeveloperLogin, setShowDeveloperLogin] = useState(false);

  return {
    showDeveloperLogin,
    setShowDeveloperLogin
  };
};

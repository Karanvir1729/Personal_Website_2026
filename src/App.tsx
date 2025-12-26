import React, { useState } from 'react';
import { Desktop } from './components/os/Desktop';
import { BootScreen } from './components/os/BootScreen';

const App: React.FC = () => {
  // Check if we should skip boot (e.g. development or user preference)
  const [booted, setBooted] = useState(() => {
    return localStorage.getItem('skipBoot') === 'true';
  });

  const handleBootComplete = () => {
    setBooted(true);
    // Optional: save to local storage to skip next time if desired, or keep it every time
  };

  return (
    <>
      {!booted ? (
        <BootScreen onComplete={handleBootComplete} />
      ) : (
        <Desktop />
      )}
    </>
  );
};

export default App;

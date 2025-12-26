import React, { useState } from 'react';
import { Desktop } from './components/os/Desktop';
import { BootScreen } from './components/os/BootScreen';
import { WelcomeTour } from './components/os/WelcomeTour';

const App: React.FC = () => {
  // Check if we should skip boot (e.g. development or user preference)
  const [booted, setBooted] = useState(() => {
    return localStorage.getItem('skipBoot') === 'true';
  });

  // Check if this is a first-time visitor who hasn't seen the tour
  const [showTour, setShowTour] = useState(() => {
    return localStorage.getItem('tourCompleted') !== 'true';
  });

  const handleBootComplete = () => {
    setBooted(true);
  };

  const handleTourComplete = () => {
    setShowTour(false);
  };

  return (
    <>
      {!booted ? (
        <BootScreen onComplete={handleBootComplete} />
      ) : (
        <>
          <Desktop />
          {showTour && <WelcomeTour onComplete={handleTourComplete} />}
        </>
      )}
    </>
  );
};

export default App;


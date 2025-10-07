import React, { useState, useEffect, useCallback } from 'react';

const EmergencyButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmergency = useCallback(async () => {
    setIsPressed(true);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert('Emergency alert sent successfully! Help is on the way.');
    } catch (error) {
      alert('Failed to send emergency alert. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsPressed(false), 5000);
    }
  }, []);

  useEffect(() => {
    const onGlobalEmergency = () => {
      if (!isLoading && !isPressed) {
        handleEmergency();
      }
    };
    window.addEventListener('global-emergency', onGlobalEmergency);
    return () => window.removeEventListener('global-emergency', onGlobalEmergency);
  }, [handleEmergency, isLoading, isPressed]);

  return (
    <div className="emergency-controls">
      <button 
        className={`panic-button ${isPressed ? 'pressed' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={handleEmergency}
        disabled={isLoading || isPressed}
      >
        <div className="button-content">
          <span className="emergency-icon">🚨</span>
          <span className="button-text">
            {isLoading ? 'SENDING ALERT...' : isPressed ? 'ALERT SENT' : 'PANIC ALERT'}
          </span>
        </div>
        <div className="button-glow"></div>
      </button>

      <div className="emergency-info">
        <p>Press in case of emergency</p>
        <p>This will alert dispatch and nearby units</p>
      </div>


    </div>
  );
};

export default EmergencyButton;

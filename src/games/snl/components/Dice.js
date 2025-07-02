// src/components/Dice.js

import React from 'react';
// No need to import Dice.css here, it's imported in App.js

const Dice = ({ onRoll, diceResult, disabled, isRolling }) => { // Added isRolling prop

  /**
   * Renders the dots for a given dice face value.
   * Uses CSS Grid for precise positioning.
   * @param {number} value - The dice value (1-6).
   * @returns {JSX.Element[]} Array of span elements representing dots.
   */
  const renderDiceFaceDots = (value) => {
    // These arrays represent the positions of dots on a 3x3 grid for each dice face
    const dotPositions = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'mid-left', 'mid-right', 'bottom-left', 'bottom-right'],
    };

    if (value === 0 || !dotPositions[value]) {
      return null; // Don't show dots when diceResult is 0 or invalid (e.g., during rolling)
    }

    return dotPositions[value].map((pos, index) => (
      <span key={index} className={`dice-dot ${pos}`}></span>
    ));
  };

  return (
    <div className="dice-container">
      <button onClick={onRoll} className="roll-button" disabled={disabled}>
        {/* Change button text based on rolling state */}
        {isRolling ? 'Rolling...' : (disabled ? 'Game Over' : 'Roll Dice')}
      </button>
      {/* Apply 'is-rolling' class for animation */}
      <div className={`dice ${isRolling ? 'is-rolling' : ''}`}>
        {isRolling ? (
          // Placeholder icon during the rolling animation
          <span className="dice-icon-placeholder">🎲</span>
        ) : (
          // Render the actual dice face with dots when not rolling
          <div className="dice-face-grid">
            {renderDiceFaceDots(diceResult)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dice;
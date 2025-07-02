// src/components/Player.js

import React from 'react';
// No need to import Player.css here, it's imported in App.js

const Player = ({ player, position, isCurrentPlayer }) => {
  return (
    // The CSS for .player will make the movement smooth
    <div className={`player ${player} ${isCurrentPlayer ? 'active-player' : ''}`}>
      <span className="player-icon">{player === 'player1' ? '🔵' : '🔴'}</span>
    </div>
  );
};

export default Player;
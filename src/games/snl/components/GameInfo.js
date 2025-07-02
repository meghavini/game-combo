// src/components/GameInfo.js

import React from 'react';
// No need to import any new CSS, uses App.css or internal styles

const GameInfo = ({ currentPlayer, gameMessage, gameOver, playerPositions }) => {
  return (
    <div className="game-info">
      {!gameOver && (
        <p className="current-turn">
          It's <span className={`player-turn-name ${currentPlayer}`}>{currentPlayer.toUpperCase()}'s</span> turn.
        </p>
      )}
      <p className="game-message">{gameMessage}</p>
      <div className="player-scores">
        <p>Player 1: <span className="player1-score">{playerPositions.player1}</span></p>
        <p>Player 2: <span className="player2-score">{playerPositions.player2}</span></p>
      </div>
    </div>
  );
};

export default GameInfo;
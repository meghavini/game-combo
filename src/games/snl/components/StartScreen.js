import React, { useState } from 'react';
import './StartScreen.css';

const StartScreen = ({ onStart }) => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleStart = () => {
    if (player1Name.trim() && player2Name.trim()) {
      onStart({ player1: player1Name, player2: player2Name });
    }
  };

  return (
    <div className="start-screen">
      <h2>🎮 Snake and Ladders</h2>
      <input
        type="text"
        placeholder="Enter Player 1 Name"
        value={player1Name}
        onChange={(e) => setPlayer1Name(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Player 2 Name"
        value={player2Name}
        onChange={(e) => setPlayer2Name(e.target.value)}
      />
      <button onClick={handleStart} disabled={!player1Name || !player2Name}>
        Start Game
      </button>
    </div>
  );
};

export default StartScreen;

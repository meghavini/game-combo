import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Ludo.css';

const COLORS = ['red', 'blue', 'green', 'yellow'];

function LudoSetup() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([{ name: '', color: '' }]);
  const [error, setError] = useState('');

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { name: '', color: '' }]);
    }
  };

  const updatePlayer = (index, field, value) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const startGame = () => {
    const chosenColors = players.map(p => p.color);
    const isValid = players.every(p => p.name && p.color) &&
      new Set(chosenColors).size === players.length;

    if (!isValid) {
      setError('Please enter names and select unique colors.');
      return;
    }

    localStorage.setItem('ludoPlayers', JSON.stringify(players));
    navigate('/ludo-game');
  };

  return (
    <div className="setup-container">
      <h2>🎮 Ludo Setup</h2>
      {players.map((player, index) => (
        <div key={index} className="player-setup">
          <input
            type="text"
            placeholder={`Player ${index + 1} Name`}
            value={player.name}
            onChange={e => updatePlayer(index, 'name', e.target.value)}
          />
          <select
            value={player.color}
            onChange={e => updatePlayer(index, 'color', e.target.value)}
          >
            <option value="">Select Color</option>
            {COLORS.map(c => (
              <option key={c} value={c} disabled={players.some(p => p.color === c && p !== player)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>
      ))}
      {error && <p className="error">{error}</p>}
      <button onClick={addPlayer} disabled={players.length >= 4}>➕ Add Player</button>
      <button onClick={startGame}>🎲 Start Game</button>
    </div>
  );
}

export default LudoSetup;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TicTacToe from './games/TicTacToe/TicTacToe';
import LudoSetup from './games/Ludo/LudoSetup';
import LudoGame from './games/Ludo/LudoGame';
//import SnakeSetup from './games/SnakeAndLadders/SnakeSetup';
import SnlMain from './games/snl/Snlmain';

import './App.css';

function App() {
  return (
    <Router>
      <div className="container dark-theme">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/ludo-setup" element={<LudoSetup />} />
          <Route path="/ludo-game" element={<LudoGame />} />
          <Route path="/snlmain" element={<SnlMain />} />
          
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home">
      <h1 className="neon-text">🎮 Game Combo</h1>
      <div className="game-grid">
        <Link to="/tic-tac-toe" className="game-card">
          <span role="img" aria-label="Tic Tac Toe" className="emoji">❌⭕</span>
          <h3>Tic Tac Toe</h3>
        </Link>

        <Link to="/ludo-setup" className="game-card">
          <span role="img" aria-label="Ludo" className="emoji">🎲</span>
          <h3>Ludo</h3>
        </Link>

        <Link to="/snlmain" className="game-card">
  <span role="img" aria-label="Snake & Ladder" className="emoji">🐍🪜</span>
  <h3>Snake & Ladders</h3>
</Link>



        <div className="game-card inactive">
          <span role="img" aria-label="Snake & Ladder" className="emoji">🎯</span>
          <h3>Darts</h3>
          <p className="coming-soon">Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

export default App;

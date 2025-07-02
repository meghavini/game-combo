import './TicTacToe.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function App() {
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [nameInputDone, setNameInputDone] = useState(false);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState(null);

  const isDraw = !winner && isBoardFull(board);

  const status = winner
    ? `Winner: ${winner === 'X' ? playerX : playerO}`
    : isDraw
    ? "It's a draw!"
    : `Next Turn: ${isXTurn ? playerX : playerO}`;

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result);
      setShowModal(true);
    } else if (isBoardFull(newBoard)) {
      setWinner('Draw');
      setShowModal(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setShowModal(false);
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (playerX.trim() && playerO.trim()) {
      setNameInputDone(true);
    }
  };

  return (
    <div className="container dark-theme">
      {!nameInputDone ? (
        <form className="name-form" onSubmit={handleStart}>
          <h2 className="neon-text">Enter Player Names</h2>
          <Link to="/" className="back-icon-btn" title="Back to Home">🏠</Link>
          <input
            type="text"
            placeholder="Player X Name"
            value={playerX}
            onChange={(e) => setPlayerX(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Player O Name"
            value={playerO}
            onChange={(e) => setPlayerO(e.target.value)}
            required
          />
          <button type="submit" className="reset-btn">Start Game</button>
        </form>
      ) : (
        <>
          <h1 className="neon-text">Tic Tac Toe</h1>
          <div className="status">{status}</div>
          <div className="board">
            {board.map((cell, index) => (
              <div
                key={index}
                className="square"
                onClick={() => handleClick(index)}
              >
                {cell}
              </div>
            ))}
          </div>
          <button className="reset-btn" onClick={resetGame}>Reset</button>

          <Link to="/" className="back-icon-btn" title="Back to Home">🏠</Link>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>
                  {winner === 'Draw'
                    ? "It's a Draw!"
                    : `🎉 ${winner === 'X' ? playerX : playerO} Wins!`}
                </h2>
                <button className="reset-btn" onClick={resetGame}>Play Again</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

export default App;

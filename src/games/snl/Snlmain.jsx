// src/App.js

import React, { useState, useCallback, useRef } from 'react';
import Board from './components/Board';
import Dice from './components/Dice';
import Player from './components/Player';
import GameInfo from './components/GameInfo';
import './styles/App.css';
import './styles/Board.css';
import './styles/Cell.css';
import './styles/Player.css';
import './styles/Dice.css';

// Game configuration constants
const NUM_CELLS = 100; // 10x10 board
const NUM_ROWS = 10;
const NUM_COLS = 10;

// Define your snakes and ladders more clearly
const SNAKES = [
  { id: 's1', head: 17, tail: 7, message: 'Oh no! A snake sent you down from 17 to 7!' },
  { id: 's2', head: 54, tail: 34, message: 'Slid down the snake from 54 to 34!' },
  { id: 's3', head: 62, tail: 19, message: 'Big snake bite! Down from 62 to 19.' },
  { id: 's4', head: 64, tail: 60, message: 'Short snake, but still a slide from 64 to 60.' },
  { id: 's5', head: 87, tail: 24, message: 'Ouch! Long snake from 87 to 24!' },
  { id: 's6', head: 93, tail: 73, message: 'Almost there, but a snake from 93 to 73!' },
  { id: 's7', head: 95, tail: 75, message: 'Another one! 95 down to 75.' },
  { id: 's8', head: 98, tail: 79, message: 'So close! Snake from 98 to 79.' },
];

const LADDERS = [
  { id: 'l1', start: 4, end: 14, message: 'Hooray! A ladder from 4 to 14!' },
  { id: 'l2', start: 9, end: 31, message: 'Climbed up from 9 to 31!' },
  { id: 'l3', start: 20, end: 38, message: 'Nice! Ladder from 20 to 38.' },
  { id: 'l4', start: 28, end: 84, message: 'Woah! A super ladder from 28 to 84!' },
  { id: 'l5', start: 40, end: 59, message: 'Up the ladder from 40 to 59.' },
  { id: 'l6', start: 51, end: 67, message: 'Another climb from 51 to 67!' },
  { id: 'l7', start: 63, end: 81, message: 'Good climb from 63 to 81.' },
  { id: 'l8', start: 71, end: 91, message: 'Almost to the top! Ladder from 71 to 91.' },
];

const ANIMATION_DELAY_PER_CELL = 150; // Milliseconds per cell for player movement
const DICE_ANIMATION_DURATION = 1000; // Milliseconds for dice rolling animation
const DIRECT_JUMP_DURATION = 500; // Milliseconds for snake/ladder direct jump

function App() {
  // Actual game positions (where the player logically is)
  const [playerPositions, setPlayerPositions] = useState({
    player1: 1,
    player2: 1,
  });
  // Animation positions (where the player is visually during movement)
  const [playerAnimationPositions, setPlayerAnimationPositions] = useState({
    player1: 1,
    player2: 1,
  });
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [diceResult, setDiceResult] = useState(0);
  const [gameMessage, setGameMessage] = useState('Player 1, roll the dice!');
  const [gameOver, setGameOver] = useState(false);
  const [isMoving, setIsMoving] = useState(false); // Player movement animation in progress
  const [isRollingDice, setIsRollingDice] = useState(false); // Dice rolling animation in progress

  // useRef to keep track of current animation interval to clear it
  const animationIntervalRef = useRef(null);

  /**
   * Animates player movement step by step or as a direct jump.
   * @param {string} player - The player ('player1' or 'player2').
   * @param {number} startPos - The starting cell number for the animation.
   * @param {number} endPos - The target cell number for the animation.
   * @param {boolean} isDirectJump - True if this is a direct jump (snake/ladder), false for step-by-step.
   */
  const animatePlayerMovement = useCallback((player, startPos, endPos, isDirectJump = false) => {
    setIsMoving(true); // Disable rolling during player movement

    // Clear any existing animation interval for this player
    if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
    }

    if (isDirectJump) {
      // For direct jumps (snakes/ladders), immediately set the final position
      setPlayerAnimationPositions(prev => ({
        ...prev,
        [player]: endPos,
      }));

      // After the CSS transition duration, mark movement as complete
      setTimeout(() => {
        setIsMoving(false);
        // Check for game end or switch turn AFTER the direct jump animation completes
        if (endPos === NUM_CELLS) {
            setGameOver(true);
            setGameMessage(`${player.toUpperCase()} wins! Congratulations!`);
        } else {
            // No turn switch here, as the turn was already handled after the initial roll move
            // Or if it's the final snake/ladder move, the game might be over.
            // The turn switch for the *next* player happens after the initial dice roll animation.
        }
      }, DIRECT_JUMP_DURATION); // Match CSS transition duration for direct jumps

    } else {
      // For step-by-step movement (dice roll)
      let currentAnimationPos = startPos;
      animationIntervalRef.current = setInterval(() => {
        let nextPos = currentAnimationPos;

        if (startPos < endPos) { // Moving forward
          nextPos = currentAnimationPos + 1;
          if (nextPos > endPos) {
            clearInterval(animationIntervalRef.current);
            setIsMoving(false); // Enable rolling after animation
            return;
          }
        } else if (startPos > endPos) { // Moving backward (shouldn't happen for dice roll, but for safety)
          nextPos = currentAnimationPos - 1;
          if (nextPos < endPos) {
            clearInterval(animationIntervalRef.current);
            setIsMoving(false); // Enable rolling after animation
            return;
          }
        } else { // No movement needed (startPos === endPos)
          clearInterval(animationIntervalRef.current);
          setIsMoving(false);
          return;
        }

        setPlayerAnimationPositions(prev => ({
          ...prev,
          [player]: nextPos,
        }));
        currentAnimationPos = nextPos;

        // When player reaches the final (logical) position for this animation segment
        if (currentAnimationPos === endPos) {
          clearInterval(animationIntervalRef.current);
          setIsMoving(false); // Enable rolling after animation

          // Only check for game end or switch player if this wasn't a snake/ladder auto-move
          if (endPos === NUM_CELLS) {
              setGameOver(true);
              setGameMessage(`${player.toUpperCase()} wins! Congratulations!`);
          } else {
              // Switch turn after initial dice roll movement
              setCurrentPlayer(prevPlayer => prevPlayer === 'player1' ? 'player2' : 'player1');
              setGameMessage(`It's ${ (player === 'player1' ? 'Player 2' : 'Player 1')}'s turn. Roll the dice!`);
          }
        }
      }, ANIMATION_DELAY_PER_CELL);
    }
  }, []); // Dependencies for useCallback

  /**
   * Handles the dice roll action, including dice animation and player movement.
   */
  const handleRollDice = useCallback(() => {
    // Prevent rolling if game is over, player is moving, or dice is already rolling
    if (gameOver || isMoving || isRollingDice) return;

    setIsRollingDice(true); // Start dice rolling animation
    setDiceResult(0); // Clear previous dice result visually

    // Delay the actual dice result and player movement until after dice animation
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDiceResult(roll); // Set the final dice result for display

      setIsRollingDice(false); // Dice animation finished

      const oldPosition = playerPositions[currentPlayer];
      let newCalculatedPosition = oldPosition + roll;
      let finalLogicalPosition = newCalculatedPosition; // Where player *should* end up after all moves

      // Check for overshoot
      if (newCalculatedPosition > NUM_CELLS) {
        setGameMessage(`${currentPlayer.toUpperCase()} needs exactly ${NUM_CELLS - oldPosition} to win! Stay put.`);
        // Player stays at current position if overshot, just switch turn
        setTimeout(() => {
          setCurrentPlayer(prevPlayer => prevPlayer === 'player1' ? 'player2' : 'player1');
          setGameMessage(`It's ${ (currentPlayer === 'player1' ? 'Player 2' : 'Player 1')}'s turn. Roll the dice!`);
        }, 1500); // Give time for message to display
        return; // Exit function as no player movement occurs
      }

      // Update actual game position immediately for the rolled move
      setPlayerPositions(prev => ({
        ...prev,
        [currentPlayer]: newCalculatedPosition,
      }));

      // Start the step-by-step animation to the rolled position
      animatePlayerMovement(currentPlayer, oldPosition, newCalculatedPosition, false); // Not a direct jump

      // Calculate total delay before checking for snake/ladder,
      // ensuring initial player movement animation completes.
      const totalMoveDelay = (roll * ANIMATION_DELAY_PER_CELL) + 500; // Add a small buffer

      setTimeout(() => {
        let intermediateMessage = "";
        let isSnakeLadderJump = false;
        let snakeLadderStartPos = newCalculatedPosition; // Starting point for potential jump

        // Check for snakes
        const snake = SNAKES.find(s => s.head === finalLogicalPosition);
        if (snake) {
          finalLogicalPosition = snake.tail;
          intermediateMessage = snake.message;
          isSnakeLadderJump = true;
          snakeLadderStartPos = snake.head; // Set start for animation to head
        }

        // Check for ladders
        const ladder = LADDERS.find(l => l.start === finalLogicalPosition);
        if (ladder) {
          finalLogicalPosition = ladder.end;
          intermediateMessage = ladder.message;
          isSnakeLadderJump = true;
          snakeLadderStartPos = ladder.start; // Set start for animation to start
        }

        if (isSnakeLadderJump) {
          setGameMessage(intermediateMessage);
          // Update actual game position for snake/ladder jump
          setPlayerPositions(prev => ({
              ...prev,
              [currentPlayer]: finalLogicalPosition,
          }));
          // Animate the snake/ladder jump after a short pause
          setTimeout(() => {
              // Pass true for isDirectJump for snake/ladder movements
              animatePlayerMovement(currentPlayer, snakeLadderStartPos, finalLogicalPosition, true);
          }, 500); // Short delay before snake/ladder jump animation
        }
        // If no snake/ladder, the turn has already switched by animatePlayerMovement
        // and initial message will be updated there.
      }, totalMoveDelay);

    }, DICE_ANIMATION_DURATION); // Delay player movement by dice animation duration

  }, [currentPlayer, gameOver, isMoving, isRollingDice, playerPositions, animatePlayerMovement]);

  /**
   * Resets the game to its initial state.
   */
  const resetGame = () => {
    setPlayerPositions({ player1: 1, player2: 1 });
    setPlayerAnimationPositions({ player1: 1, player2: 1 }); // Reset animation positions too
    setCurrentPlayer('player1');
    setDiceResult(0);
    setGameMessage('Game reset! Player 1, roll the dice!');
    setGameOver(false);
    setIsMoving(false);
    setIsRollingDice(false);
    // Clear any active animation interval
    if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
    }
  };

  return (
    <div className="game-container">
      <h1 className="game-title">🐍 Snake and Ladders 🪜</h1>
      <div className="game-area">
        <Board
          numCells={NUM_CELLS}
          numRows={NUM_ROWS}
          numCols={NUM_COLS}
          snakes={SNAKES}
          ladders={LADDERS}
        >
          {/* Render players using their animation positions for smooth movement */}
          {Object.entries(playerAnimationPositions).map(([player, position]) => (
            <Player
              key={player}
              player={player}
              position={position}
              // Highlight current player only if it's their turn AND no animation is active
              isCurrentPlayer={player === currentPlayer && !isMoving && !isRollingDice}
            />
          ))}
        </Board>
        <div className="controls-panel">
          <GameInfo
            currentPlayer={currentPlayer}
            gameMessage={gameMessage}
            gameOver={gameOver}
            playerPositions={playerPositions} // Still show actual player positions in info
          />
          <Dice
            onRoll={handleRollDice}
            diceResult={diceResult}
            // Disable button if game over, player moving, or dice rolling
            disabled={gameOver || isMoving || isRollingDice}
            isRolling={isRollingDice} // Pass rolling state to Dice component
          />
          {gameOver && (
            <button className="reset-button" onClick={resetGame}>Play Again</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import { useLudoGame } from './hooks/useLudoGame';
import LudoBoard from './components/LudoBoard';
import { STATE } from './constants';
import './style.css'; // Make sure to import your CSS

const LudoGame = () => {
    const {
        currentPositions,
        diceValue,
        activePlayer,
        gameState,
        eligiblePieces,
        onDiceClick,
        resetGame,
        handlePieceClick,
        winner
    } = useLudoGame();

    return (
        <div className="ludo-game-wrapper">
            <LudoBoard
                currentPositions={currentPositions}
                activePlayer={activePlayer}
                eligiblePieces={eligiblePieces}
                onPieceClick={handlePieceClick}
            />
            <div className="footer">
                <div className="row">
                    <button
                        id="dice-btn"
                        className="btn btn-dice"
                        onClick={onDiceClick}
                        disabled={gameState !== STATE.DICE_NOT_ROLLED}
                    >
                        Roll
                    </button>
                    <div className="dice-value">{diceValue}</div>
                    <button
                        id="reset-btn"
                        className="btn btn-reset"
                        onClick={resetGame}
                    >
                        Reset
                    </button>
                </div>
                <h2 className="active-player">Active Player: <span>{activePlayer}</span> </h2>
                {winner && <h2>Winner: {winner}!</h2>}
            </div>
        </div>
    );
};

export default LudoGame;
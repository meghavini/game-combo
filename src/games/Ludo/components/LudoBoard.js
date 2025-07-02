import React from 'react';
import PlayerPiece from './PlayerPiece';
import '../style.css'; // Import the original style.css

const LudoBoard = ({ currentPositions, activePlayer, eligiblePieces, onPieceClick }) => {
    return (
        <div className="ludo-container">
            <div className="ludo">
                <div className="player-pieces">
                    {Object.keys(currentPositions).map(player => (
                        currentPositions[player].map((position, pieceId) => (
                            <PlayerPiece
                                key={`${player}-${pieceId}`}
                                player={player}
                                pieceId={pieceId}
                                position={position}
                                isHighlighted={
                                    player === activePlayer && eligiblePieces.includes(pieceId)
                                }
                                onClick={() => onPieceClick(player, pieceId)}
                            />
                        ))
                    ))}
                </div>

                <div className="player-bases">
                    <div className={`player-base ${activePlayer === 'P1' ? 'highlight' : ''}`} player-id="P1"></div>
                    <div className={`player-base ${activePlayer === 'P2' ? 'highlight' : ''}`} player-id="P2"></div>
                </div>
            </div>
        </div>
    );
};

export default LudoBoard;
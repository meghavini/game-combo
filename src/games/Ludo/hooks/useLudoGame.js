import { useState, useEffect, useCallback } from 'react';
import { BASE_POSITIONS, HOME_ENTRANCE, HOME_POSITIONS, PLAYERS, SAFE_POSITIONS, START_POSITIONS, STATE, TURNING_POINTS } from '../constants';

export const useLudoGame = () => {
    const [currentPositions, setCurrentPositions] = useState(structuredClone(BASE_POSITIONS));
    const [diceValue, setDiceValue] = useState(null);
    const [turn, setTurn] = useState(0); // 0 for P1, 1 for P2
    const [gameState, setGameState] = useState(STATE.DICE_NOT_ROLLED);
    const [eligiblePieces, setEligiblePieces] = useState([]);
    const [winner, setWinner] = useState(null);

    const activePlayer = PLAYERS[turn];

    const setPiecePosition = useCallback((player, piece, newPosition) => {
        setCurrentPositions(prevPositions => {
            const newPositions = structuredClone(prevPositions);
            newPositions[player][piece] = newPosition;
            return newPositions;
        });
    }, []);

    const resetGame = useCallback(() => {
        setCurrentPositions(structuredClone(BASE_POSITIONS));
        setDiceValue(null);
        setTurn(0);
        setGameState(STATE.DICE_NOT_ROLLED);
        setEligiblePieces([]);
        setWinner(null);
    }, []);

    const getEligiblePieces = useCallback((player) => {
        return [0, 1, 2, 3].filter(piece => {
            const currentPosition = currentPositions[player][piece];

            if(currentPosition === HOME_POSITIONS[player]) {
                return false;
            }

            if(
                BASE_POSITIONS[player].includes(currentPosition)
                && diceValue !== 6
            ){
                return false;
            }

            if(
                HOME_ENTRANCE[player].includes(currentPosition)
                && diceValue > (HOME_POSITIONS[player] - currentPosition)
                ) {
                return false;
            }

            return true;
        });
    }, [currentPositions, diceValue]);

    const checkForEligiblePieces = useCallback(() => {
        const player = PLAYERS[turn];
        const pieces = getEligiblePieces(player);
        if(pieces.length) {
            setEligiblePieces(pieces);
        } else {
            incrementTurn();
        }
    }, [turn, getEligiblePieces]);

    const incrementTurn = useCallback(() => {
        setTurn(prevTurn => prevTurn === 0 ? 1 : 0);
        setGameState(STATE.DICE_NOT_ROLLED);
        setEligiblePieces([]);
    }, []);

    const onDiceClick = useCallback(() => {
        if (gameState !== STATE.DICE_NOT_ROLLED) return;
        const value = 1 + Math.floor(Math.random() * 6);
        setDiceValue(value);
        setGameState(STATE.DICE_ROLLED);
    }, [gameState]);

    // Effect to check for eligible pieces after dice roll
    useEffect(() => {
        if (gameState === STATE.DICE_ROLLED && diceValue !== null) {
            checkForEligiblePieces();
        }
    }, [gameState, diceValue, checkForEligiblePieces]);

    // Modified to accept currentPos as an argument
    const getNextSingleStepPosition = useCallback((player, currentPos) => {
        if(currentPos === TURNING_POINTS[player]) {
            return HOME_ENTRANCE[player][0];
        }
        else if(currentPos === 51) {
            return 0;
        }
        return currentPos + 1;
    }, [TURNING_POINTS, HOME_ENTRANCE]); // Removed dependency on currentPositions

    const hasPlayerWon = useCallback((player) => {
        return [0, 1, 2, 3].every(piece => currentPositions[player][piece] === HOME_POSITIONS[player]);
    }, [currentPositions]);

    const checkForKill = useCallback((player, piece) => {
        const currentPos = currentPositions[player][piece];
        const opponent = player === 'P1' ? 'P2' : 'P1';
        let killOccurred = false;

        const updatedOpponentPositions = currentPositions[opponent].map((opponentPosition, oppPieceId) => {
            if (currentPos === opponentPosition && !SAFE_POSITIONS.includes(currentPos)) {
                killOccurred = true;
                return BASE_POSITIONS[opponent][oppPieceId];
            }
            return opponentPosition;
        });

        if (killOccurred) {
            setCurrentPositions(prevPositions => ({
                ...prevPositions,
                [opponent]: updatedOpponentPositions
            }));
        }
        return killOccurred;
    }, [currentPositions]);

    const movePiece = useCallback((player, piece, moveBy) => {
        let stepsTaken = 0;
        // Capture the initial position of the piece from the current state
        let currentPiecePosition = currentPositions[player][piece];

        const interval = setInterval(() => {
            if (stepsTaken === moveBy) {
                clearInterval(interval);

                // Check if player won after all steps are moved
                if (hasPlayerWon(player)) {
                    setWinner(player);
                    setGameState(STATE.DICE_NOT_ROLLED);
                    return;
                }

                const isKill = checkForKill(player, piece);

                if (isKill || diceValue === 6) { // If a kill happened or dice was 6, current player gets another turn
                    setGameState(STATE.DICE_NOT_ROLLED);
                    return;
                }

                incrementTurn(); // Otherwise, switch turns
                return;
            }

            // Calculate the next single step position based on the local currentPiecePosition
            const nextPosition = getNextSingleStepPosition(player, currentPiecePosition);

            setCurrentPositions(prevPositions => {
                const newPositions = structuredClone(prevPositions);
                newPositions[player][piece] = nextPosition;
                return newPositions;
            });

            // Update the local variable for the next iteration
            currentPiecePosition = nextPosition;
            stepsTaken++;
        }, 200);
    }, [currentPositions, getNextSingleStepPosition, hasPlayerWon, checkForKill, diceValue, incrementTurn]);

    const handlePieceClick = useCallback((player, piece) => {
        const currentPosition = currentPositions[player][piece];

        if (BASE_POSITIONS[player].includes(currentPosition)) {
            if (diceValue === 6) {
                setPiecePosition(player, piece, START_POSITIONS[player]);
                setGameState(STATE.DICE_NOT_ROLLED);
                setEligiblePieces([]);
            }
            return;
        }

        setEligiblePieces([]); // Unhighlight all pieces
        movePiece(player, piece, diceValue);
    }, [currentPositions, diceValue, setPiecePosition, movePiece]);

    useEffect(() => {
        if (winner) {
            alert(`Player: ${winner} has won!`);
            // You might want to automatically reset the game or provide a button for it.
            // resetGame();
        }
    }, [winner]);


    return {
        currentPositions,
        diceValue,
        activePlayer,
        gameState,
        eligiblePieces,
        onDiceClick,
        resetGame,
        handlePieceClick,
        winner
    };
};
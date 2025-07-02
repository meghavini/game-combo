import React from 'react';
import { COORDINATES_MAP, STEP_LENGTH } from '../constants';
import './PlayerPiece.css'; // Create this CSS file

const PlayerPiece = ({ player, pieceId, position, isHighlighted, onClick }) => {
    const [x, y] = COORDINATES_MAP[position];

    const style = {
        top: y * STEP_LENGTH + '%',
        left: x * STEP_LENGTH + '%',
    };

    const classes = `player-piece ${isHighlighted ? 'highlight' : ''}`;

    return (
        <div
            className={classes}
            player-id={player}
            piece={pieceId}
            style={style}
            onClick={isHighlighted ? onClick : null}
        ></div>
    );
};

export default PlayerPiece;
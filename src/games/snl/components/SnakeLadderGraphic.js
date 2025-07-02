// src/components/SnakeLadderGraphic.js

import React from 'react';

const SnakeLadderGraphic = ({ type, startCoords, endCoords, numCols, numRows }) => {
  // Calculate positions in terms of percentage of board width/height
  // Assuming each cell is 1 unit (e.g., 1/numCols * 100%)
  const CELL_SIZE_PERCENT = 100 / numCols; // Assuming square cells

  // Convert grid coordinates to center of the cell in percentage
  const startX = (startCoords.gridColumn * CELL_SIZE_PERCENT) + (CELL_SIZE_PERCENT / 2);
  const startY = (startCoords.gridRow * CELL_SIZE_PERCENT) + (CELL_SIZE_PERCENT / 2);
  const endX = (endCoords.gridColumn * CELL_SIZE_PERCENT) + (CELL_SIZE_PERCENT / 2);
  const endY = (endCoords.gridRow * CELL_SIZE_PERCENT) + (CELL_SIZE_PERCENT / 2);

  // Calculate length and angle for the line
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  const style = {
    position: 'absolute',
    left: `${startX}%`,
    top: `${startY}%`,
    width: `${length}%`,
    transformOrigin: '0 50%',
    transform: `rotate(${angle}deg)`,
    zIndex: type === 'ladder' ? 20 : 10, // Ladders on top of snakes
    pointerEvents: 'none', // Don't block clicks on cells
  };

  return (
    <div className={`snake-ladder-graphic ${type}`} style={style}>
      {/* You can add SVG paths here for more complex shapes if needed */}
      {/* For now, just a simple line/rectangle */}
    </div>
  );
};

export default SnakeLadderGraphic;
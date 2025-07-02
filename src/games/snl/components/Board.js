// src/components/Board.js

import React from 'react';
import Cell from './Cell';
import SnakeLadderGraphic from './SnakeLadderGraphic';

const Board = ({ numCells, numRows, numCols, snakes, ladders, children }) => {
  // Logic to arrange cells in a snake-like pattern (right to left on even rows)
  const renderBoardCells = () => {
    const boardCells = [];
    for (let row = 0; row < numRows; row++) {
      const rowCells = [];
      const startCell = row * numCols + 1;
      const endCell = (row + 1) * numCols;

      if (row % 2 === 0) { // Even row (bottom to top, visually): Left to Right
        for (let col = startCell; col <= endCell; col++) {
          rowCells.push(col);
        }
      } else { // Odd row: Right to Left
        for (let col = endCell; col >= startCell; col--) {
          rowCells.push(col);
        }
      }
      boardCells.push(rowCells);
    }
    // Reverse the rows to have 1-10 at the bottom, 91-100 at the top visually
    return boardCells.reverse().flat();
  };

  const orderedCells = renderBoardCells();

  // Function to get grid coordinates from cell number (for placing graphics)
  // Assumes 1-indexed cells
  const getGridCoordinates = (cellNumber) => {
    const adjustedCellNumber = cellNumber - 1; // 0-indexed for calculations
    const row = Math.floor(adjustedCellNumber / numCols);
    let col;

    if (row % 2 === 0) { // Even row (visual bottom): Left to Right
      col = adjustedCellNumber % numCols;
    } else { // Odd row: Right to Left
      col = numCols - 1 - (adjustedCellNumber % numCols);
    }

    // Convert row to visual row (top to bottom) for CSS Grid
    const visualRow = (numRows - 1) - row;

    return { gridRow: visualRow, gridColumn: col };
  };

  return (
    <div className="board" style={{
      gridTemplateColumns: `repeat(${numCols}, 1fr)`,
      gridTemplateRows: `repeat(${numRows}, 1fr)` // Explicitly define rows
    }}>
      {orderedCells.map(cellNumber => (
        <Cell key={cellNumber} number={cellNumber}>
          {/* Render players inside the correct cell */}
          {React.Children.map(children, child => {
            if (child.props.position === cellNumber) {
              return child;
            }
            return null;
          })}
        </Cell>
      ))}

      {/* Render Snake and Ladder graphics overlay */}
      {snakes.map(snake => (
        <SnakeLadderGraphic
          key={snake.id}
          type="snake"
          startCoords={getGridCoordinates(snake.head)}
          endCoords={getGridCoordinates(snake.tail)}
          numCols={numCols}
          numRows={numRows}
        />
      ))}
      {ladders.map(ladder => (
        <SnakeLadderGraphic
          key={ladder.id}
          type="ladder"
          startCoords={getGridCoordinates(ladder.start)}
          endCoords={getGridCoordinates(ladder.end)}
          numCols={numCols}
          numRows={numRows}
        />
      ))}
    </div>
  );
};

export default Board;
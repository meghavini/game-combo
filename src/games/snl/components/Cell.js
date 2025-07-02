import React from 'react';
// No need to import Cell.css here, it's imported in App.js

const Cell = ({ number, children }) => {
  return (
    <div className="cell">
      <span className="cell-number">{number}</span>
      <div className="cell-content">
        {children} {/* Player component will be rendered here */}
      </div>
    </div>
  );
};

export default Cell;
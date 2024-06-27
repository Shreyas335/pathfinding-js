import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'; // Added forwardRef
import './grid.css'; // Import the CSS file

const colors = {
  DEFAULT: '#000000',
  ACTIVE: '#fc0000',
  WALL: '#eeeeee'
};

// Use forwardRef to pass ref to the component
const Grid = forwardRef(({ rows, columns }, ref) => {
  const [grid, setGrid] = useState(Array.from({ length: rows }, () => Array(columns).fill(0)));
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  const getColor = (cellValue) => {
    switch(cellValue) {
      case 1:
        return colors.ACTIVE;
      case 2:
        return colors.WALL;
      default:
        return colors.DEFAULT;
    }
  };

  const clearMaze = () => {
    const newGrid = grid.map(row => row.map(() => 0));
    setGrid(newGrid);
  };

  // Use useImperativeHandle to expose clearMaze to parent components
  useImperativeHandle(ref, () => ({
    clearMaze,
  }));

  const toggleCell = (row, col) => {
    if (isDragging) {
      const newGrid = [...grid];
      newGrid[row][col] = newGrid[row][col] === 2 ? 0 : 2;
      setGrid(newGrid);
    }
  };

  const handleRightClick = (rowIndex, colIndex, event) => {
    event.preventDefault();
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = 1;
    setGrid(newGrid);
  };

  return (
    <div 
      className="grid-container" 
      style={{ gridTemplateColumns: `repeat(${columns}, 25px)` }} 
      onMouseDown={handleMouseDown} 
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragStart={preventDragHandler}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`grid-cell ${cell === 1 ? 'active-cell' : cell === 2 ? 'wall-cell' : ''}`}
            onContextMenu={(event) => handleRightClick(rowIndex, colIndex, event)}
            onMouseLeave={() => toggleCell(rowIndex, colIndex)}
            draggable={false}
            style={{ backgroundColor: getColor(cell) }}
          />
        ))
      )}
    </div>
  );
});

export default Grid;
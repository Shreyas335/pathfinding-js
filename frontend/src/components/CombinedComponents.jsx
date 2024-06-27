import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import './Controls.css';
import './Grid.css';

// Define Grid component
const colors = {
  DEFAULT: '#000000',
  ACTIVE: '#fc0000',
  WALL: '#eeeeee'
};

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

Grid.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired
};

// Define Controls component
const Controls = () => {
  const gridRef = useRef(null); // Create a ref to hold the Grid component instance
  const [selectedMaze, setSelectedMaze] = useState('');

  useEffect(() => {
    loadMaze();
  }, []);

  const saveMaze = async () => {
    if (gridRef.current) {
      const gridData = gridRef.current.grid; // Access the grid data if needed
      try {
        const response = await fetch('http://127.0.0.1:5000/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gridData })
        });
        if (!response.ok) {
          throw new Error('Failed to save data');
        }
        console.log('Data saved successfully');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  const loadMaze = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/load');
      const data = await response.json();
      if (gridRef.current) {
        gridRef.current.setGrid(data.grid); // Set grid data through ref
        console.log('Grid loaded successfully');
      }
    } catch (error) {
      console.error('Error loading grid:', error);
    }
  };

  const selectMaze = (event) => {
    setSelectedMaze(event.target.value);
  };

  const clearGrid = () => {
    if (gridRef.current) {
      gridRef.current.clearMaze(); // Call clearMaze method through ref
    }
  };

  return (
    <div className="controls-container">
      <div className="joined-border">
        <h2>Maze Controls</h2>
        <div className="controls">
          <select value={selectedMaze} onChange={selectMaze}>
            <option value="">Select an algorithm</option>
            <option value="option1">Dijkstra's algorithm</option>
            <option value="option2">A* search algorithm</option>
            <option value="option3">Breadth-first search</option>
            <option value="option4">Depth-first search</option>
            <option value="option5">Bellman-Ford algorithm</option>
          </select>
          <button onClick={clearGrid}>Compute</button>
          <button onClick={clearGrid}>Clear</button>
        </div>
      </div>
      <div className="joined-border">
        <div className="grid-container">
          <Grid ref={gridRef} rows={25} columns={25} />
        </div>
      </div>
    </div>
  );
};



export default Controls;
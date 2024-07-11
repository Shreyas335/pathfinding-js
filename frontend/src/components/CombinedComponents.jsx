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


  const resultGrid = (array) => {
    setGrid(array)
  }


  

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

  const getGrid = () => {
    return grid
  }
  

  const clearMaze = () => {
    const newGrid = grid.map(row => row.map(() => 0));
    setGrid(newGrid);
  };

  useImperativeHandle(ref, () => ({
    clearMaze, getGrid, resultGrid,
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
  const [selectedAlgorithm, setSelectedAlgo] = useState('');

  

  const selectedAlgo = (event) => {
    setSelectedAlgo(event.target.value);
  };
  const sendData = async () => {
    let operation = 0
    console.log(selectedAlgorithm)
    switch (selectedAlgorithm){
      case "option1":
        operation = 1;
        break;
      case "option2":
        operation = 2;
        break;
      case "option3":
        operation = 3;
        break;
      case "option4":
        operation = 4;
        break;
      case "option5":
        operation = 5;
        break;
      default:
        operation = -1
        break;
    }
        
    const response = await fetch('http://localhost:8000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ array: gridRef.current.getGrid(), operation: operation }),
      });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const result = await response.json();
    console.log(result['result'])
    
    gridRef.current.resultGrid(result['result'])


    
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
          <select value={selectedAlgorithm} onChange={selectedAlgo}>
            <option value="">Select an algorithm</option>
            <option value="option1">Dijkstra's algorithm</option>
            <option value="option2">A* search algorithm</option>
            <option value="option3">Breadth-first search</option>
            <option value="option4">Depth-first search</option>
            <option value="option5">Bellman-Ford algorithm</option>
          </select>
          <button onClick={sendData}>Compute</button>
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
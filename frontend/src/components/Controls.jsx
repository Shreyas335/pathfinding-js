import React, { useState, useEffect, useRef } from 'react';
import Grid from './grid';
import './Controls.css';

const BASE_URL = '';

const Controls = () => {
  const gridRef = useRef(null); // Create a ref to hold the Grid component instance
  const [selectedMaze, setSelectedMaze] = useState('');

  useEffect(() => {
    // Load grid data when the component mounts
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
    <div className="container">
      <h2>Maze Controls</h2>
      <div className="controls">
        <select value={selectedMaze} onChange={selectMaze}>
          <option value="">Select an algorithm</option>
          <option value="option1">Dijkstra's algorithm</option>
          <option value="option2">A* search algorithm</option>
          <option value="option3">Breadth-first search </option>
          <option value="option4">Depth-first search </option>
          <option value="option5">Bellman-Ford algorithm</option>
        </select>
        <button onClick={saveMaze}>Compute</button>
        <button onClick={clearGrid}>Clear</button>
      </div>
     
    </div>
  );
};

export default Controls;
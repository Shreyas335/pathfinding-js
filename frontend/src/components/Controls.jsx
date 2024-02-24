import React, { useState , useEffect} from 'react';
import Grid from './grid'
import './Controls.css';

const BASE_URL = ''

const Controls = () => {
    const [selectedMaze, setSelectedMaze] = useState('');

    useEffect(() => {
        // Load grid data when the component mounts
        loadMaze();
    }, []);

    const saveMaze = async () => {
        const gridData = Grid.grid;
        try {
            const response = await fetch('http://127.0.0.1:5000/api/save', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ gridData })
            });
            if (!response.ok) {
                throw new Error('Failed to save data');
            }
            console.log('Data saved successfully');
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const loadMaze = async () => {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/load');
          const data = await response.json();
          Grid.setGrid(data.grid);
          console.log('Grid loaded successfully');
        } catch (error) {
          console.error('Error loading grid:', error);
        }
    };

    const selectMaze = (event) => {
        setSelectedMaze(event.target.value);
    };

    return (
        <div className="container">
          <h2>Maze Controls</h2>
          <div className="controls">
            <select value={selectedMaze} onChange={selectMaze}>
              <option value="">Select a maze</option>
              <option value="option1">Maze 1</option>
              <option value="option2">Maze 2</option>
              <option value="option3">Maze 3</option>
            </select>
            <button onClick={saveMaze}>Save</button>
            <button onClick={loadMaze}>Load</button>
          </div>
        </div>
      );
    };
    
    export default Controls;
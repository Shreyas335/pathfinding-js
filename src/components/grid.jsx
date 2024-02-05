

import React, { useState } from 'react';
import './Grid.css'; // Import the CSS file

const Grid = ({ rows, columns }) => {
    const [grid, setGrid] = useState(Array.from({ length: rows }, () => Array(columns).fill(0)));
    const [currentColor, setCurrentColor] = useState('#00f');

    const getColor = (color) => {
        if (color == 0) {
            return '#000000';
        } else if (color === 1) {
            return '#fc0000';
        } else if (color === 2){
            return '#eeeeee'
        }
    };

    const toggleCell = (row, col) => {
        const newGrid = [...grid];
        newGrid[row][col]++;
        if (newGrid[row][col] == 3) {newGrid[row][col] = 0}
        setGrid(newGrid);

        setCurrentColor(getColor());
    };
    
    return (
        <div className="grid-container" style={{ gridTemplateColumns: `repeat(${columns}, 14px)` }}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${grid[rowIndex][colIndex] == 1  ? 'active-cell' : grid[rowIndex][colIndex] == 2 ? 'wall-cell' : ''}`}
                        onClick={() => toggleCell(rowIndex, colIndex)}
                    />
                ))
            )}
        </div>
    );
};

export default Grid;

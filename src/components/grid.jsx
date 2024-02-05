

import React, { useState } from 'react';
import './Grid.css'; // Import the CSS file

const Grid = ({ rows, columns }) => {
    const [grid, setGrid] = useState(Array.from({ length: rows }, () => Array(columns).fill(false)));
    const [currentColor, setCurrentColor] = useState('#00f');

    const getColor = () => {
        return '#000000';
    };

    const toggleCell = (row, col) => {
        const newGrid = [...grid];
        newGrid[row][col] = !newGrid[row][col];
        setGrid(newGrid);

        setCurrentColor(getColor());
    };

    return (
        <div className="grid-container" style={{ gridTemplateColumns: `repeat(${columns}, 14px)` }}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${grid[rowIndex][colIndex] ? 'active-cell' : ''}`}
                        onClick={() => toggleCell(rowIndex, colIndex)}
                    />
                ))
            )}
        </div>
    );
};

export default Grid;

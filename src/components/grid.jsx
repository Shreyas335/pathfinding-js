

import React, { useState } from 'react';
import './Grid.css'; // Import the CSS file

const Grid = ({ rows, columns }) => {
    const [grid, setGrid] = useState(Array.from({ length: rows }, () => Array(columns).fill(0)));
    const [currentColor, setCurrentColor] = useState('#00f');
    const [isDragging, setIsDragging] = useState(false);

    const handleMD = () => {
        setIsDragging(true);
        
    };

    const preventDragHandler = (e) => {
        e.preventDefault();

    };
    
    const handleMU = () => {
        setIsDragging(false);
    };

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
        if (newGrid[row][col] == 2) {newGrid[row][col] = 0}
        setGrid(newGrid);

        setCurrentColor(getColor());
    };

    const toggle2 = (row, col) => {
        if(isDragging){
            const newGrid = [...grid];
            if (newGrid[row][col] == 2) {
                newGrid[row][col] = 0
            }else{
                newGrid[row][col] = 2
            }
            setGrid(newGrid);
    
            setCurrentColor(getColor());
        }
    };
        

    return (
        <div 
            className="grid-container" 
            style={{ gridTemplateColumns: `repeat(${columns}, 14px)` } } 
            onMouseDown={handleMD} 
            onMouseUp={handleMU}
            onMouseLeave={handleMU}
            //onMouseEnter={handleMU}

            onDragStart={preventDragHandler}
            
            >
            
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${grid[rowIndex][colIndex] == 1  ? 'active-cell' : grid[rowIndex][colIndex] == 2 ? 'wall-cell' : ''}`}
                        
                        onMouseEnter={() => toggle2(rowIndex, colIndex)}
                        onMouseDown={() => toggle2(rowIndex, colIndex)}
                        onClick={() => toggleCell(rowIndex, colIndex)}
                        draggable={false}
                        
                    />
                ))
            )}
        </div>
    );
};

export default Grid;




import React, { useState } from 'react';
import './Grid.css'; // Import the CSS file

const Grid = ({ rows, columns }) => {
    const [grid, setGrid] = useState(Array.from({ length: rows }, () => Array(columns).fill(0)));
    const [currentColor, setCurrentColor] = useState('#00f');
    const [isDragging, setIsDragging] = useState(false);

    const handleMD = () => {
        setIsDragging(true);
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
        <div className="grid-container" style={{ gridTemplateColumns: `repeat(${columns}, 14px)` } } onMouseDown={handleMD} onMouseUp={handleMU}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${grid[rowIndex][colIndex] == 1  ? 'active-cell' : grid[rowIndex][colIndex] == 2 ? 'wall-cell' : ''}`}
                        onClick={() => toggleCell(rowIndex, colIndex)}
                        onMouseEnter={() => toggle2(rowIndex, colIndex)}
                        draggable={false}
                        
                    />
                ))
            )}
        </div>
    );
};

export default Grid;

/*


import React, { useState } from 'react';
import './Grid.css'; // Import the CSS file

const Grid = ({ rows, columns }) => {
    const [grid, setGrid] = useState(Array.from({ length: rows }, () => Array(columns).fill(0)));
    const [currentColor, setCurrentColor] = useState('#00f');
    //const [isDragging, setIsDragging] = useState<boolean>(false);

    const getColor = () => {
        return '#000000';
    };

    const handleMD = () => {
        setIsDragging(true);
    };
    
    const handleMU = () => {
        setIsDragging(false);
    };
    const handleMM = () => {
        //not done
        setIsDragging(false);
    };


    const toggleCell = (row, col) => {
        const newGrid = [...grid];
        newGrid[row][col]++;
        if (newGrid[row][col] == 3){
            newGrid[row][col] = 0;
        }
        setGrid(newGrid);

        setCurrentColor(getColor());
    };
    const toggle2 = (row, col) => {
        const newGrid = [...grid];
        if (newGrid[row][col] == 2){
            newGrid[row][col] = 0;
        }else{
            newGrid[row][col] = 2;
        }
        setGrid(newGrid);

        setCurrentColor(getColor());
    };

    return (
        <div className="grid-container" style={{ gridTemplateColumns: `repeat(${columns}, 14px)` }} onMouseDown={handleMD} onMouseUp={handleMU} onMouseMove={handleMM}>
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`grid-cell ${grid[rowIndex][colIndex] ? 'active-cell' : ''}`}
                        onClick={() => toggleCell(rowIndex, colIndex)}
                        //onDragEnter={() => toggle2(rowIndex, colIndex)}                   
                    />
                ))
            )}
        </div>
    );
};

export default Grid;
 */
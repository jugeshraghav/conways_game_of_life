import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

let columns = 5;
let rows = 5;
export function make2DArray(rows, cols) {
  let array = new Array(rows);
  for (let i = 0; i < array.length; i++) {
    array[i] = new Array(cols).fill(0);
  }
  return array;
}

const countLiveNeighbours = (grid, x, y) => {
  let count = 0;
  const iStart = x === 0 ? x : x - 1;
  const jStart = y === 0 ? y : y - 1;
  const iTill = x === rows - 1 ? x + 1 : x + 2;
  const jTill = y === columns - 1 ? y + 1 : y + 2;
  for (let i = iStart; i < iTill; i++) {
    for (let j = jStart; j < jTill; j++) {
      if (i !== x || j !== y) {
        count += grid[i][j];
      }
    }
  }
  return count;
};
function App() {
  const [grid, setGrid] = useState(make2DArray(rows, columns));
  const [isStarted, setIsStarted] = useState(false);
  const runningRef = useRef(isStarted);
  runningRef.current = isStarted;
  const timeoutRef = useRef(null); // Ref to hold timeout reference

  // Function to compute the next generation of the grid
  const computeFutureArray = () => {
    console.log("future array");
    const newGrid = make2DArray(rows, columns);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        const neighbors = countLiveNeighbours(grid, i, j);
        const currentCell = grid[i][j];

        if (currentCell === 1) {
          // Any live cell with fewer than two live neighbors dies
          // Any live cell with two or three live neighbors lives on to the next generation
          // Any live cell with more than three live neighbors dies
          newGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
        } else {
          // Any dead cell with exactly three live neighbors becomes a live cell
          newGrid[i][j] = neighbors === 3 ? 1 : 0;
        }
      }
    }

    // Update grid state immutably
    setGrid([...newGrid]);
    console.log(newGrid);
  };

  // Function to run the game simulation
  const runningGameSimulation = useCallback(() => {
    console.log("running");
    if (!runningRef.current) {
      return;
    }
    console.log(grid);
    //future grid state  calculation
    computeFutureArray();
    setTimeout(() => {
      runningGameSimulation();
    }, 5000);
  }, []);

  useEffect(() => {
    const initialGrid = make2DArray(rows, columns);
    initialGrid[1][2] = 1;
    initialGrid[2][3] = 1;
    initialGrid[3][1] = 1;
    initialGrid[3][2] = 1;
    initialGrid[3][3] = 1;
    setGrid(initialGrid);
  }, []);

  // Toggle cell state between alive (1) and dead (0)
  const toggleCellHandler = (rowIndex, colIndex) => {
    const updatedGrid = grid.map((row, i) =>
      row.map((cell, j) =>
        i === rowIndex && j === colIndex ? (cell ? 0 : 1) : cell
      )
    );
    setGrid(updatedGrid);
  };

  // Render the app UI
  return (
    <>
      <button
        onClick={() => {
          setIsStarted(!isStarted);
          if (!isStarted) {
            runningRef.current = true;
            runningGameSimulation();
          }
        }}
      >
        {isStarted ? "Stop" : "Start"}
      </button>
      <button onClick={computeFutureArray}>Next</button>
      <table>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={cell === 1 ? "live-cell" : "dead-cell"}
                  onClick={() => toggleCellHandler(rowIndex, colIndex)}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;

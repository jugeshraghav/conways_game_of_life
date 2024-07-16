import { useRef, useState } from "react";
import "./App.css";

let columns = 5;
let rows = 5;
function make2DArray(rows, cols) {
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
  const [grid, setGrid] = useState(() => make2DArray(rows, columns));
  const [isStarted, setIsStarted] = useState(false);
  const timerId = useRef(null);

  function randomizeArray(rows, cols) {
    let res = [];
    for (let i = 0; i < rows; i++) {
      res[i] = [];
      for (let j = 0; j < cols; j++) {
        res[i][j] = Math.round(Math.random());
      }
    }
    setGrid([...res]);
  }

  // Function to compute the next generation of the grid
  const computeFutureArray = () => {
    setGrid((prevGrid) => {
      const newGrid = make2DArray(rows, columns);
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          const neighbors = countLiveNeighbours(prevGrid, i, j);
          const currentCell = prevGrid[i][j];
          if (currentCell === 1) {
            // Any live cell with fewer than two live neighbors dies
            // Any live cell with two or three live neighbors lives on to the next generation
            // Any live cell with more than three live neighbors die
            newGrid[i][j] = neighbors === 2 || neighbors === 3 ? 1 : 0;
          } else {
            // Any dead cell with exactly three live neighbors becomes a live cell
            newGrid[i][j] = neighbors === 3 ? 1 : 0;
          }
        }
      }

      return newGrid;
    });
  };

  // Function to run the game simulation
  const runningGameSimulation = () => {
    timerId.current = setInterval(() => {
      computeFutureArray();
    }, 1000);
  };

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
      {isStarted ? (
        <button
          onClick={() => {
            setIsStarted(false);
            clearInterval(timerId.current);
          }}
        >
          Stop
        </button>
      ) : (
        <button
          onClick={() => {
            setIsStarted(true);
            runningGameSimulation();
          }}
        >
          Start
        </button>
      )}

      <button onClick={() => randomizeArray(rows, columns)}>Random </button>
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

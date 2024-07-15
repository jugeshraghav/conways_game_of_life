import { useEffect, useState } from "react";

import "./App.css";

function make2DArray(rows, cols) {
  let array = new Array(rows);
  for (let i = 0; i < array.length; i++) {
    array[i] = new Array(cols);
  }
  return array;
}

function fillArray(arr, rows, cols) {
  let res = arr;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      arr[i][j] = 0;
    }
  }
  return res;
}
let columns = 5;
let rows = 5;
let array = make2DArray(rows, columns);
let futureArray = make2DArray(rows, columns);
array = fillArray(array, rows, columns);
futureArray = fillArray(array, rows, columns);

const toggleCellHandler = (row_index, column_index) => {
  let updatedArray = [...boardArray];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (i === row_index && j === column_index) {
        updatedArray[i][j] = boardArray[i][j] === 1 ? 0 : 1;
      }
    }
  }
  setBoardArray([...updatedArray]);
};

const countNeighbours = (grid, x, y) => {
  let count = 0;
  const iStart = x === 0 ? x : x - 1;
  const jStart = y === 0 ? y : y - 1;
  const iTill = x === rows - 1 ? x + 1 : x + 2;
  const jTill = y === columns - 1 ? y + 1 : y + 2;
  for (let i = iStart; i < iTill; i++) {
    for (let j = jStart; j < jTill; j++) {
      if (i === x && j === y) {
        count = count;
      } else {
        count += grid[i][j];
      }
    }
  }
  console.log(x, y);
  console.log(count);
  return count;
};

const automateCells = () => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      let currentCell = boardArray[i][j];

      let noOfNeighboursAlive = countNeighbours(boardArray, i, j);

      if (currentCell === 1 && noOfNeighboursAlive < 2) {
        futureArray[i][j] = 0;
      } else if (currentCell === 1 && noOfNeighboursAlive > 3) {
        futureArray[i][j] = 0;
      } else if (currentCell === 0 && noOfNeighboursAlive === 3) {
        futureArray[i][j] = 1;
      } else {
        futureArray[i][j] = boardArray[i][j];
      }
    }
  }
  setBoardArray([...futureArray]);
};

let timer;
const startTheGame = () => {
  futureArray[1][2] = 1;
  futureArray[1][1] = 1;
  futureArray[1][3] = 1;
  setBoardArray([...futureArray]);
  // timer = setInterval(() => {
  //   automateCells();
  // }, 5000);
};
// clearInterval(timer);

const stopTheGame = () => {
  clearInterval(timer);
  setIsStarted(false);
};

function App() {
  const [boardArray, setBoardArray] = useState(array);
  const [isStarted, setIsStarted] = useState(false);
  return (
    <>
      {isStarted ? (
        <button onClick={stopTheGame}>Stop</button>
      ) : (
        <button
          onClick={() => {
            setIsStarted(true);
            startTheGame();
          }}
        >
          Start
        </button>
      )}
      <button onClick={() => automateCells()}>Next</button>
      <table>
        <tbody>
          {boardArray.length > 0 &&
            boardArray.map((row, row_index) => (
              <tr key={row_index}>
                {row.length > 0 &&
                  row.map((column, column_index) => (
                    <td
                      key={column_index}
                      className={column === 1 ? "live-cell" : "dead-cell"}
                      onClick={() => toggleCellHandler(row_index, column_index)}
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

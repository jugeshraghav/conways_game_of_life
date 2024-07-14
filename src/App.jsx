import { useEffect, useState } from "react";

import "./App.css";

function App() {
  let columns = 30;
  let rows = 30;
  let array = [];
  let futureArray = [];
  for (let i = 0; i < rows; i++) {
    array[i] = [];
    futureArray[i] = [];

    for (let j = 0; j < columns; j++) {
      array[i][j] = { isLive: false };
      futureArray[i][j] = { isLive: false };
    }
  }
  const [boardArray, setBoardArray] = useState(array);
  const [isStarted, setIsStarted] = useState(false);

  const toggleCellHandler = (row, column) => {
    setBoardArray(
      boardArray.map((r) =>
        r.map((c) =>
          r === row && c === column ? { isLive: !c.isLive } : { ...c }
        )
      )
    );
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
          count = grid[i][j].isLive ? count + 1 : count;
        }
      }
    }
    return count;
  };

  const automateCells = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let currentCell = boardArray[i][j];

        let noOfNeighboursAlive = countNeighbours(boardArray, i, j);

        if (currentCell.isLive && noOfNeighboursAlive < 2) {
          futureArray[i][j].isLive = false;
        } else if (currentCell.isLive && noOfNeighboursAlive > 3) {
          futureArray[i][j].isLive = false;
        } else if (currentCell.isLive === false && noOfNeighboursAlive === 3) {
          futureArray[i][j].isLive = true;
        } else {
          futureArray[i][j] = boardArray[i][j];
        }
      }
    }
    console.log(futureArray);
    setBoardArray([...futureArray]);
  };
  let timer;
  const startTheGame = () => {
    const updatedArray = [...boardArray];
    (updatedArray[2][1].isLive = true),
      (updatedArray[2][2].isLive = true),
      (updatedArray[2][3].isLive = true),
      setBoardArray(updatedArray);
    timer = setInterval(() => {
      automateCells();
    }, 5000);
  };
  clearInterval(timer);
  const stopTheGame = () => {
    clearInterval(timer);
    setIsStarted(false);
  };
  // useEffect(() => {
  //   setBoardArray(array);
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);
  console.log("rerenderd");
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
            boardArray.map((row, index) => (
              <tr key={index}>
                {row.length > 0 &&
                  row.map((column, index) => (
                    <td
                      key={index}
                      className={column.isLive ? "live-cell" : "dead-cell"}
                      onClick={() => toggleCellHandler(row, column)}
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

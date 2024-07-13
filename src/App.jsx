import { useEffect, useState } from "react";

import "./App.css";

function App() {
  const [boardArray, setBoardArray] = useState([]);
  const [live, setLive] = useState(true);
  let columns = 5;
  let rows = 5;
  let array = [];
  for (let i = 0; i < rows; i++) {
    array[i] = [];
    for (let j = 0; j < columns; j++) {
      array[i][j] = { isLive: false };
    }
  }

  const toggleCellHandler = (row, column) => {
    setBoardArray(
      boardArray.map((r) =>
        r.map((c) =>
          r === row && c === column ? { isLive: !c.isLive } : { ...c }
        )
      )
    );
  };

  const countNeighbours = (array, i, j) => {};

  const automateCells = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        let currentCell = boardArray[i][j];

        let noOfNeighboursAlive = countNeighbours(boardArray, i, j);

        if (currentCell.isLive) {
          if (noOfNeighboursAlive < 2 || noOfNeighboursAlive >= 4) {
            const updatedArray = [...boardArray];
            boardArray[i][j].isLive = false;
            setBoardArray(updatedArray);
          }
        } else {
          if (noOfNeighboursAlive === 3) {
            const updatedArray = [...boardArray];
            boardArray[i][j].isLive = true;
            setBoardArray(updatedArray);
          }
        }
      }
    }
  };

  const startTheGame = () => {
    const updatedArray = [...boardArray];
    // (updatedArray[3][4].isLive = true),
    (updatedArray[2][1].isLive = true),
      (updatedArray[2][2].isLive = true),
      (updatedArray[2][3].isLive = true),
      console.log(updatedArray);
    setBoardArray(updatedArray);
  };

  console.log(boardArray);

  useEffect(() => {
    setBoardArray(array);
  }, []);

  return (
    <>
      <button onClick={startTheGame}>Start</button>
      <button onClick={() => automateCells()}>automate</button>
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

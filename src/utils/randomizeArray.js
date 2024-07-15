export function randomizeArray(arr, rows, cols) {
  let res = arr;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      arr[i][j] = Math.random(2);
    }
  }
  return res;
}

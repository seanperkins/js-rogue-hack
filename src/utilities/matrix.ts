/**
 * Generates a matrix of the given size with a initial value for each cell.
 * @param width
 * @param height
 * @param initialValue
 * @returns
 */
export function generateMatrix(
  width: number,
  height: number,
  initialValue: any = {},
) {
  const matrix = new Array(height)
    .fill(initialValue)
    .map(() => new Array(width).fill(initialValue))
  return matrix
}

export function resizeMatrix(
  matrix: any[][],
  size: {height: number; width: number},
) {
  if (size.height === matrix.length && size.width === matrix[0].length) {
    return matrix
  }
  if (matrix.length < size.height || matrix[0].length < size.width) {
    const newMatrix = generateMatrix(size.width, size.height, {})
    newMatrix.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (matrix[rowIndex] && matrix[rowIndex][columnIndex]) {
          newMatrix[rowIndex][columnIndex] = matrix[rowIndex][columnIndex]
        }
      })
    })
    return newMatrix
  }
  return matrix.slice(0, size.height).map((row) => row.slice(0, size.width))
}

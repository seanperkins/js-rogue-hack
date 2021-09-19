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

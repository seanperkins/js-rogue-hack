export function generateGrid({width, height, char, fg, bg}) {
  const grid = {}
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      grid[`${x},${y}`] = {
        char,
        fg,
        bg,
      }
    }
  }
  return grid
}

import {Display} from 'rot-js'
import chars from '../constants/characters'
import {BLACK, LIGHT_GREEN} from '../constants/colors'

// Clears the portion of the screen that matches the parameters
export function clearDisplay(
  display: Display,
  height: number,
  width: number,
  x: number = 0,
  y: number = 0,
) {
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      display.draw(w + x, h + y, 'X', BLACK, BLACK)
    }
  }
}

export function drawFrame(
  display: Display,
  height: number,
  width: number,
  x: number = 0,
  y: number = 0,
  title: string = '',
) {
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      let char = ' '

      if (w === 0 && h === 0) {
        char = chars.upperLeftCorner // Upper left corner
      } else if (w === width - 1 && h === 0) {
        char = chars.upperRightCorner // Upper right corner
      } else if (w === 0 && h === height - 1) {
        char = chars.lowerLeftCorner // Lower left corner
      } else if (w === width - 1 && h === height - 1) {
        char = chars.lowerRightCorner // Lower right corner
      } else if (w === 0 || w === width - 1) {
        char = chars.verticalLine // Vertical
      } else if (h === 0 || h === height - 1) {
        char = chars.horizontalLine // Horizontal
      }
      if (char !== ' ') {
        display.draw(w + x, h + y, char, LIGHT_GREEN, BLACK) // Side
      }
    }
  }
  display.drawText(x + 1, y, title)
}

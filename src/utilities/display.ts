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
  fillDisplay({
    display,
    h: height,
    w: width,
    x,
    y,
    fg: BLACK,
    bg: BLACK,
    char: ' ',
  })
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
  return {
    w: width - 2,
    h: height - 2,
    x: x + 1,
    y: y + 2,
  }
}

export function fillDisplay({
  display,
  h,
  w,
  x,
  y,
  fg,
  bg,
  char,
}: {
  display: Display
  h: number
  w: number
  x: number
  y: number
  fg?: string
  bg?: string
  char?: string
}) {
  const c = char || ' '
  const f = fg || LIGHT_GREEN
  const b = bg || BLACK
  for (let ww = 0; ww < w; ww++) {
    for (let hh = 0; hh < h; hh++) {
      display.draw(ww + x, hh + y, char, f, b)
    }
  }
}

export function drawWindow({
  display,
  h,
  w,
  x,
  y,
  title,
  fg,
  bg,
  shadow,
}: {
  display: Display
  h: number
  w: number
  x: number
  y: number
  title: string
  fg?: string
  bg?: string
  shadow?: boolean
}) {
  const f = fg || LIGHT_GREEN
  const b = bg || BLACK

  drawFrame(display, h, w, x, y)
  fillDisplay({
    display,
    h: 1,
    w: w - 2,
    x: x + 1,
    y: y + 1,
    fg: f,
    bg: f,
    char: ' ',
  })
  display.drawText(x + 1, y + 1, `%c{${b}}%b{${f}}${title}`)
  if (shadow) {
    fillDisplay({
      display,
      h: 1,
      w: w,
      x: h + 1,
      y: y + h,
      fg: f,
      bg: b,
      char: '°',
    })
    fillDisplay({
      display,
      h: h - 1,
      w: 1,
      x: x + w,
      y: y + 1,
      fg: f,
      bg: b,
      char: '°',
    })
  }

  return {
    w: w - 2,
    h: h - 2,
    x: x + 1,
    y: y + 2,
  }
}

import {Display} from 'rot-js'
import chars from '../constants/characters'
import {BLACK, LIGHT_GREEN} from '../constants/colors'

/**
 * Get x, y coordinates for the top left corner of a centered rectangle or the center of the display
 * @param display - ROTJS Display object
 * @param height - Height of the rectangle you want to center
 * @param width - Width of the rectangle you want to center
 * @returns The `{x, y}` coordinates for the top left corner of the centered rectangle
 */
export function getCenter(display: Display, height?: number, width?: number) {
  const {width: dw, height: dh} = display.getOptions()
  const h = height || 0
  const w = width || 0
  return {
    x: Math.floor(dw / 2 - w / 2),
    y: Math.floor(dh / 2 - h / 2),
  }
}

// Clears the portion of the screen that matches the parameters
export function clearDisplay(
  display: Display,
  height: number = display.getOptions().height,
  width: number = display.getOptions().width,
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
  const height = shadow ? h - 1 : h
  const width = shadow ? w - 1 : w

  fillDisplay({
    display,
    h: h - 1,
    w: w - 1,
    x,
    y,
    fg: BLACK,
    bg: BLACK,
    char: ' ',
  })
  drawFrame(display, height, width, x, y)
  fillDisplay({
    display,
    h: 1,
    w: width - 2,
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
      w: width,
      x: h + 1,
      y: y + height,
      fg: f,
      bg: b,
      char: '°',
    })
    fillDisplay({
      display,
      h: width - 1,
      w: 1,
      x: x + width,
      y: y + 1,
      fg: f,
      bg: b,
      char: '°',
    })
  }

  return {
    w: w - 3,
    h: h - 3,
    x: x + 1,
    y: y + 2,
  }
}

export function drawText({
  display,
  x,
  y,
  text,
  maxWidth,
  fg,
  bg,
}: {
  display: Display
  x: number
  y: number
  text: string
  maxWidth?: number
  fg?: string
  bg?: string
}) {
  const f = fg || LIGHT_GREEN
  const b = bg || BLACK
  display.drawText(x, y, `%c{${f}}%b{${b}}${text}`, maxWidth)
}

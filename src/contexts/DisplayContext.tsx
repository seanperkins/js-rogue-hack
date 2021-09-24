import {debounce} from 'lodash'
import {createContext, useEffect, useState} from 'react'
import {Display} from 'rot-js'

import {BLACK, LIGHT_GREEN} from '../constants'
import TileSet from '../TileSet'
import {GridTiles} from '../types'

const DisplayContext = createContext(null)

export default DisplayContext

declare global {
  interface Window {
    game: {
      display: Display
    }
  }
}

export const DisplayContextProvider = function ({children}) {
  const [display, setDisplay] = useState<Display>(null)
  const [displaySize, setDisplaySize] = useState<{
    width: number
    height: number
  }>({width: 0, height: 0})
  const [mouseXY, setMouseXY] = useState<[number, number]>([null, null])
  // Run once on load to set the display
  useEffect(() => {
    if (window.game.display) {
      setDisplay(window.game.display)
      return
    }
    const tileset = new TileSet('tileset')

    const {width, height} = getDisplaySizeFromWindow(tileset)
    setDisplaySize({width, height})

    const d = new Display({
      width: width,
      height: height,
      fontSize: 12,
      spacing: 0,
      layout: 'tile-gl',
      tileColorize: true,
      tileWidth: tileset.tileWidth,
      tileHeight: tileset.tileHeight,
      tileSet: tileset.tileSet,
      tileMap: tileset.tileMap,
      bg: BLACK,
      fg: LIGHT_GREEN,
    })

    // Appending element and forcing it to be 100% of width
    const canvas = d.getContainer()
    const gameContainer = document.getElementById('game')
    gameContainer.appendChild(canvas)

    setDisplay(d)
    window.game.display = d
  }, [])

  useEffect(() => {
    if (!display) {
      return
    }
    const {width, height} = displaySize
    const {width: currentWidth, height: currentHeight} = display.getOptions()
    if (width !== currentWidth || height !== currentHeight) {
      const tileset = new TileSet('tileset')
      const d = new Display({
        width: width,
        height: height,
        fontSize: 12,
        spacing: 0,
        layout: 'tile-gl',
        tileColorize: true,
        tileWidth: tileset.tileWidth,
        tileHeight: tileset.tileHeight,
        tileSet: tileset.tileSet,
        tileMap: tileset.tileMap,
        bg: BLACK,
        fg: LIGHT_GREEN,
      })

      // Appending element and forcing it to be 100% of width
      const canvas = d.getContainer()
      const gameContainer = document.getElementById('game')
      gameContainer.replaceChildren(canvas)

      setDisplay(d)
      window.game.display = d
    }
  }, [display, displaySize])

  // Used for setting handlers for mouse events
  useEffect(() => {
    if (!display) return
    const setHandlers = (canvas) => {
      canvas.addEventListener('mousemove', onMouseMove)
      window.addEventListener('resize', debouncedOnResize)
    }

    const removeHandlers = (canvas) => {
      canvas.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', debouncedOnResize)
    }

    const onMouseMove = (e) => {
      const xy = display.eventToPosition(e)
      setMouseXY(xy)
    }

    const onResize = () => {
      const tileset = new TileSet('tileset')
      const {width, height} = getDisplaySizeFromWindow(tileset)
      setDisplaySize({width, height})
    }
    const debouncedOnResize = debounce(onResize, 100)

    const canvas = display.getContainer()
    setHandlers(canvas)
    return () => removeHandlers(canvas)
  }, [display])

  /**
   * Get x, y coordinates for the top left corner of a centered rectangle or the center of the display
   * param display - ROTJS Display object
   * param height - Height of the rectangle you want to center
   * param width - Width of the rectangle you want to center
   * returns The `{x, y}` coordinates for the top left corner of the centered rectangle
   */
  function getCenter({height, width}: {height?: number; width?: number} = {}) {
    const {width: dw, height: dh} = display.getOptions()
    const h = height || 0
    const w = width || 0
    return [Math.floor(dw / 2 - w / 2), Math.floor(dh / 2 - h / 2)]
  }

  function getHalfSize() {
    const {width, height} = display.getOptions()
    return {width: Math.floor(width / 2), height: Math.floor(height / 2)}
  }

  // Clears the portion of the screen that matches the parameters
  function clearDisplay(
    height: number = display.getOptions().height,
    width: number = display.getOptions().width,
    x: number = 0,
    y: number = 0,
  ) {
    fillDisplay({
      height,
      width,
      x,
      y,
      fg: BLACK,
      bg: BLACK,
      char: ' ',
    })
  }

  function fillDisplay({
    height,
    width,
    x,
    y,
    fg,
    bg,
    char,
  }: {
    height: number
    width: number
    x: number
    y: number
    fg?: string
    bg?: string
    char?: string
  }) {
    const c = char || ' '
    const f = fg || LIGHT_GREEN
    const b = bg || BLACK
    for (let ww = 0; ww < width; ww++) {
      for (let hh = 0; hh < height; hh++) {
        display.draw(ww + x, hh + y, c, f, b)
      }
    }
  }

  function drawText({
    x,
    y,
    text,
    maxWidth,
    fg,
    bg,
  }: {
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
    // Figure out how many lines the text will take up
    if (maxWidth) {
      return Math.ceil(text.length / maxWidth)
    }
    // Should only take up one if we don't define a max
    return 1
  }

  function drawGrid({
    grid,
    fg,
    bg,
  }: {
    grid: GridTiles
    fg?: string
    bg?: string
  }) {
    const {height, width} = display.getOptions()
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const tile = grid[`${x},${y}`]
        if (tile) {
          const foreground = tile.fg || fg
          const background = tile.bg || bg
          display.draw(x, y, tile.char, foreground, background)
        }
      }
    }
  }

  function drawMatrix({matrix, x, y}) {
    matrix.forEach((row, ry) => {
      row.forEach((cell, rx) => {
        if (Object.keys(cell).length) {
          display.draw(rx + x, ry + y, cell.char, cell.fg, cell.bg)
        }
      })
    })
  }

  return (
    <DisplayContext.Provider
      value={{
        display,
        getCenter,
        getHalfSize,
        clearDisplay,
        fillDisplay,
        drawText,
        drawGrid,
        drawMatrix,
        mouseXY,
        displaySize,
      }}
    >
      {children}
    </DisplayContext.Provider>
  )
}

function getDisplaySizeFromWindow(tileset: TileSet) {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const width = Math.floor(windowWidth / tileset.tileWidth)
  const height = Math.floor(windowHeight / tileset.tileHeight)
  return {width, height}
}

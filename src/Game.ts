import * as ROT from 'rot-js'

import {BLACK, LIGHT_GREEN, NUMBER_KEY_MAP} from '@constants'
import {Player} from './entities/'
import TileSet from './TileSet'
import Log from './Log'
import {ErrorHandler} from './Errors'
import StartScreen from './screens/StartScreen'
import Screen from './screens/Screen'
import Welcome from './screens/Welcome'

export const enum GameState {
  'Start',
  'Welcome',
  'InGame',
  'Spawn',
}

const screens = {
  [GameState.Start]: StartScreen,
  [GameState.Welcome]: Welcome,
}

export default class Game {
  display: ROT.Display
  handlers: {[id: number]: (e: KeyboardEvent) => void} = {}
  player: Player
  _gameState: GameState
  log: Log
  errorHandler: ErrorHandler
  screen: Screen

  constructor() {
    let tileset = new TileSet('tileset')
    this.display = new ROT.Display({
      width: 120,
      height: 80,
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
    this.log = new Log(this.display, 30, 80, 0, 50)
    // Appending element and forcing it to be 100% of width
    const canvas = this.display.getContainer()
    const gameContainer = document.getElementById('game')
    gameContainer.appendChild(canvas)
    canvas.style.maxWidth = '100%'
    const windowHeight = window.innerHeight
    canvas.style.maxHeight = windowHeight + 'px'
    canvas.style.float = 'left'

    this.errorHandler = new ErrorHandler(this.log, this.isDebug)

    this.setHandlers()

    this.gameState = GameState.Start
  }

  setHandlers() {
    window.addEventListener('keydown', this.mainEventHandler.bind(this))
  }

  get gameState(): GameState {
    return this._gameState
  }

  // TODO: Switch this back to a function that can accept gameState and props/context
  // This way, we can pass something into the new screen
  set gameState(gameState: GameState) {
    this._gameState = gameState
    if (this.screen) {
      this.screen.destroy()
    }
    const screen = screens[this.gameState]
    this.screen = new screen(this)
    this.screen.render()
  }

  async mainEventHandler(e) {
    // Determine appropriate screen
    const screen = screens[this.gameState]
    // If screen doesn't match, destory old screen, instantiate new screen

    this.screen.handleEvent(e)
    this.screen.render()
  }

  get isDebug(): boolean {
    return process.env.NODE_ENV === 'development'
  }
}

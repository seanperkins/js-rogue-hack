import * as ROT from 'rot-js'
import {MovementAction} from './actions'

import {BLACK, GREEN} from './constants/colors'
import {DIRECTION_KEY_MAP} from './constants/keyboard'
import {Actor} from './Entity'
import LevelMap from './LevelMap'
import Player from './Player'
import TileSet from './TileSet'

const enum GameState {
  'Start',
  'InGame',
}

export default class Game {
  display: ROT.Display
  handlers: {[id: number]: (e: KeyboardEvent) => void} = {}
  player: Player
  levelMap: LevelMap
  gameState: GameState = GameState.InGame

  constructor() {
    let tileset = new TileSet('tileset')
    this.display = new ROT.Display({
      width: 120,
      height: 80,
      fontSize: 12,
      spacing: 1,
      layout: 'tile-gl',
      tileColorize: true,
      tileWidth: tileset.tileWidth,
      tileHeight: tileset.tileHeight,
      tileSet: tileset.tileSet,
      tileMap: tileset.tileMap,
      bg: BLACK,
      fg: GREEN,
    })
    // Appending element and forcing it to be 100% of width
    const canvas = this.display.getContainer()
    const gameContainer = document.getElementById('game')
    gameContainer.appendChild(canvas)
    canvas.style.maxWidth = '100%'
    const windowHeight = window.innerHeight
    canvas.style.maxHeight = windowHeight + 'px'
    canvas.style.float = 'left'

    this.handlers[GameState.Start] = this.handleStartInput.bind(this)
    this.handlers[GameState.InGame] = this.handleInGameInput.bind(this)

    this.setUpMap()
    this.levelMap.render()
    this.playerTurn()
  }

  setUpMap = () => {
    this.player = new Player(20, 20, this.levelMap)
    this.levelMap = new LevelMap(this.display, 150, 150, [this.player])
  }

  playerTurn = () => {
    window.addEventListener('keydown', this)
  }

  handleEvent = (e: KeyboardEvent) => {
    if (this.gameState in this.handlers) {
      this.handlers[this.gameState](e)
    }
    this.display.clear()
    this.levelMap.render()
  }

  handleStartInput = (e: KeyboardEvent) => {}

  handleInGameInput = (e: KeyboardEvent) => {
    if (typeof this === 'undefined') return
    const code = e.code

    if (!(code in DIRECTION_KEY_MAP)) {
      return
    }

    const diff = ROT.DIRS[4][DIRECTION_KEY_MAP[code]]
    // @ts-ignore
    const new_x = this.player.x + diff[0]
    // @ts-ignore
    const new_y = this.player.y + diff[1]
    // @ts-ignore
    let a = new MovementAction(this.player, diff[0], diff[1])
    a.perform()

    const newKey = new_x + ',' + new_y
    // @ts-ignore
    if (!(newKey in this.levelMap)) {
      return
    }
  }
}

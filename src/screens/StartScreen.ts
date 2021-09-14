import {BLACK, LIGHT_GREEN} from '@constants'
import {drawFrame, drawText, drawWindow} from '../utilities/display'
import * as ROT from 'rot-js'

import Screen from './Screen'
import {GameState} from 'Game'

export default class StartScreen extends Screen {
  display: ROT.Display
  selectedOption: number = 0
  options: {[option: string]: any}[] = [
    {
      text: 'New Game',
      callback: this.newGame.bind(this),
    },
    {
      text: 'Load Game',
      callback: this.loadGame.bind(this),
    },
  ]

  constructor(game) {
    super(game, 'Start')

    this.display = game.display
  }

  init() {
    console.log('Start screen init')
  }

  render() {
    const halfWidth = this.display.getOptions().width / 2
    const halfHeight = this.display.getOptions().height / 2

    const inner = drawWindow({
      display: this.display,
      h: 40,
      w: 40,
      x: halfWidth - 20,
      y: halfHeight - 20,
      title: 'GAME MENU',
      shadow: true,
    })

    this.options.forEach((option, index) => {
      drawText({
        display: this.display,
        x: inner.x + 1,
        y: inner.y + 1 + index * 2,
        text: option.text,
        fg: index === this.selectedOption ? BLACK : LIGHT_GREEN,
        bg: index === this.selectedOption ? LIGHT_GREEN : BLACK,
      })
    })
  }

  newGame() {
    this.game.gameState = GameState.InGame
  }

  loadGame() {
    // TODO: load from local storage
  }

  handleEvent(e: KeyboardEvent) {
    const code = e.code

    if (code === 'ArrowUp') {
      if (this.selectedOption <= 0) {
        this.selectedOption = this.options.length - 1
      } else {
        this.selectedOption--
      }
    } else if (code === 'ArrowDown') {
      if (this.selectedOption >= this.options.length - 1) {
        this.selectedOption = 0
      } else {
        this.selectedOption++
      }
    } else if (code === 'Enter') {
      this.options[this.selectedOption].callback()
    }
  }

  destroy() {
    console.log('Start screen destroy')
  }
}

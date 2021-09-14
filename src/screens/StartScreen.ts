import {BLACK, LIGHT_GREEN} from '@constants'
import {drawFrame, drawText, drawWindow, getCenter} from '../utilities/display'
import * as ROT from 'rot-js'

import Screen from './Screen'
import {GameState} from 'Game'
import {Button, UIComponent} from '../utilities/ui'

export default class StartScreen extends Screen {
  display: ROT.Display
  selectedOption: number = 0
  options: {[option: string]: any}[] = [
    {
      text: 'NEW GAME',
      callback: this.newGame.bind(this),
    },
    {
      text: 'LOAD GAME',
      callback: this.loadGame.bind(this),
    },
  ]

  constructor(game) {
    super(game, 'Start')

    this.display = game.display
  }

  render() {
    super.render()
    const {x, y} = getCenter(this.display, 40, 40)

    const inner = drawWindow({
      display: this.display,
      h: 40,
      w: 40,
      x,
      y,
      title: 'GAME MENU',
      shadow: true,
    })

    this.options.forEach((option, index) => {
      const button = new Button({
        display: this.display,
        x: inner.x + 1,
        y: inner.y + 1 + index * 2,
        text: option.text,
        fg: LIGHT_GREEN,
        bg: BLACK,
        onClick: option.callback,
        selected: index === this.selectedOption,
      })
      this.components.push(button)
    })
  }

  newGame() {
    this.game.gameState = GameState.Welcome
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
    this.components.forEach((component) => component.draw())
  }

  destroy() {
    super.destroy()
    console.log('Start screen destroy')
  }
}

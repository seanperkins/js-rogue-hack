import {BLACK, GREEN} from '@constants'
import {Display} from 'rot-js'
import {isThisTypeNode} from 'typescript'
import {drawFrame, drawText} from './display'
import {debounce} from 'lodash'
import {NotImplementedError} from '../Errors'

interface UIProps {
  display: Display
  x: number
  y: number
  fg?: string
  bg?: string
  onHover?: () => void
  onClick?: () => void
}

export class UIComponent {
  name: string = 'UntitledComponent'
  display: Display
  x: number
  y: number
  fg: string
  bg: string
  width: number = 1
  height: number = 1

  hovering: boolean = false
  onHover: () => void
  onClick: () => void

  constructor({display, x, y, fg, bg, onHover, onClick}: UIProps) {
    this.display = display
    this.x = x
    this.y = y

    this.fg = fg || GREEN
    this.bg = bg || BLACK
    this.onHover = onHover
    this.onClick = onClick

    this.setListeners()
  }
  draw() {
    throw new NotImplementedError(
      `Draw not iplemented on your ${this.name} component`,
    )
  }

  _onHover = (e) => {
    const [x, y] = this.display.eventToPosition(e)
    const currentHoveringState = this.hovering
    if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y) {
      this.hovering = true
      if (this.onHover) {
        this.onHover()
      }
      this.draw()
    } else {
      if (this.hovering) {
        this.hovering = false
        this.draw()
      }
    }
  }
  debouncedOnHover = debounce(this._onHover, 50)

  _onClick = (e) => {
    const [x, y] = this.display.eventToPosition(e)
    if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y) {
      this.onClick()
    }
  }

  setListeners() {
    window.addEventListener('mousemove', this.debouncedOnHover)
    if (this.onClick) {
      window.addEventListener('click', this._onClick)
    }
  }

  destroy() {
    window.removeEventListener('mousemove', this.debouncedOnHover)
    window.removeEventListener('click', this.onClick)
  }
}

export class Button extends UIComponent {
  text: string
  selected: boolean = false

  constructor({display, x, y, text, onClick, fg, bg, selected}) {
    super({display, x, y, fg, bg, onClick})

    this.name = 'button'

    this.text = text
    this.width = text.length + 2
    this.height = 1
    this.selected = selected

    this.draw()
  }

  draw() {
    if (this.hovering || this.selected) {
      drawText({
        display: this.display,
        x: this.x,
        y: this.y,
        text: this.text,
        fg: this.bg,
        bg: this.fg,
      })
    } else {
      drawText({
        display: this.display,
        x: this.x,
        y: this.y,
        text: this.text,
        fg: this.fg,
        bg: this.bg,
      })
    }
  }
}

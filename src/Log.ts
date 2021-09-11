import {reverse} from 'lodash'
import * as ROT from 'rot-js'
import {clearDisplay, drawFrame} from './utilities/display'

type MessageType = 'error' | 'into'

type Message = {
  text: string
  type: MessageType
}

export default class Log {
  display: ROT.Display
  messages: Message[] = []
  height: number
  width: number
  x: number
  y: number

  constructor(display, height, width, x, y) {
    this.display = display
    this.height = height
    this.width = width
    this.x = x
    this.y = y
  }

  add(text: string, type: MessageType = 'into') {
    this.messages.push({
      text,
      type,
    })
  }

  render() {
    const {height, width, x, y, messages, display} = this
    clearDisplay(display, height, width, x, y)
    drawFrame(display, height, width, x, y, 'LOG')
    let msgs = reverse(messages.slice())
    let totalLines = 0
    let i = 0
    while (totalLines < height - 2 && i < height - 2 && i < msgs.length) {
      const linesDrawn = display.drawText(
        x + 1,
        y + 1 + totalLines,
        msgs[i].text,
        width,
      )
      totalLines += linesDrawn
      i++
    }
  }
}

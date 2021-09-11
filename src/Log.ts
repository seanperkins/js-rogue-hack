import {reverse} from 'lodash'
import * as ROT from 'rot-js'
import {clearDisplay, drawFrame} from './utilities/display'

type MessageType = 'error' | 'into'

type Message = {
  text: string
  type: MessageType
  count: number
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
    const lastMessage =
      this.messages[this.messages.length - 1] || ({} as Message)
    // If the previous message is the same, increase the count
    if (lastMessage.text === text) {
      lastMessage.count++
    } else {
      this.messages.push({
        text,
        type,
        count: 1,
      })
    }
  }

  render() {
    const {height, width, x, y, messages, display} = this
    clearDisplay(display, height, width, x, y)
    drawFrame(display, height, width, x, y, 'LOG')
    let msgs = reverse(messages.slice())
    let totalLines = 0
    let i = 0
    while (totalLines < height - 2 && i < height - 2 && i < msgs.length) {
      let text = msgs[i].text
      // Display the count if it's greater than 1
      if (msgs[i].count > 1) {
        text += ` (${msgs[i].count})`
      }
      const linesDrawn = display.drawText(
        x + 1,
        y + 1 + totalLines,
        text,
        width,
      )
      totalLines += linesDrawn
      i++
    }
  }
}

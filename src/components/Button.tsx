import {BLACK, LIGHT_GREEN} from '../constants'
import Text from './Text'
import withDisplay from './WithDisplay'

function isMouseOver([x, y], [mx, my], [w, h]) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h
}

function Button({x, y, text, fg, bg, onClick, inner, mouseXY, clicked}) {
  const foreground = fg || BLACK
  const background = bg || LIGHT_GREEN
  const width = text.length
  const height = 1
  const {x: innerX, y: innerY, width: innerWidth} = inner
  const actualX = x + innerX
  const actualY = y + innerY
  const isOver = isMouseOver([actualX, actualY], mouseXY, [width, height])

  if (isMouseOver && clicked) {
    onClick()
  }

  return (
    <Text
      x={actualX}
      y={actualY}
      text={text}
      fg={isOver ? foreground : background}
      bg={isOver ? background : foreground}
      maxWidth={innerWidth}
    />
  )
}

export default withDisplay(Button)

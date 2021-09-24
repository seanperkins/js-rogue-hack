import {useTheme} from '../contexts/ThemeContext'
import Text from './Text'
import withDisplay from './WithDisplay'
import useEventHandlers from '../utilities/useEventHandlers'

function isMouseOver([x, y], [mx, my], [w, h]) {
  return mx >= x && mx <= x + w && my >= y && my <= y + h
}

function Button({x, y, text, fg, bg, onClick, inner, mouseXY}) {
  const {getFG, getBG} = useTheme()
  const foreground = getFG(fg)
  const background = getBG(bg)
  const width = text.length
  const height = 1
  const {x: innerX, y: innerY, width: innerWidth} = inner
  const actualX = x + innerX
  const actualY = y + innerY
  const isOver = isMouseOver([actualX, actualY], mouseXY, [width, height])

  const _onClick = (e) => {
    // Only fire off the onClick if we are over this button
    isOver && onClick(e)
  }
  useEventHandlers({onClick: _onClick})

  return (
    <Text
      x={actualX}
      y={actualY}
      text={text}
      fg={isOver ? background : foreground}
      bg={isOver ? foreground : background}
      maxWidth={innerWidth}
    />
  )
}

export default withDisplay(Button)

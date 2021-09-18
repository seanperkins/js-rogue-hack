import withDisplay from './WithDisplay'
import chars from '../constants/characters'
import {BLACK, LIGHT_GREEN} from '../constants'
import {ShapeProps} from '../types'
import React, {Fragment} from 'react'
import {Display} from 'rot-js'
import Text from './Text'

type FrameProps = ShapeProps & {
  children: React.ReactElement
  title?: string
  display: Display
}

function Frame({title, x, y, width, height, children, display}: FrameProps) {
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      let char = ' '

      if (w === 0 && h === 0) {
        char = chars.upperLeftCorner // Upper left corner
      } else if (w === width - 1 && h === 0) {
        char = chars.upperRightCorner // Upper right corner
      } else if (w === 0 && h === height - 1) {
        char = chars.lowerLeftCorner // Lower left corner
      } else if (w === width - 1 && h === height - 1) {
        char = chars.lowerRightCorner // Lower right corner
      } else if (w === 0 || w === width - 1) {
        char = chars.verticalLine // Vertical
      } else if (h === 0 || h === height - 1) {
        char = chars.horizontalLine // Horizontal
      }
      if (char !== ' ') {
        display.draw(w + x, h + y, char, LIGHT_GREEN, BLACK) // Side
      }
    }
  }
  return (
    <Fragment>
      {title && <Text x={x + 1} y={y} text={title} />}
      {children &&
        React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            // If the child has already been given inner props, use those
            inner: child.props.inner
              ? child.props.inner
              : {
                  x: x + 1,
                  y: y + 1,
                  width: width - 2,
                  height: height - 2,
                },
          })
        })}
    </Fragment>
  )
}

export default withDisplay(Frame)

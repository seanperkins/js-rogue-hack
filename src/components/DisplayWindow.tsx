import React, {Fragment} from 'react'
import {BLACK, LIGHT_GREEN} from '../constants'
import {ShapeProps} from '../types'
import Fill from './Fill'
import Frame from './Frame'
import Text from './Text'
import withDisplay from './WithDisplay'

type WindowProps = ShapeProps & {
  title: string
  fg?: string
  bg?: string
  shadow?: boolean
  children: React.ReactElement
}

function DisplayWindow({
  title,
  x,
  y,
  width,
  height,
  fg,
  bg,
  shadow,
  children,
}: WindowProps) {
  const foreground = fg || LIGHT_GREEN
  const background = bg || BLACK

  return (
    <Frame
      x={x}
      y={y}
      width={width}
      height={height}
      fg={foreground}
      bg={background}
    >
      <Fill
        x={x + 1}
        y={y + 1}
        height={height - 2}
        width={width - 2}
        bg={background}
        fg={foreground}
      />
      <Fill x={x + 1} y={y + 1} height={1} width={width - 2} bg={foreground} />
      <Text x={x + 1} y={y + 1} text={title} fg={background} bg={foreground} />
      {shadow && (
        <Fragment>
          <Fill
            x={x + 1}
            y={y + height}
            height={1}
            width={width}
            fg={foreground}
            bg={background}
            char={'°'}
          />
          <Fill
            x={x + width}
            y={y + 1}
            height={height - 1}
            width={1}
            fg={foreground}
            bg={background}
            char={'°'}
          />
        </Fragment>
      )}
      {children &&
        React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            inner: {
              x: x + 1,
              y: y + 2,
              width: width - 3,
              height: height - 3,
            },
          })
        })}
    </Frame>
  )
}

export default withDisplay(DisplayWindow)

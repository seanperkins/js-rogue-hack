import {text} from 'stream/consumers'
import GlitchPanel from '../components/GlitchPanel'
import GlitchText from '../components/GlitchText'
import withDisplay from '../components/WithDisplay'

function Terminal({display, clearDisplay, getCenter, getHalfSize}) {
  const text =
    'Welcome to the jungle. This should also work with longer strings.'
  const {width, height} = getHalfSize()
  const [x, y] = getCenter({width, height})
  const [textX, textY] = getCenter({
    width: text.length > width ? width - 2 : text.length,
    height: 1,
  })
  clearDisplay()
  return (
    <GlitchPanel x={x} y={y} width={width} height={height}>
      <GlitchText
        x={textX}
        y={textY}
        text={text}
        fg={'red'}
        maxWidth={width - 2}
      />
    </GlitchPanel>
  )
}

export default withDisplay(Terminal)

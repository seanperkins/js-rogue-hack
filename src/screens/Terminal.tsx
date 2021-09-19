import GlitchPanel from '../components/GlitchPanel'
import Text from '../components/Text'
import withDisplay from '../components/WithDisplay'

function Terminal({display, clearDisplay, getCenter}) {
  const {width, height} = display.getOptions()
  const [x, y] = getCenter({width: width / 2, height: height / 2})
  clearDisplay()
  return (
    <GlitchPanel x={x} y={y} width={width / 2} height={height / 2}>
      <Text x={30} y={30} text="Welcome" fg={'red'} />
    </GlitchPanel>
  )
}

export default withDisplay(Terminal)

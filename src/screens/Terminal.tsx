import GlitchPanel from '../components/GlitchPanel'
import GlitchText from '../components/GlitchText'
import withDisplay from '../components/WithDisplay'

function Terminal({display, clearDisplay, getCenter}) {
  const {width, height} = display.getOptions()
  const [x, y] = getCenter({width: width / 2, height: height / 2})
  clearDisplay()
  return (
    <GlitchPanel x={x} y={y} width={width / 2} height={height / 2}>
      <GlitchText x={30} y={30} text="Welcome to the jungle" fg={'red'} />
    </GlitchPanel>
  )
}

export default withDisplay(Terminal)

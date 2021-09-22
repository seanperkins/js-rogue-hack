import {useState} from 'react'
import TypingText from '../components/TypingText'
import withDisplay from '../components/WithDisplay'
import {LIGHT_GREEN} from '../constants'

function Terminal({display, clearDisplay, getCenter, getHalfSize}) {
  const [line, setLine] = useState(0)
  const text = [
    'Oh good. You seem to have booted up.',
    'Are you receiving my input?',
    'I think there might an issue.',
    'Can you try to reboot?',
  ]
  const {width} = display.getOptions()

  function handleComplete() {
    if (line < text.length - 1) {
      setLine(line + 1)
    }
  }

  const lines = text.map((textLine, i) => {
    if (i > line) return null
    return (
      <TypingText
        x={1}
        y={1 + i * 2}
        text={text[i]}
        fg={LIGHT_GREEN}
        maxWidth={width - 2}
        glitched={true}
        onComplete={handleComplete}
      />
    )
  })

  clearDisplay()
  return lines
}

export default withDisplay(Terminal)

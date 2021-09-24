import {useState} from 'react'
import TypingText from '../components/TypingText'
import withDisplay from '../components/WithDisplay'
import {LIGHT_GREEN} from '../constants'
import useEventHandlers from '../utilities/useEventHandlers'

function Terminal({display, clearDisplay}) {
  const [line, setLine] = useState(0)
  const [forceComplete, setForceComplete] = useState(false)
  const text = [
    'Oh good. You seem to have booted up.',
    'Are you receiving my input?',
    'I think there might an issue.',
    'Can you try to reboot?',
  ]
  const {width} = display.getOptions()
  useEventHandlers({onClick})

  function handleComplete() {
    if (line < text.length - 1) {
      setLine(line + 1)
    }
  }

  function onClick() {
    setForceComplete(true)
  }

  const lines = text.map((textLine, i) => {
    if (i > line) return null
    return (
      <TypingText
        key={i}
        x={1}
        y={1 + i * 2}
        text={textLine}
        fg={LIGHT_GREEN}
        maxWidth={width - 2}
        glitched={false}
        onComplete={handleComplete}
        forceComplete={forceComplete}
      />
    )
  })

  clearDisplay()
  return lines
}

export default withDisplay(Terminal)

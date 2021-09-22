import {useEffect, useState} from 'react'
import GlitchText from './GlitchText'

import Text from './Text'

interface TypingTextProps {
  x: number
  y: number
  text: string
  maxWidth?: number
  fg?: string
  delay?: number
  speed?: number
  glitched?: boolean
  onComplete?: () => void
}

function TypingText({
  x,
  y,
  fg,
  text,
  speed,
  delay,
  maxWidth,
  onComplete,
  glitched,
}: TypingTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [timeoutHandle, setTimeoutHandle] = useState(null)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    // Wait to type until the delay has passed
    setTimeoutHandle(
      setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + 1))
      }, delay || 500),
    )

    return clearTimeout(timeoutHandle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (complete) return
    setTimeoutHandle(
      setTimeout(() => {
        if (text !== displayText) {
          setDisplayText(text.substring(0, displayText.length + 1))
        } else {
          setComplete(true)
          if (onComplete) onComplete()
        }
      }, speed || 150),
    )
  }, [displayText, text, speed, onComplete, complete])
  if (glitched) {
    return (
      <GlitchText x={x} y={y} text={displayText} fg={fg} maxWidth={maxWidth} />
    )
  }
  return <Text x={x} y={y} fg={fg} text={displayText} maxWidth={maxWidth} />
}

export default TypingText

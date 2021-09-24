// TODO: Complete line on click or keyboard input so you don't have to wait

import {useEffect, useState} from 'react'
import {useTheme} from '../contexts/ThemeContext'
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
  forceComplete?: boolean
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
  forceComplete,
}: TypingTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [timeoutHandle, setTimeoutHandle] = useState(null)
  const [complete, setComplete] = useState(false)
  const {getFG} = useTheme()
  const foreground = getFG(fg)

  useEffect(() => {
    // Wait to type until the delay has passed
    if (forceComplete) {
      return
    }
    setTimeoutHandle(
      setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + 1))
      }, delay || 500),
    )

    return clearTimeout(timeoutHandle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (complete || forceComplete) {
      clearTimeout(timeoutHandle)
    }
    setTimeoutHandle(
      setTimeout(() => {
        if (text !== displayText) {
          setDisplayText(text.substring(0, displayText.length + 1))
        } else {
          setDisplayText(text)
          setComplete(true)
          if (onComplete) onComplete()
        }
      }, speed || 150),
    )
    return clearTimeout(timeoutHandle)
    // Can't include timoutHandle or it fires off too frequently
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayText, text, speed, onComplete, complete, forceComplete])

  useEffect(() => {
    if (!complete && forceComplete) {
      clearTimeout(timeoutHandle)
      setDisplayText(text)
      setComplete(true)
      if (onComplete) onComplete()
    }
    return clearTimeout(timeoutHandle)
  }, [forceComplete, complete, text, onComplete, timeoutHandle])

  if (glitched) {
    return (
      <GlitchText
        x={x}
        y={y}
        text={displayText}
        fg={foreground}
        maxWidth={maxWidth}
      />
    )
  }
  return (
    <Text x={x} y={y} fg={foreground} text={displayText} maxWidth={maxWidth} />
  )
}

export default TypingText

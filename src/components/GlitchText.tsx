import {useEffect, useState} from 'react'
import {RNG} from 'rot-js'
import {useTheme} from '../contexts/ThemeContext'
import {getRandomChar} from '../utilities/random'
import Text from './Text'

interface Props {
  x: number
  y: number
  text: string
  fg?: string
  bg?: string
  maxWidth?: number
  glitchLevel?: number
  glitchFrequency?: number
}
function GlitchText({
  x,
  y,
  text,
  fg,
  bg,
  maxWidth,
  glitchLevel,
  glitchFrequency,
}: Props) {
  const [glitched, setGlitched] = useState(false)
  const {getBG, getFG} = useTheme()
  const foreground = getFG(fg)
  const background = bg ? getBG(bg) : null
  useEffect(() => {
    setGlitched(true)
  }, [])
  useEffect(() => {
    let handle
    if (!glitched) {
      handle = setTimeout(
        () => {
          setGlitched(true)
        },
        glitchFrequency ? glitchFrequency * 1000 : 5000,
      )
    } else {
      handle = setTimeout(() => {
        setGlitched(false)
      }, 500)
    }
    return () => clearTimeout(handle)
  }, [glitched, glitchFrequency])

  const txt = glitched ? glitchText(text, glitchLevel) : text
  return (
    <Text
      x={x}
      y={y}
      text={txt}
      fg={foreground}
      bg={background}
      maxWidth={maxWidth}
    />
  )
}

export default GlitchText

function glitchText(text: string, glitchLevel: number = 0.2) {
  // Iterate through text string
  let newText = ''
  for (let i = 0; i < text.length; i++) {
    // If a random number is less than glitchLevel, add a random character
    if (text[i] === ' ') {
      newText += ' '
    } else if (RNG.getUniform() < glitchLevel) {
      newText += getRandomChar()
    } else {
      newText += text[i]
    }
  }
  return newText
}

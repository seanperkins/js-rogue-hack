import {useEffect, useState} from 'react'
import {RNG} from 'rot-js'
import {getRandomChar} from '../utilities/random'
import Text from './Text'

interface Props {
  x: number
  y: number
  text: string
  fg?: string
  bg?: string
  maxWidth?: number
}
function GlitchText({x, y, text, fg, bg, maxWidth}: Props) {
  const [txt, setTxt] = useState(text.toUpperCase())
  useEffect(() => {
    setTxt(glitchText(text))
    setTimeout(() => {
      setTxt(text)
    }, 1000)
  }, [setTxt, text])
  return <Text x={x} y={y} text={txt} fg={fg} bg={bg} maxWidth={maxWidth} />
}

export default GlitchText

function glitchText(text: string) {
  // Iterate through text string
  let newText = ''
  for (let i = 0; i < text.length; i++) {
    // If a random number is less than 0.1, add a random character
    if (RNG.getUniform() < 0.4) {
      newText += getRandomChar()
    } else {
      newText += text[i]
    }
  }
  return newText
}

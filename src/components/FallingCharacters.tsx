import {useEffect, useState} from 'react'
import withDisplay from './WithDisplay'
import * as Color from 'color'
import useInterval from '../utilities/useInterval'
import {getRandomChar} from '../utilities/random'

function FallingCharacters({display, x, y, fg, maxHeight, char, speed}) {
  const [characters, setCharacters] = useState([])
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const chars = []
    for (let index = 0; index < maxHeight; index++) {
      chars.push({
        char: char ? char : getRandomChar(),
        color: Color(fg)
          .lighten(index * 0.02)
          .hex(),
      })
    }
    setCharacters(chars)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useInterval(
    () => {
      setCharIndex(charIndex + 1)
    },
    // Once we have reached the right lenght, set interval to null so it stops running
    charIndex >= maxHeight ? null : speed * 100,
  )

  for (let i = 0; i <= charIndex; i++) {
    const c = characters[i]
    if (!c) break
    display.draw(x, y + i, c.char, c.color)
  }

  return null
}

export default withDisplay(FallingCharacters)

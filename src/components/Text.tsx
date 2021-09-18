import withDisplay from './WithDisplay'

interface Props {
  x: number
  y: number
  text: string
  drawText: any
  fg?: string
  bg?: string
  maxWidth?: number
}
function Text({x, y, text, drawText, fg, bg, maxWidth}: Props) {
  drawText({x, y, text: text.toUpperCase(), fg, bg, maxWidth})
  return null
}

export default withDisplay(Text)

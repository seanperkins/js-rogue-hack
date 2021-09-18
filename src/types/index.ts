export type MessageType = 'error' | 'into'

export type Message = {
  text: string
  type: MessageType
  count: number
}

export type GameState = {
  state: 'menu' | 'terminal' | 'level'
}

export interface Position {
  x: number
  y: number
}

export interface ShapeProps {
  x: number
  y: number
  width: number
  height: number
}

export interface CharacterProps {
  fg: string
  bg: string
  char: string
}

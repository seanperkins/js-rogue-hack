import {BLACK, GREEN, LIGHT_GREEN} from './constants/colors'

type GraphicTile = {
  ch: string
  fg: string
  bg: string
}

type TileData = {
  walkable: boolean
  transparent: boolean
  dark: GraphicTile
  light: GraphicTile
}

function newTile(
  walkable: boolean,
  transparent: boolean,
  dark: GraphicTile,
  light: GraphicTile,
): TileData {
  return {
    walkable,
    transparent,
    dark,
    light,
  }
}

export const SHROUD: GraphicTile = {
  ch: ' ',
  fg: BLACK,
  bg: BLACK,
}

export const floor = newTile(
  true,
  true,
  {ch: 'ù', fg: GREEN, bg: BLACK},
  {ch: 'ù', fg: LIGHT_GREEN, bg: BLACK},
)

export const wall = newTile(
  false,
  false,
  {ch: '#', fg: GREEN, bg: BLACK},
  {ch: '#', fg: LIGHT_GREEN, bg: BLACK},
)

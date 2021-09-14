import * as ROT from 'rot-js'

import Game from 'Game'
import {Entity} from '@entities'

export interface GameStuff {
  game: Game
  display: ROT.Display
}

export interface LevelConfig {
  width: number
  height: number
  entities: Entity[]
  cameraHeight?: number
  cameraWidth?: number
}

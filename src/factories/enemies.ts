import {LIGHT_GREEN} from '../constants/colors'
import {Actor} from '../Entity'
import LevelMap from '../LevelMap'

export const createProcessEnemy = (x: number, y: number, parent: LevelMap) =>
  new Actor('P', LIGHT_GREEN, 'Process', x, y, parent)

export const createScannerEnemy = (x: number, y: number, parent: LevelMap) =>
  new Actor('S', LIGHT_GREEN, 'Scanner', x, y, parent)

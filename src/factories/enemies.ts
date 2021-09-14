import {HostileEnemy} from '@components'
import {RenderOrder} from '@constants'
import {LIGHT_GREEN} from '../constants/colors'
import {Actor} from '../entities/'
import LevelMap from '../screens/LevelMap'

export const createProcessEnemy = (x: number, y: number, parent: LevelMap) =>
  new Actor(
    'P',
    LIGHT_GREEN,
    'Process',
    x,
    y,
    parent,
    true,
    RenderOrder.ACTOR,
    HostileEnemy,
  )

export const createScannerEnemy = (x: number, y: number, parent: LevelMap) =>
  new Actor(
    'S',
    LIGHT_GREEN,
    'Scanner',
    x,
    y,
    parent,
    true,
    RenderOrder.ACTOR,
    HostileEnemy,
  )

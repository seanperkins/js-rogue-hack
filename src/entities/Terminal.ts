import Entity from './Entity'
import {NetworkPort} from '@components/index'
import RenderOrder from '../constants/renderOrder'

export default class Terminal extends Entity {
  networkPort?: NetworkPort

  constructor(
    char,
    color,
    name,
    x,
    y,
    parent,
    blocksMovement = true,
    renderOrder = RenderOrder.TERMINALS,
  ) {
    super(char, color, name, x, y, parent, blocksMovement, renderOrder)
  }

  get hasNetworkPort(): boolean {
    return !!this.hasNetworkPort
  }
}

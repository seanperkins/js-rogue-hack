import {Entity} from './'
import RenderOrder from '../constants/renderOrder'

export default class Actor extends Entity {
  ai: any

  constructor(
    char,
    color,
    name,
    x,
    y,
    parent,
    blocksMovement = true,
    renderOrder = RenderOrder.ACTOR,
  ) {
    super(char, color, name, x, y, parent, blocksMovement, renderOrder)
  }

  get isAlive() {
    if (this.ai) return true
    return false
  }
}

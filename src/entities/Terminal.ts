import Entity from './Entity'
import TeleportDestination from '../components/TeleportDestination'
import RenderOrder from '../constants/renderOrder'

export default class Terminal extends Entity {
  teleporter?: TeleportDestination

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

  get isTeleporter(): boolean {
    return !!this.teleporter
  }
}

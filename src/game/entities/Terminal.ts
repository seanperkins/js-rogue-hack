import {Entity} from '.'
import {NetworkPort} from '../components'
import {RenderOrder} from '../../constants'

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
    networkSecurity?: number,
  ) {
    super(char, color, name, x, y, parent, blocksMovement, renderOrder)

    if (networkSecurity) {
      // @ts-ignore
      this.networkPort = new NetworkPort(this, networkSecurity)
    }
  }

  get isNetworked(): boolean {
    return !!this.networkPort
  }
}

export const terminalWeights = {
  unsecuredPrinter: 1,
  securedPrinter: 1,
  laptop: 3,
}

export const terminalTypes = {
  unsecuredPrinter: {
    name: 'Unsecured Printer',
    networkSecurity: 0,
  },
  securedPrinter: {
    name: 'Secured Printer',
    networkSecurity: 1,
  },
  laptop: {
    name: 'Laptop',
    networkSecurity: 2,
  },
}

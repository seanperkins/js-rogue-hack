import {Entity} from '../entities'
import BaseComponent from './BaseComponent'

export default class NetworkPort extends BaseComponent {
  networkSecurity: number
  constructor(parent: Entity, networkSecurity: number = 0) {
    super(parent)
    this.networkSecurity = networkSecurity
  }
}

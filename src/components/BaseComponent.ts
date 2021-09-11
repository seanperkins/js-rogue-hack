import {Entity} from '../entities/'

export default class BaseComponent {
  parent: Entity
  constructor(parent: Entity) {
    this.parent = parent
  }

  get levelMap() {
    return this.parent.levelMap
  }
}

import {Entity} from '../entities/'

export default class BaseComponent {
  parent: Entity

  get levelMap() {
    return this.parent.levelMap
  }
}

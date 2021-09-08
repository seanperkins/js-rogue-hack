import Entity from '../Entity'

export default class BaseComponent {
  parent: Entity

  get levelMap() {
    return this.parent.levelMap
  }
}

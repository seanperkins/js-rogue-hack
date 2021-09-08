import Entity from '../Entity'

export default class BaseComponent {
  parent: Entity

  levelMap() {
    return this.parent.levelMap()
  }
}

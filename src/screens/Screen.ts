import {clearDisplay} from '../utilities/display'
import {UIComponent} from '../utilities/ui'
import {NotImplementedError} from '../Errors'
import Game from '../Game'

export default class Screen {
  game: Game
  name: string;

  [key: string]: any

  components: UIComponent[] = []

  constructor(game: Game, name: string) {
    this.game = game
    this.name = name
  }

  /**
   * handleEvent - Handles keyboard and mouse events
   * @returns {void}
   */
  handleEvent(e: Event) {
    throw new NotImplementedError(
      `Handle input not implemented on ${this.name} screen`,
    )
  }

  /**
   * update - Called every loop, updates entites and things prior to render
   * @returns {void}
   */
  update() {
    throw new NotImplementedError(
      `Update not implemented on ${this.name} screen`,
    )
  }

  /**
   * render - Renders the screen, normally called by game loop
   * @returns {void}
   */
  render() {
    this.components.forEach((component) => component.destroy())
  }

  /**
   * destroy - Called when the screen is no longer needed
   * @returns {void}
   */
  destroy() {
    this.components.forEach((component) => component.destroy())
    clearDisplay(this.game.display)
  }
}

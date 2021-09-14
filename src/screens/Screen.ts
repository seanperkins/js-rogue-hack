import {NotImplementedError} from '../Errors'
import Game from '../Game'

export default class Screen {
  game: Game
  name: string;

  [key: string]: any

  constructor(game: Game, name: string) {
    this.game = game
    this.name = name

    this.init()
  }

  /**
   * init - Called when the screen is first created
   * @returns {void}
   */
  init() {
    throw new NotImplementedError(`Init not implemented on ${this.name} screen`)
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
    throw new NotImplementedError(
      `Render not implemented on ${this.name} screen`,
    )
  }

  /**
   * destroy - Called when the screen is no longer needed
   * @returns {void}
   */
  destroy() {
    throw new NotImplementedError(
      `Destroy not implemented on ${this.name} screen`,
    )
  }
}

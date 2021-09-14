import Screen from './Screen'

export default class Welcome extends Screen {
  constructor(game) {
    super(game, 'Welcome')
  }

  render() {
    this.game.display.drawText(0, 0, 'Welcome')
  }
}

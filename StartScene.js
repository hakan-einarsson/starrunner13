import { GameObjectClass, Sprite, Text, initKeys, keyPressed, initGamepad, gamepadPressed } from 'kontra';
import createBackground from './createBackground';
import { baseUnit } from './constants';
import { getScore } from './storeToLocalStorage';
import floatingText from './floatingText';

initKeys();
initGamepad();

export default class StartPage extends GameObjectClass {

  constructor(gameState, image, backgroundImage, isMobile, properties) {
    super(properties)

    this.gameState = gameState;
    this.image = image;
    this.background = createBackground(backgroundImage);
    this.floatingTexts = [floatingText('Test', baseUnit * 4, baseUnit * 4)];
    this.isMobile = isMobile;

    this.title = new Sprite({
      x: baseUnit * 4.5,
      y: baseUnit * 3.5,
      image: this.image,
      anchor: { x: 0.5, y: 0.5 },
    });

    this.highScore = new Text({
      text: `High Score: ${getScore()}`,
      font: `${baseUnit / 2}px Arial`,
      color: 'white',
      anchor: { x: 0.5, y: 0.5 },
      x: baseUnit * 4.5,
      y: baseUnit * 5.5,
    });

    this.subTitle = new Text({
      text: 'Start / Enter',
      font: `${baseUnit / 2}px Arial`,
      color: 'white',
      anchor: { x: 0.5, y: 0.5 },
      x: baseUnit * 4.5,
      y: baseUnit * 6.5,
    });
  }



  update(dt) {
    if (keyPressed('enter') || gamepadPressed('start') || (this.isMobile && this.gameState.touchControls.getButtonPressed('start'))) {
      this.gameState.playerSprite.paused = false;
      this.gameState.playerSprite.buttonWasPressedMap.start = true;
      this.gameState.startGame();
    }
  }

  render() {
    this.background.render();
    this.title.render();
    this.highScore.render();
    this.subTitle.render();
    if (this.gameState.touchControls) {
      this.gameState.touchControls.render();
    }

  }
}
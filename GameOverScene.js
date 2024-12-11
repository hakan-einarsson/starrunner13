import { GameObjectClass, Sprite, Text, initKeys, keyPressed, initGamepad, gamepadPressed } from 'kontra';
import createBackground from './createBackground';
import { baseUnit } from './constants';


initKeys();
initGamepad();

export default class StartPage extends GameObjectClass {

  constructor(gameState, backgroundImage, isMobile, properties) {
    super(properties)

    this.gameState = gameState;
    this.isMobile = isMobile;
    this.titleSet = false;
    this.background = createBackground(backgroundImage);
    this.title = new Text({
      text: this.gameState.titleText,
      font: '20px Arial',
      color: 'white',
      anchor: { x: 0.5, y: 0.5 },
      x: baseUnit * 4,
      y: 60 * 3,
    });


    this.setTitleText = (text) => {
      this.title.text = text;
    }


    this.scoreText = new Text({
      score: 0,
      text: 'Total score: ' + this.score,
      font: '20px Arial',
      color: 'white',
      anchor: { x: 0.5, y: 0.5 },
      x: baseUnit * 4,
      y: baseUnit * 3.5,
      update: function () {
        this.text = 'Total score: ' + this.score;
      }
    });

    this.levelText = new Text({
      text: 'Level: ' + this.gameState.level,
      font: '20px Arial',
      color: 'white',
      anchor: { x: 0.5, y: 0.5 },
      x: baseUnit * 4,
      y: baseUnit * 4.2,
      update: function (gameState) {
        if (gameState.newTopLevel) {
          this.text = 'New top level: ' + gameState.level;
        } else {
          this.text = 'Level: ' + gameState.level;
        }
      }
    });

    this.subTitle = new Text({
      text: 'Press [Enter / Start] to try again',
      font: '20px Arial',
      color: 'white',
      anchor: { x: 0.5, y: 0.5 },
      x: baseUnit * 4,
      y: baseUnit * 5.4,
    });
  }



  update(dt, score) {
    this.scoreText.score = score;
    this.scoreText.update();
    this.levelText.update(this.gameState);
    if (keyPressed('enter') || gamepadPressed('start') || (this.isMobile && this.gameState.touchControls.getButtonPressed('start'))) {
      this.gameState.playerSprite.paused = false;
      this.gameState.playerSprite.buttonWasPressedMap.start = true;
      this.gameState.startGame();
    }
  }

  render() {
    this.background.render();
    this.title.render();
    this.subTitle.render();
    this.scoreText.render();
    this.levelText.render();
    if (this.gameState.touchControls) {
      this.gameState.touchControls.render();
    }
  }
}
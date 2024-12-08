import { GameObjectClass, initKeys, initGamepad, collides, keyMap } from 'kontra';
import play from './Audio';
import createExplosion from './createExplosion';
import { createLazerVertical, createLazerHorizontal } from './createLazers';
import createEnergyBar from './createEnergyBar';
import createPlayer from './createPlayer';
import createGoalSprite from './createGoalSprite';
import GridState from './GridState';
import { getScore, saveScore } from './storeToLocalStorage';
import getTitleText from './getTitleText';
import TouchControls from './TouchControls';
import { baseUnit } from './constants';
import createPauseOverlay from './createPauseOverlay';
import floatingText from './floatingText';


initKeys();
initGamepad();
keyMap['ControlLeft'] = 'ctrl';

export default class GameState extends GameObjectClass {

  constructor(sprite, gameArea, scale, isMobile, properties) {
    super(properties)
    this.initialScore = getScore();
    this.newHighScore = false;
    this.sprite = sprite;
    this.gameArea = gameArea;
    this.score = 0;
    this.level = 160;
    this.gameOver = false;
    this.gameObjects = [];
    this.scale = scale;
    this.isMobile = isMobile;
    this.scene = 'START';
    this.goalSprite = createGoalSprite(this.context);
    this.energyBar = createEnergyBar();
    this.playerSprite = createPlayer(this.context, this.sprite);
    this.pauseOverlay = createPauseOverlay(this.context, this.isMobile);
    this.touchControls = null;
    this.gameObjects.push(this.playerSprite);
    this.horizontalNumbers = [];
    this.verticalNumbers = [];
    this.colsWith13Sums = [];
    this.rowsWith13Sums = [];
    this.tilesWith13Sums = [];
    this.paused = false;
    this.gridState = new GridState(
      this.sprite,
      this.getHorizontalNumbers.bind(this),
      this.getVerticalNumbers.bind(this),
      this.getColsWith13Sums.bind(this),
      this.getRowsWith13Sums.bind(this),
      this.getTilesWith13Sums.bind(this)
    );
    this.titleText = null;
    this.onScoreChange;
    this.levelTimer = 0;
    this.levelTime = 0;
    this.levelScore = 0;
    this.bonusTexts = [];
  }

  addTouchControls() {
    this.touchControls = new TouchControls(this.context, this.scale);
    this.touchControls.addListeners(canvas);
    this.playerSprite.addTouchControls(this.touchControls);
  }

  getScoreMultiplied() {
    let timeMultiplier = 1 / (this.levelTime / 20);
    if (timeMultiplier < 1) {
      timeMultiplier = 1;
    }
    const levelMultiplier = 1 + this.level / 10;
    const score = Math.round(5 * timeMultiplier * levelMultiplier) - 5;
    this.bonusTexts.push(floatingText(`+${score}`, this.playerSprite.x, this.playerSprite.y));
    return score;
  }

  getHorizontalNumbers() {
    return this.horizontalNumbers;
  }

  getVerticalNumbers() {
    return this.verticalNumbers;
  }

  getColsWith13Sums() {
    return this.colsWith13Sums;
  }

  getRowsWith13Sums() {
    return this.rowsWith13Sums;
  }

  getTilesWith13Sums() {
    return this.tilesWith13Sums;
  }



  startGame() {
    this.level = 1;
    this.gameArea.level = this.level;
    this.gameArea.startLevel();
    this.gameArea.updateCurrentLevel(this.level);
    this.gameObjects = [];
    this.playerSprite.resetPlayer();
    this.gameOver = false;
    this.score = 0;
    this.levelScore = 0;
    this.gameArea.updatedScoreBoard(this.score);
    this.scene = 'GAME';
    this.horizontalNumbers = [];
    this.verticalNumbers = [];
    this.numberOfColumns = 8;
    this.titleText = null;
    this.populateNumbers();
    this.populateColsAndRowsWith13Sums();
    this.gridState.startLevel();
    this.levelTimer = 0;
    this.levelTime = 0;
  }

  isOn13() {
    this.rowNumber = Math.floor(this.playerSprite.y / baseUnit) - 1;
    this.columnNumber = Math.floor(this.playerSprite.x / baseUnit) - 1;
    const summary = this.verticalNumbers[this.rowNumber] + this.horizontalNumbers[this.columnNumber];

    if (summary === 13 && !this.playerSprite.stealthed && !this.gridState.horizontalCanons[this.columnNumber].inTransition) {
      const targetPoint = { x: this.columnNumber * baseUnit, y: this.rowNumber * baseUnit + 2 * baseUnit };
      this.gameObjects.push(createLazerVertical(targetPoint));
      this.gameObjects.push(createLazerHorizontal(targetPoint));
      this.playerSprite.dead = true;
      this.gameObjects.push(createExplosion(this));
      if (!this.titleText) {
        this.titleText = getTitleText(this.score, Number(getScore()));
        this.onScoreChange(this.titleText);
      }
      if (this.score > Number(getScore())) {
        this.newHighScore = true;
        saveScore(this.score);
      }
      play('explosion');
    }
  }

  isOnGoalSprite() {
    const collide = collides(this.playerSprite, this.goalSprite);
    if (collide) {
      this.levelScore += 1;
      this.score += 1;
      this.goalSprite.x = Math.floor(Math.random() * 7) * baseUnit + baseUnit;
      this.goalSprite.y = Math.floor(Math.random() * 7) * baseUnit + baseUnit;
      this.gameArea.updatedScoreBoard(this.score);
      play('pickup', 0.2);
    }
  }

  levelUp() {
    if (this.levelScore === 5) {
      this.score += this.getScoreMultiplied();
      this.gameArea.updatedScoreBoard(this.score);
      this.levelTime = 0;
      this.levelTimer = 0;
      this.levelScore = 0;
      this.level = this.level + 1;
      this.gameArea.updateCurrentLevel(this.level);
      play('levelup', 0.3);
    }
  }

  populateNumbers() {
    for (let i = 0; i < this.numberOfColumns; i++) {
      this.horizontalNumbers.push(i % 5 + 1);
      this.verticalNumbers.push(i % 5 + 1);
    }
  }

  updateNumbers() {
    this.horizontalNumbers.shift();
    this.horizontalNumbers.push(Math.floor(Math.random() * 9) + 1);
    this.verticalNumbers.shift();
    this.verticalNumbers.push(Math.floor(Math.random() * 9) + 1);

    this.populateColsAndRowsWith13Sums();
    play('update');
  }

  populateColsAndRowsWith13Sums() {
    this.colsWith13Sums = [];
    this.rowsWith13Sums = [];
    this.tilesWith13Sums = [];
    let count = 0;
    for (let i = 0; i < this.numberOfColumns - 1; i++) {
      for (let j = 0; j < this.numberOfColumns - 1; j++) {
        count++;
        if (this.horizontalNumbers[i] + this.verticalNumbers[j] === 13) {
          this.colsWith13Sums.push(i);
          this.rowsWith13Sums.push(j);
          this.tilesWith13Sums.push({ x: i, y: j });
        }
      }
    }
  }

  getLevelSpeed() {
    const startIntervall = 2;
    const updatedFactor = 0.1;
    return startIntervall / (1 + (this.level - 1) * updatedFactor);
  }

  updateGridState(dt) {
    this.timeSinceLastUpdate = this.timeSinceLastUpdate || 0;
    this.levelTimer += dt;
    //if levelTimer is greater than 1 second update gameArea.updateTimeBoard
    if (this.levelTimer > 1) {
      this.levelTime += 1;
      this.gameArea.updateTimeBoard(this.levelTime);
      this.levelTimer = this.levelTimer - 1;
    }
    this.timeSinceLastUpdate += dt;
    if (this.timeSinceLastUpdate > this.getLevelSpeed()) {
      this.updateNumbers();
      this.timeSinceLastUpdate = 0;
      this.isUpdating = true;
      this.gridState.onTick();
    }
    this.gridState.update(dt);
  }

  update(dt) {
    if (!this.playerSprite.paused) {

      this.updateGridState(dt);
      if (this.touchControls) {
        this.touchControls.update();
      }
      this.levelUp();
      if (this.gameOver) {
        this.scene = 'GAME_OVER';
        return;
      }
      this.gameObjects.forEach((object, index) => {
        object.update(dt);
        if (object.remove) {
          this.gameObjects.splice(index, 1);
        }
      });
      this.isOnGoalSprite();
    }
    if (!this.playerSprite.dead) {
      this.playerSprite.update(dt);
      this.isOn13();
    }
    this.bonusTexts.forEach((text, index) => {
      text.update();
      if (text.remove) {
        this.bonusTexts.splice(index, 1);
      }
    });
  }

  render() {
    if (this.touchControls) {
      this.touchControls.render();

    }
    this.gameArea.render();
    this.gridState.render();
    this.goalSprite.render();
    if (this.gameOver) {
      this.scene = 'GAME_OVER';
      return;
    }
    this.gameObjects.forEach(laser => laser.render());
    if (!this.playerSprite.dead) {
      this.playerSprite.render();
    }
    this.energyBar.customRender(this.playerSprite.energy);
    this.bonusTexts.forEach(text => text.render());
    if (this.playerSprite.paused) {
      this.pauseOverlay.render();
    }
  }
}
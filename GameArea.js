import { Sprite } from 'kontra';
import createBackground from './createBackground';
import createGrid from './createGrid';
import play from './Audio';
import GridState from './GridState';
import createTextBoard from './createTextBoard';
import { baseUnit } from './constants';

export default class GameArea {

  constructor(sprite, backgroundImage) {
    this.sprite = sprite;
    this.columnTexts = []
    this.numberOfColumns = 8;
    this.level = 1;
    this.levelSpeed = 1;
    this.horizontalNumbers = [];
    this.verticalNumbers = [];
    this.colsWith13Sums = [];
    this.rowsWith13Sums = [];
    this.tilesWith13Sums = [];
    this.background = createBackground(backgroundImage);
    this.levelUpdated = false;
    this.gridState = new GridState(
      this.sprite,
      this.getHorizontalNumbers.bind(this),
      this.getVerticalNumbers.bind(this),
      this.getColsWith13Sums.bind(this),
      this.getRowsWith13Sums.bind(this),
      this.getTilesWith13Sums.bind(this)
    );
    this.scoreBoard = createTextBoard(baseUnit * 1.5, 'S');
    this.scoreBoard.width = baseUnit * 1.6;
    this.levelBoard = createTextBoard(baseUnit * 3.2, 'L');
    this.levelBoard.width = baseUnit * 1.2;
    this.timeBoard = createTextBoard(baseUnit * 4.5, 'T');
    this.timeBoard.width = baseUnit * 1.3;
  }

  startLevel() {
    this.grid = this.resetGrid();
    this.updateTimeBoard(0);
  }

  setLevelSpeed() {
    this.levelSpeed = 1 + this.level / 2;
  }

  resetGrid() {
    this.levelUpdated = true;
    return createGrid(this.sprite, this.level);
  }

  getCurrentLevel() {
    return this.level;
  }

  getColsWith13Sums() {
    return this.colsWith13Sums;
  }

  getRowsWith13Sums() {
    return this.rowsWith13Sums;
  }

  getHorizontalNumbers() {
    return this.horizontalNumbers;
  }

  getVerticalNumbers() {
    return this.verticalNumbers;
  }

  getTilesWith13Sums() {
    return this.tilesWith13Sums;
  }

  populateNumbers() {
    for (let i = 0; i < this.numberOfColumns; i++) {
      this.horizontalNumbers.push(i % 5 + 1);
      this.verticalNumbers.push(i % 5 + 1);
    }
  }

  updateCurrentLevel(level) {
    this.level = level;
    this.grid.updateCurrentLevel(level);
    this.levelUpdated = true;
    const levelWithThreeDigits = level.toString().padStart(3, '0');
    this.levelBoard.setAmount(levelWithThreeDigits);
  }

  updatedScoreBoard(score) {
    //always 5 digits
    score = score.toString();
    while (score.length < 5) {
      score = '0' + score
      this.scoreBoard.setAmount(score);
    }
  }

  updateTimeBoard(time) {
    //set time as 0:00
    let mins = Math.floor(time / 60);
    let secs = time % 60;
    if (secs < 10) {
      secs = '0' + secs;
    }
    this.timeBoard.setAmount(`${mins}:${secs}`);
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

  createBackground() {
    return Sprite({
      x: 0,
      y: 0,
      image: this.backgroundImage,
    });
  }

  getLevelSpeed() {
    const startIntervall = 2;
    const updatedFactor = 0.1;
    return startIntervall / (1 + (this.level - 1) * updatedFactor);
  }

  update(dt) {
    this.timeSinceLastUpdate = this.timeSinceLastUpdate || 0;
    this.timeSinceLastUpdate += dt;
    if (this.timeSinceLastUpdate > this.getLevelSpeed()) {
      this.updateNumbers();
      this.timeSinceLastUpdate = 0;
      this.isUpdating = true;
      this.gridState.onTick();
    }
    this.gridState.update(dt);
  }

  render() {
    this.background.render();
    this.grid.render();
    this.scoreBoard.render();
    this.levelBoard.render();
    this.timeBoard.render();
    // this.gridState.render();
  }
}
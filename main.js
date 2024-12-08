import { init, GameLoop, load } from 'kontra';

import GameState from './GameState';
import GameArea from './GameArea';
import StartScene from './StartScene';
import GameOverScene from './GameOverScene';
import generateStars from './SkyGenerator';
import { baseUnit } from './constants';

const main = async () => {
  let { canvas, context } = init();


  const isMobile = activateMobileControls();
  const gameWidth = baseUnit * 9;
  const gameHeight = isMobile ? baseUnit * 18 : baseUnit * 9;
  canvas.width = gameWidth;
  canvas.height = gameHeight;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  let scale = Math.min(screenWidth / gameWidth, screenHeight / gameHeight);
  if (scale > 2) {
    scale = 2;
  }
  canvas.style.width = `${gameWidth * scale}px`;
  canvas.style.height = `${gameHeight * scale}px`;

  window.addEventListener('resize', () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scale = Math.min(screenWidth / gameWidth, screenHeight / gameHeight);
    if (scale > 2) {
      scale = 2;
    }
    canvas.style.width = `${gameWidth * scale}px`;
    canvas.style.height = `${gameHeight * scale}px`;
  });


  const sprites = await load('square.png');
  const title = await load('title.png');
  const background = generateStars(250);
  let gameArea = new GameArea(sprites[0], background);
  let gameState = new GameState(sprites[0], gameArea, scale, isMobile);
  if (isMobile) {
    gameState.addTouchControls();
  }
  let startScene = new StartScene(gameState, title[0], background, isMobile);
  let gameOverScene = new GameOverScene(gameState, background, isMobile);

  gameState.onScoreChange = gameOverScene.setTitleText;

  let loop = GameLoop({  // create the main game loop
    update: function (dt) { // update the game state
      if (gameState.scene == 'START') {
        startScene.update();
        return;
      } else if (gameState.scene == 'GAME_OVER') {
        gameOverScene.update(dt, gameState.score);
        return;
      }
      gameState.update(dt)
    },
    render: function () { // render the game state
      if (gameState.scene == 'START') {
        startScene.render();
        return;
      } else if (gameState.scene == 'GAME_OVER') {
        gameOverScene.render();
        return;
      }
      gameState.render();
    }
  });

  loop.start(); // start the game
}

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isPortrait() {
  return window.innerHeight > window.innerWidth;
}

function activateMobileControls() {
  return isMobileDevice() && isPortrait();
}

main();
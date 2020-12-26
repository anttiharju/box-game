/**
 * BoxCollector p5.js version
 * @author Antti Harju
 * @version 26.12.2020
 */
const playerSize = 30;
const playerSpeed = 3;
let diagonalCorrection;
let playerAlive = true;
let playerX;
let playerY;
let player;
let playerUp;
let playerLeft;
let playerDown;
let playerRight;
let playerDead;

const boxAmount = 10;
const boxSizeMax = 30;
const boxSizeMin = 5;
let boxColor = [];
let boxSize = [];
let boxX = [];
let boxY = [];

const scoreX = 16;
const scoreY = 25;
let score = 0;
let highscore = 0;

const backgroundSize = 500;
let background;
let center;

const enemySize = 30;
const enemySpeed = 5;
let enemyX;
let enemyY;
let enemy;


function preload() {
  playerUp = loadImage('img/player-up.png');
  playerLeft = loadImage('img/player-left.png');
  playerDown = loadImage('img/player-down.png');
  playerRight = loadImage('img/player-right.png');
  playerDead = loadImage('img/player-dead.png');
  enemy = loadImage('img/enemy.png');
  background = loadImage('img/background.png');
}


function setup() {
  noStroke(); // We want no blurred outlines
  noSmooth();
  diagonalCorrection = floor(sqrt(sq(playerSpeed) + sq(playerSpeed))) - playerSpeed;
  center = round(backgroundSize / 2 - playerSize / 2);
  playerX = center;
  playerY = center;
  player = playerDown;
  enemyX = -enemySize * 5;
  enemyY = backgroundSize - enemySize * 2;
  createCanvas(500, 500).style('display', 'block').parent('sketch-holder');
  for (let i = 0; i < boxAmount; i++) {
    spawnBox(i);
  }
  highscore = getItem('localHighscore');
}


function randomInt(min, max) {
  return round(random(min, max + 1));
}


function nextEnemyY(range) {
  let min = playerY - range;
  if (min < 0) {
    min = 0;
  }
  let max = playerY + range;
  if (max > backgroundSize - enemySize) {
    max = backgroundSize - enemySize;
  }
  return randomInt(min, max);
}


function draw() {
  update();
  collision();

  image(background, 0, 0);
  for (let i = 0; i < boxAmount; i++) {
    box(boxX[i], boxY[i], boxSize[i], boxSize[i], boxColor[i]);
  }
  image(player, playerX, playerY);
  image(enemy, enemyX, enemyY);

  fill (0, 0, 200);
  if (highscore != null && highscore > 0) {
    if (highscore == score) {
      text ("New record!\nScore: " + score, scoreX, scoreY);
    } else {
      text ("Highcore: " + highscore + "\nScore: " + score, scoreX, scoreY);
    }
  } else {
    text ("Score: " + score, scoreX, scoreY);
  }
  if (!playerAlive) {
    box (187, 224, 127, 53, color(160, 0, 160));
    fill (0, 0, 200);
    text ("GAME OVER\nYour score: " + score + "\nPress R to play again!", 192, 240);
  }
  function box(x, y, boxWidth, boxHeight, color) {
    fill(0);
    rect(x, y, boxWidth, boxHeight);
    fill(color);
    rect(x + 1, y + 1, boxWidth - 2, boxHeight - 2);
  }
  fill(0);
  // Can't use line() because of noStroke().
  rect(0, 0, 1, backgroundSize);
  rect(backgroundSize - 1, 0, 1, backgroundSize);
  rect(0, 0, backgroundSize, 1);
  rect(0, backgroundSize - 1, backgroundSize, 1);
}


function collision() {
  // Player-Box
  for (let i = 0; i < boxAmount; i++) {
    if (overlap(playerX, playerY, playerSize, boxX[i], boxY[i], boxSize[i])) {
      spawnBox(i);
      score++;
      if (score > highscore) {
        highscore = score;
        storeItem('localHighscore', highscore);
      }
    }
  }
  // Player-Enemy
  if (overlap(playerX, playerY, playerSize, enemyX, enemyY, enemySize)) {
    playerAlive = false;
    player = playerDead;
  }
}


function spawnBox(index) {
  boxColor[index] = color(random(255), random(255), random(255));
  boxSize[index] = randomInt(boxSizeMin, boxSizeMax);
  boxX[index] = randomInt(2, backgroundSize - boxSize[index] - 2);
  boxY[index] = randomInt(2, backgroundSize - boxSize[index] - 2);
  if (overlap(boxX[index], boxY[index], boxSize[index], playerX, playerY, playerSize)) {
    spawnBox(index);
  }
  for (let i = 0; i < boxAmount; i++) {
    if (i != index) {
      if (overlap(boxX[index] - 1, boxY[index] - 1, boxSize[index] + 2, boxX[i], boxY[i], boxSize[i])) {
        spawnBox(index);
      }
    }
  }
}


function overlap(x1, y1, size1, x2, y2, size2) {
  if (x1 + size1 >= x2 && x1 <= x2 + size2 &&
    y1 + size1 >= y2 && y1 <= y2 + size2) {
    return true;
  }
  return false;
}


function update() { // http://keycode.info/
  if (playerAlive) {
    let horizontal = 0;
    let vertical = 0;
    if (keyIsDown(87)) { // W 
      vertical -= 1;
    }
    if (keyIsDown(83)) { // S
      vertical += 1;
    }
    if (keyIsDown(65)) { // A
      horizontal -= 1;
      player = playerLeft;
    }
    if (keyIsDown(68)) { // D
      horizontal += 1;
      player = playerRight;
    }
    if (horizontal == 0) {
      if (vertical < 0) {
        player = playerUp;
      } 
      if (vertical > 0) {
        player = playerDown;
      }
    }
    // Keep player on canvas
    if ((playerY < 0 && vertical < 0) || (playerY > backgroundSize - playerSize && vertical > 0)) {
      vertical = 0;
    }
    if ((playerX < 0 && horizontal < 0) || (playerX > backgroundSize - playerSize && horizontal > 0)) {
      horizontal = 0;
    }
    // Move the player
    if (horizontal != 0) {
      playerX += horizontal * playerSpeed;
      if (vertical != 0)
      {
        playerX -= horizontal * diagonalCorrection;
      }
    }
    if (vertical != 0) {
      playerY += vertical * playerSpeed;
      if (horizontal != 0)
      {
        playerY -= vertical * diagonalCorrection;
      }
    }
  }
  // Enemy
  if (enemyX > backgroundSize) {
    enemyX = -enemySize;
    enemyY = nextEnemyY(175);
  }
  if (playerAlive) {
    enemyX += enemySpeed;
  } else {
    if (enemyX > -enemySize) {
      enemyX -= 1;
    }
  }
  // Restart
  if (!playerAlive && keyIsDown(82)) { // R
    playerAlive = true;
    player = playerDown;
    playerX = center;
    playerY = center;
    score = 0;
    enemyX = -backgroundSize;
    for (let i = 0; i < boxAmount; i++) {
      spawnBox(i);
    }
  }
}

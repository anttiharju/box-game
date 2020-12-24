const playerSize = 30;
const playerSpeed = 3;
let playerAlive = true;
let playerX;
let playerY;
// Graphics
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

let score = 0;
let background;
const backgroundSize = 500;
let center;

const enemySize = 30;
const enemySpeed = 4;
let enemyX = backgroundSize;
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
  player = playerDown;
}

function setup() {
  noStroke(); // We want no blurred outlines.
  noSmooth();
  center = round(backgroundSize / 2 - playerSize / 2);
  playerX = center;
  playerY = center;
  createCanvas(500, 500).style('display', 'block').parent('sketch-holder');
  for (let i = 0; i < boxAmount; i++) {
    spawnBox(i);
  }
}

function randomInt(min, max) {
  return round(random(min, max + 1));
}

function spawnBox(index) {
  boxColor[index] = color(random(255), random(255), random(255));
  boxSize[index] = randomInt(boxSizeMin, boxSizeMax);
  boxX[index] = randomInt(0, backgroundSize - boxSize[index]);
  boxY[index] = randomInt(0, backgroundSize - boxSize[index]);
  for (let i = 0; i < boxAmount; i++) {
    if (i != index) {
      if ((boxX[index] + boxSize[index] >= boxX[i]) && (boxX[index] < boxX[i] + boxSize[i]) &&
        (boxY[index] + boxSize[index] >= boxY[i] && boxY[index] < boxY[i] + boxSize[i])) {
        spawnBox(index);
      }
    }
  }
}

function draw() {
  movement();
  collision();

  image(background, 0, 0);
  for (let i = 0; i < boxAmount; i++) {
    box(boxX[i], boxY[i], boxSize[i], boxSize[i], boxColor[i]);
  }
  image(player, playerX, playerY);
  image(enemy, enemyX, enemyY);

  fill (0, 0, 200); 
  text ("Score: " + score, 20, 20);

  if (!playerAlive) {
    box (245, 235, 130, 60, color(160, 0, 160));
    fill (0, 0, 200);
    text ("GAME OVER", 250, 250);
    text ("Your score: " + score, 250, 270);
    text ("Press R to play again!", 250, 290);
  }
  function box(x, y, boxWidth, boxHeight, color) {
    fill(0);
    rect(x - 1, y - 1, boxWidth + 2, boxHeight + 2);
    fill(color);
    rect(x, y, boxWidth, boxHeight);
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
    if ((playerX + playerSize >= boxX[i]) && (playerX < boxX[i] + boxSize[i]) &&
      (playerY + playerSize >= boxY[i] && playerY < boxY[i] + boxSize[i])) {
      spawnBox(i);
      score++;
    }
  }
  // Player-Enemy
  if ((playerX + playerSize >= enemyX) && (playerX < enemyX + enemySize) &&
    (playerY + playerSize >= enemyY && playerY < enemyY + enemySize)) {
    playerAlive = false;
    player = playerDead;
  }
}

// Unholy mess of if's and else's, I know. This is a quick & dirty project and this gets me the behaviour I want.
function movement() { 
  if (playerAlive) {
    let horizontal = 0;
    let vertical = 0;
    if (keyIsDown(87)) { // W http://keycode.info/
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
    if ((playerY < 0 && vertical < 0) || (playerY > backgroundSize - playerSize && vertical > 0)) {
      vertical = 0;
    }
    if ((playerX < 0 && horizontal < 0) || (playerX > backgroundSize - playerSize && horizontal > 0)) {
      horizontal = 0;
    }

    if (horizontal > 0) {
      if (vertical == 0)
      {
        playerX += 3;
      } else {
        playerX += 2;
      }
    }
    if (horizontal < 0) {
      if (vertical == 0)
      {
        playerX -= 3;
      } else {
        playerX -= 2;
      }
    }
    if (vertical > 0) {
      if (horizontal == 0)
      {
        playerY += 3;
      } else {
        playerY += 2;
      }
    }
    if (vertical < 0) {
      if (horizontal == 0)
      {
        playerY -= 3;
      } else {
        playerY -= 2;
      }
    }
  }
  // Enemy
  if (enemyX > backgroundSize) {
    enemyX = -enemySize;
    enemyY = round(random(backgroundSize - enemySize + 1));
  }
  if (playerAlive) {
    enemyX += enemySpeed;
  } else {
    if (enemyX > -enemySize) {
      enemyX -= 1;
    }
  }
  // Restart
  if (!playerAlive && keyIsDown(82)) {
    playerAlive = true;
    player = playerDown;
    playerX = center;
    playerY = center;
    score = 0;
    enemyX = backgroundSize;
    for (let i = 0; i < boxAmount; i++) {
      spawnBox(i);
    }
  }
}

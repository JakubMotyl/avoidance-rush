const playBtn = document.getElementById('playBtn');
const menu = document.querySelector('.menu');
const container = document.querySelector('.container');

// Global Variables
const GRID_WIDTH = 5;
let cells, enemyCells, playerCells;
let startScore = 0;
let score = 0;
let itemFallTime = 1300;
let enemySpawnTime = 2500;
let bonusSpawnTime = 3800;

// Start game button

playBtn.addEventListener('click', () => {
  menu.style.display = 'none';
  startGame();
});

// Enemy Fall Function

const enemyFallFunction = (gameOverCallback) => {
  for (let i = enemyCells.length - 1; i >= 0; i--) {
    const cell = enemyCells[i];
    const nextCell = cells[i + GRID_WIDTH];

    if (cell.querySelector('.enemy')) {
      if (nextCell) {
        if (nextCell.querySelector('.player')) {
          gameOverCallback();
          return;
        }
        if (enemyCells.includes(nextCell)) {
          if (!nextCell.querySelector('.bonus')) {
            nextCell.innerHTML = '<div class="enemy"></div>';
            cell.innerHTML = '';
          }
        } else {
          score += 10;
          document.getElementById('currScore').textContent = score;
          cell.innerHTML = '';
        }
      } else {
        cell.innerHTML = '';
      }
    }
  }
};

// Random Enemy Spawn Function

const randomEnemySpawnFunction = () => {
  const randomEnemySpawn = Math.floor(Math.random() * GRID_WIDTH);
  if (!enemyCells[randomEnemySpawn].querySelector('.enemy')) {
    enemyCells[randomEnemySpawn].innerHTML = '<div class="enemy"></div>';
  }
};

// Bonus Fall Function

const bonusFallFunction = () => {
  for (let i = enemyCells.length - 1; i >= 0; i--) {
    const cell = enemyCells[i];
    const nextCell = cells[i + GRID_WIDTH];

    if (cell.querySelector('.bonus')) {
      if (nextCell) {
        if (nextCell.querySelector('.player')) {
          score += 25;
          document.getElementById('currScore').textContent = score;
        }
        if (enemyCells.includes(nextCell)) {
          if (!nextCell.querySelector('.enemy')) {
            nextCell.innerHTML = '<div class="bonus"></div>';
            cell.innerHTML = '';
          }
        } else {
          cell.innerHTML = '';
        }
      } else {
        cell.innerHTML = '';
      }
    }
  }
};

// Random Bonus Spawn Function

const randomBonusSpawnFunction = () => {
  const randomBonusSpawn = Math.floor(Math.random() * GRID_WIDTH);
  if (!enemyCells[randomBonusSpawn].querySelector('.bonus')) {
    enemyCells[randomBonusSpawn].innerHTML = '<div class="bonus"></div>';
  }
};

// Move player logic

const movePlayer = (player, playerCells, direction) => {
  const currentCell = player.parentElement;
  const nextCell = direction === 'right'
    ? currentCell.nextElementSibling
    : currentCell.previousElementSibling;

  if (playerCells.includes(nextCell)) {
    nextCell.appendChild(player);
    player.classList.toggle('player-rotate', direction === 'left');
  }
};

// Start game function

const startGame = () => {
  // Remove existing container and create new game
  container.remove();
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  wrapper.innerHTML = `
      <div class="app">
        <div class="current-score">
          <p>Score: <span id="currScore">${score}</span></p>
          <button id="goBack" class="goBack-btn">Go Back</button>
        </div>
        <div class="game">
          <div class="grid">
            ${Array(55).fill('<div class="cell"></div>').join('')}
          </div>
        </div>
      </div>
    `;

  document.body.appendChild(wrapper);

  // Initialize game cells
  cells = Array.from(document.querySelectorAll('.cell'));
  enemyCells = cells.slice(0, 50);
  playerCells = cells.slice(50);
  playerCells[2].innerHTML = '<div class="player"></div>';

  // Set intervals for enemy and bonus mechanics

  const enemyFallInterval = setInterval(() => enemyFallFunction(handleGameOver), itemFallTime);
  const enemySpawnInterval = setInterval(randomEnemySpawnFunction, enemySpawnTime);
  const bonusFallInterval = setInterval(bonusFallFunction, itemFallTime);
  const bonusSpawnInterval = setInterval(randomBonusSpawnFunction, bonusSpawnTime);

  // Initialize Score

  const scoreDisplay = document.getElementById('currScore');

  // Go Back Button Functionality

  const goBackBtn = document.getElementById('goBack');

  goBackBtn.addEventListener('click', () => {
    clearAllIntervals();
    resetGame(wrapper, scoreDisplay);
  });

  const handleKeydown = (e) => {
    const player = document.querySelector('.player');
    if (!player) return;
    if (e.key === 'ArrowRight') movePlayer(player, playerCells, 'right');
    if (e.key === 'ArrowLeft') movePlayer(player, playerCells, 'left');
  };

  const clearAllIntervals = () => {
    clearInterval(enemyFallInterval);
    clearInterval(bonusFallInterval);
    clearInterval(enemySpawnInterval);
    clearInterval(bonusSpawnInterval);
    document.removeEventListener('keydown', handleKeydown);
  };

  const resetGame = (wrapper, scoreDisplay) => {
    wrapper.remove();
    document.body.appendChild(container);
    menu.style.display = 'block';
    score = startScore;
    scoreDisplay.textContent = score;
  };

  const handleGameOver = () => {
    alert(`Game Over! Your score: ${score}`);
    clearAllIntervals();
    resetGame(wrapper, scoreDisplay);
  };

  document.addEventListener('keydown', handleKeydown);
};



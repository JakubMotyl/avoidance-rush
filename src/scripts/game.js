const playBtn = document.getElementById('playBtn');
const menu = document.querySelector('.menu');
const container = document.querySelector('.container');

// Zmienne Globalne
const GRID_WIDTH = 5;
const DEFAULT_SCORE = 3;
const BONUS_SCORE = 15;
let cells, enemyCells, playerCells;
let startScore = 0;
let score = 0;
let itemFallTime = 1200;
let enemySpawnTime = 1800;
let bonusSpawnTime = 3500;

// Przycisk startu gry

playBtn.addEventListener('click', () => {
  menu.style.display = 'none';
  startGame();
});

// Funkcja spadania przeciwników

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
          if (!nextCell.querySelector('.bonus') && !nextCell.querySelector('.enemy')) {
            nextCell.innerHTML = '<div class="enemy"></div>';
            cell.innerHTML = '';
          }
        } else {
          score += DEFAULT_SCORE;
          document.getElementById('currScore').textContent = score;
          cell.innerHTML = '';
        }
      } else {
        cell.innerHTML = '';
      }
    }
  }
};

// Funkcja losowego pojawiania się przeciwników

const randomEnemySpawnFunction = () => {
  const randomEnemySpawn = Math.floor(Math.random() * GRID_WIDTH);
  const targetCell = enemyCells[randomEnemySpawn];

  if (!targetCell.querySelector('.enemy') && !targetCell.querySelector('.bonus')) {
    targetCell.innerHTML = '<div class="enemy"></div>';
  }
};

// Funkcja spadania bonusów

const bonusFallFunction = () => {
  for (let i = enemyCells.length - 1; i >= 0; i--) {
    const cell = enemyCells[i];
    const nextCell = cells[i + GRID_WIDTH];

    if (cell.querySelector('.bonus')) {
      if (nextCell) {
        if (nextCell.querySelector('.player')) {
          score += BONUS_SCORE;
          document.getElementById('currScore').textContent = score;
        } else if (!nextCell.querySelector('.enemy') && !nextCell.querySelector('.bonus')){
          nextCell.innerHTML = '<div class="bonus"></div>';
          cell.innerHTML = '';
        }
      } else {
        cell.innerHTML = '';
        }
    }
  }
};

// Funkcja losowego pojawiania się bonusu

const randomBonusSpawnFunction = () => {
  const randomBonusSpawn = Math.floor(Math.random() * GRID_WIDTH);
  const targetCell = enemyCells[randomBonusSpawn];

  if (!targetCell.querySelector('.bonus') && !targetCell.querySelector('.enemy')) {
    targetCell.innerHTML = '<div class="bonus"></div>';
  }
};

// Logika ruchu gracza

const movePlayer = (player, playerCells, direction) => {
  const currentCell = player.parentElement; // zwraca komorke playera
  const nextCell = direction === 'right'
    ? currentCell.nextElementSibling
    : currentCell.previousElementSibling;

  if (playerCells.includes(nextCell)) {
    nextCell.appendChild(player);
    player.classList.toggle('player-rotate', direction === 'left'); // sprawdza drugi warunek toggle
  }
};

// Funkcja startu gry

const startGame = () => {
  // Usunięcie istniejącego container i stworzenie nowej gry
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

  // Stworzenie komórek gry
  cells = Array.from(document.querySelectorAll('.cell'));
  enemyCells = cells.slice(0, 50);
  playerCells = cells.slice(50);
  playerCells[2].innerHTML = '<div class="player"></div>';

  // Ustawienie interwałów dla mechaniki przeciwników i bonusów

  const enemyFallInterval = setInterval(() => enemyFallFunction(handleGameOver), itemFallTime);
  const enemySpawnInterval = setInterval(randomEnemySpawnFunction, enemySpawnTime);
  const bonusFallInterval = setInterval(bonusFallFunction, itemFallTime);
  const bonusSpawnInterval = setInterval(randomBonusSpawnFunction, bonusSpawnTime);

  const scoreDisplay = document.getElementById('currScore');

  // Funkcjonalność przycisku powrotu

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

  // Wyczyszczenie interwałów

  const clearAllIntervals = () => {
    clearInterval(enemyFallInterval);
    clearInterval(bonusFallInterval);
    clearInterval(enemySpawnInterval);
    clearInterval(bonusSpawnInterval);
    document.removeEventListener('keydown', handleKeydown);
  };

  // Reset gry

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



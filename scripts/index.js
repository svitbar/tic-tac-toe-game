'use strict';

const cells = document.querySelectorAll('.plate-item');
const btnStart = document.querySelector('.btn');

let origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';

const x = '/styles/icons/cross-rect.svg';
const o = '/styles/icons/circle-rect.svg';
const empty = '/styles/icons/empty-rect.svg';

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

btnStart.addEventListener('click', () => startGame());

function startGame() {
  document.querySelector('.result').style.display = 'none';
  origBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].style.backgroundImage = `url(${empty})`;
    cells[i].addEventListener('click', turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] === 'number') {
    turn(square.target.id, huPlayer);
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  if (player === huPlayer) {
    document.getElementById(squareId).style.backgroundImage = `url(${o})`;
  } else document.getElementById(squareId).style.backgroundImage = `url(${x})`;
  const gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  const plays = board.reduce((a, e, i) =>
    ((e === player) ? a.concat(i) : a), []);
  let gameWon = null;
  for (const [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (const index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
			gameWon.player === huPlayer ? 'blue' : 'red';
  }
  declareWinner(gameWon.player === huPlayer ? 'You win!' : 'You lose.');
}

function declareWinner(who) {
  document.querySelector('.result').style.display = 'block';
  document.querySelector('.result .text').innerText = who;
}

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;
}

// function easySpot() {
//   return emptySquares()[0];
// }

function emptySquares() {
  return origBoard.filter(s => typeof s === 'number');
}

function checkTie() {
  if (emptySquares().length === 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'green';
      cells[i].style.backgroundImage = `url(${empty})`;
    }
    declareWinner('Tie Game!');
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  const availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === aiPlayer) {
      const result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

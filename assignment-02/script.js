let currentPlayer = 'x';
let winner = null;
let fullSquares = 0;
let gameBoardState;
let $gameStateContainer;
let $currentPlayerContainer;

const logCurrentBoardState = () => {
  const logValues = [];
  gameBoardState.forEach(row => {
    const rowValues = [];
    row.forEach($space => {
      rowValues.push(getSpaceValue($space));
    });
    logValues.push(` ${rowValues.join(' | ')} `);
  })
  console.log("Current Board State:");
  console.log(logValues.join('\n-----------\n'));
}

const updateCurrentPlayer = () => {
  currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
  updateCurrentPlayerMsg();
}

const isStalemate = () => fullSquares === 9;
const isGameOver = () => isStalemate() || !!winner;
const getSpaceValue = ($space) => $space.dataset.value;
const resetSpaceValue = ($space) => {
  $space.dataset.value = ' ';
  $space.firstElementChild.innerHTML = '';
}

/**
 * win states
 *
 * [0,0], [0,1], [0,2]
 * [1,0], [1,1], [1,2]
 * [2,0], [2,1], [2,2]
 * 
 * [0,0], [1,0], [2,0]
 * [0,1], [1,1], [2,1]
 * [0,2], [1,2], [2,2]
 * 
 * [0,0], [1,1], [2,2]
 * [2,0], [1,1], [0,2]
 * */

const checkForWin = () => {
  let winState = false;
  // check for row wins
  for(let row = 0; row < 3; row++) {
    let rowPoints = 0;
    for(let col = 0; col < 3; col++) {
      const spaceValue = getSpaceValue(gameBoardState[row][col]);
      if (spaceValue !== currentPlayer) {
        // row is not a winner
        rowWins = false;
        break;
      }
      rowPoints++;
    }
    if (rowPoints === 3) {
      winState = true;
      break;
    }
  }

  if (winState === true) {
    showNewGameState(`Congratulations player ${currentPlayer}, you've won the game!`, 'success');
    winner = currentPlayer;
  } else if (fullSquares === 9) {
    showNewGameState('Stalemate!')
  }
  return winState;
}

const showNewGameError = (msg) => {
  showNewGameState(msg, 'error');
}

const clearBoard = () => {
  if (!confirm('The game is over, do you want to clear the board?')) {
    return;
  }
  winner = null;
  currentPlayer = 'x';
  fullSquares = 0;
  showNewGameState();
  for(let row = 0; row < 3; row++) {
    for(let col = 0; col < 3; col++) {
      resetSpaceValue(gameBoardState[row][col]);
    }
  };
}

const showNewGameState = (msg = '', className = '') => {
  $gameStateContainer.className = className;
  $gameStateContainer.innerHTML = msg;
}
const updateCurrentPlayerMsg = () =>
  $currentPlayerContainer.innerHTML = `${currentPlayer}, it's your turn!`

const onSpaceClick = ($space) => {
  if (isGameOver()) {
    console.log('game is over');
    clearBoard();
    return;
  }
  console.log('click');
  const currentValue = getSpaceValue($space);
  if (currentValue !== ' ') {
    const msg = 'Sorry this space is already taken, try another';
    
    console.log(msg);
    showNewGameError(msg);
    return;
  }
  $space.dataset.value = currentPlayer;
  $space.firstElementChild.innerHTML = currentPlayer;

  logCurrentBoardState();
  showNewGameState();
  
  const isWin = checkForWin();
  fullSquares++;
  
  if (isWin || isStalemate()) {
    setTimeout(clearBoard, 0);
    return;
  }

  updateCurrentPlayer();
};

const createSpace = () => {
  const $space = document.createElement('div');
  $space.className = 'game-space';
  $space.dataset.value = ' ';

  const $spaceButton = document.createElement('button');
  $spaceButton.setAttribute('type', 'button');
  $spaceButton.addEventListener('click', () => onSpaceClick($space));
  $space.appendChild($spaceButton);
  return $space;
}

const buildArray = (builderFn, length = 3) => {
  const array = [];
  for(let i = 0; i < length; i++) {
    array.push(builderFn());
  }
  return array;
}

const buildBoardRow = ($container) => {
  const spaceArray = buildArray(createSpace);
  const $row = document.createElement('div');
  $row.className = 'game-row';  
  $container.appendChild($row);
  
  spaceArray.forEach($space => {
    $row.appendChild($space)
  });
  return spaceArray;
};

const buildInitialGameBoard = (gameBoardId) => {
  const $gameBoardContainer = document.getElementById(gameBoardId);
  const rows = buildArray(() => buildBoardRow($gameBoardContainer));
  return rows;
}

document.body.onload = () => {
  $gameStateContainer = document.getElementById('game-state');
  $currentPlayerContainer = document.getElementById('current-player');
  gameBoardState = buildInitialGameBoard('game-board');
};

let currentPlayer = 'x';
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

const getSpaceValue = ($space) => $space.dataset.value;

const checkForWin = () => {
  const winState = false;
  return winState;
}

const showNewGameError = (msg) => {
  showNewGameState(msg, 'error');
}

const showNewGameState = (msg = '', className = '') => {
  $gameStateContainer.className = className;
  $gameStateContainer.innerHTML = msg;
}
const updateCurrentPlayerMsg = () =>
  $currentPlayerContainer.innerHTML = `${currentPlayer}, it's your turn!`

const onSpaceClick = ($space) => {
  const currentValue = getSpaceValue($space);
  if (currentValue !== ' ') {
    const msg = 'Sorry this space is already taken, try another';
    
    console.log(msg);
    showNewGameError(msg);
    return;
  }
  $space.dataset.value = currentPlayer;

  showNewGameState();
  updateCurrentPlayer();
  logCurrentBoardState();
  checkForWin();
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

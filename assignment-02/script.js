let currentPlayer = 'x';
let gameBoardState;

const printCurrentBoardState = () => {
  const logValues = [];
  gameBoardState.forEach(row => {
    const rowValues = [];
    row.forEach($space => {
      rowValues.push(getSpaceValue($space));
    });
    logValues.push(` ${rowValues.join(' | ')} `);
  })
  console.log("Current Board State");
  console.log(logValues.join('\n-----------\n'));
}

const updateCurrentPlayer = () => {
  if (currentPlayer === 'x') {
    currentPlayer = 'o';
    return;
  }
  currentPlayer = 'x';
}

const getSpaceValue = ($space) => $space.dataset.value;

const checkForWin = () => {
  const winState = false;
  return winState;
} 


const onSpaceClick = ($space) => {
  const currentValue = getSpaceValue($space);
  if (currentValue !== ' ') {
    console.log('Sorry this space is already taken, try another');
    alert('Sorry this space is already taken, try another');
    return;
  }
  
  $space.dataset.value = currentPlayer;
  updateCurrentPlayer();
  printCurrentBoardState();
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
  gameBoardState = buildInitialGameBoard('game-board');
};

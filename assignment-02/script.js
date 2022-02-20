let currentPlayer = "x";
let winOptions = [];
let winner = null;
let fullSquares = 0;
let gameBoardState;
let $gameStateContainer;
let $currentPlayerContainer;

const logCurrentBoardState = () => {
  const logValues = [];
  gameBoardState.forEach((row) => {
    const rowValues = [];
    row.forEach(($space) => {
      rowValues.push(getSpaceValue($space));
    });
    logValues.push(` ${rowValues.join(" | ")} `);
  });
  console.log("Current Board State:");
  console.log(logValues.join("\n-----------\n"));
};

const updateCurrentPlayer = () => {
  currentPlayer = currentPlayer === "x" ? "o" : "x";
  updateCurrentPlayerMsg();
};

const isStalemate = () => fullSquares === 9;
const isGameOver = () => isStalemate() || !!winner;
const getSpaceValue = ($space) => $space.dataset.value;
const resetSpaceValue = ($space) => {
  $space.dataset.value = " ";
  $space.firstElementChild.innerHTML = "";
};

const showNewGameState = (msg = "", className = "") => {
  $gameStateContainer.className = className;
  $gameStateContainer.innerHTML = msg;
};

const showNewGameError = (msg) => {
  showNewGameState(msg, "error");
};

const updateCurrentPlayerMsg = () => ($currentPlayerContainer.innerHTML = `${currentPlayer}, it's your turn!`);

const buildWinOptions = () => {
  let wins = [];
  const diagWin = [];
  for (let x = 0; x < 3; x++) {
    const rowWin = [];
    const colWin = [];
    for (let y = 0; y < 3; y++) {
      rowWin.push([x, y]);
      colWin.push([y, x]);
    }
    diagWin.push([x, x]);
    wins.push(rowWin);
    wins.push(colWin);
  }

  return [
    ...wins,
    diagWin,
    [
      [2, 0],
      [1, 1],
      [0, 2],
    ],
  ];
};

const isWin = () => {
  let isWin = false;
  winOptions.forEach((winSet) => {
    let points = 0;
    winSet.forEach((spaceCoordinates) => {
      const x = spaceCoordinates[0];
      const y = spaceCoordinates[1];
      const $space = gameBoardState[x][y];
      const spaceValue = getSpaceValue($space);

      if (spaceValue !== currentPlayer) {
        return;
        // not a winner
      }
      points++;
    });

    if (points === 3) {
      isWin = true;
      return;
    }
  });

  return isWin;
};

const checkForWin = () => {
  const winState = isWin();

  if (winState === true) {
    showNewGameState(`Congratulations player ${currentPlayer}, you've won the game!`, "success");
    winner = currentPlayer;
  } else if (fullSquares === 9) {
    showNewGameState("Stalemate!");
  }
  return winState;
};

const resetGame = () => {
  winner = null;
  currentPlayer = "x";
  fullSquares = 0;
  showNewGameState();
  updateCurrentPlayerMsg();
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      resetSpaceValue(gameBoardState[row][col]);
    }
  }
};

const onSpaceClick = ($space) => {
  if (isGameOver()) {
    console.log("game is over");
    if (confirm("The game is already over, do you want to start over?")) {
      resetGame();
    }
    return;
  }
  const currentValue = getSpaceValue($space);
  if (currentValue !== " ") {
    const msg = "Sorry this space is already taken, try another";

    console.log(msg);
    showNewGameError(msg);
    return;
  }
  $space.dataset.value = currentPlayer;
  $space.firstElementChild.innerHTML = currentPlayer;

  logCurrentBoardState();
  showNewGameState();

  fullSquares++;
  const isWin = checkForWin();

  if (isWin || isStalemate()) {
    return;
  }

  updateCurrentPlayer();
};

const createSpace = () => {
  const $space = document.createElement("div");
  $space.className = "game-space";
  $space.dataset.value = " ";

  const $spaceButton = document.createElement("button");
  $spaceButton.setAttribute("type", "button");
  $spaceButton.addEventListener("click", () => onSpaceClick($space));
  $space.appendChild($spaceButton);
  return $space;
};

const buildArray = (builderFn, length = 3) => {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(builderFn());
  }
  return array;
};

const buildBoardRow = ($container) => {
  const spaceArray = buildArray(createSpace);
  const $row = document.createElement("div");
  $row.className = "game-row";
  $container.appendChild($row);

  spaceArray.forEach(($space) => {
    $row.appendChild($space);
  });
  return spaceArray;
};

const buildInitialGameBoard = (gameBoardId) => {
  const $gameBoardContainer = document.getElementById(gameBoardId);
  const rows = buildArray(() => buildBoardRow($gameBoardContainer));
  return rows;
};

const initClearButton = () => {
  document.getElementById("clear-board").addEventListener("click", resetGame);
};

document.body.onload = () => {
  $gameStateContainer = document.getElementById("game-state");
  $currentPlayerContainer = document.getElementById("current-player");
  initClearButton("clear-board");
  winOptions = buildWinOptions();
  gameBoardState = buildInitialGameBoard("game-board");
};

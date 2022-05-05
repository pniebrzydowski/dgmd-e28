import { useState } from 'react';

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const GameBoard = ({range: { min, max }, guessesAllowed, onGameEnd}) => {
  const [gameIsActive, setGameIsActive] = useState(false);
  const [lastGuess, setLastGuess] = useState(null);
  const [guessValue, setGuessValue] = useState('');
  const [correctNumber, setCorrectNumber] = useState(null);
  const [numberOfGuesses, setNumberOfGuesses] = useState(0);

  const endGame = (isWin, endGuesses) => {
    setGameIsActive(false);
    onGameEnd({isWin, numberOfGuesses: endGuesses});
  }
  const startNewGame = () => {
    setNumberOfGuesses(0);
    setGuessValue('');
    setCorrectNumber(getRandomNumber(min, max));
    setGameIsActive(true);
  }
  const checkGuess = () => correctNumber === Number(guessValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGuessTotal = numberOfGuesses + 1;
    setNumberOfGuesses(newGuessTotal);
    setLastGuess(guessValue);
    setGuessValue('');

    if (checkGuess()) {
      endGame(true, newGuessTotal);
      return;
    }

    if (newGuessTotal === guessesAllowed) {
      endGame(false, newGuessTotal);
    }
  }

  const gameOver = lastGuess && !gameIsActive;

  return (
    <>
      <button type="button" onClick={startNewGame} disabled={gameIsActive}>Start New Game</button>

      {gameIsActive && (
        <>
          <p>Guess a number between {min} and {max}:</p>
          <form onSubmit={handleSubmit}>
            <input
              disabled={!gameIsActive}
              type="number"
              name="guess"
              value={guessValue === 0 ? '' : guessValue}
              onChange={e => setGuessValue(e.target.value)}
              min={min}
              max={max}
              />
            <button type="submit" disabled={!gameIsActive}>Guess</button>
          </form>
          <p>Remaining Guesses: {guessesAllowed - numberOfGuesses}</p>
          {lastGuess && !gameOver && (
            <p>The correct number is {correctNumber - lastGuess > 0 ? 'higher' : 'lower'} than your guess of {lastGuess}. Try again!</p>
          )}
        </>
      )}

      {gameOver && 
        (Number(lastGuess) === correctNumber ? (
          <p>Congratulations, you've guessed the correct number ({lastGuess}) in only {numberOfGuesses} guesses!</p>
        ) : (
          <p>Sorry, you have no guesses remaining, click "Start New Game" to try again!</p>
        )
      )}

      {gameIsActive && (
        <p>
          Number of Guesses: {numberOfGuesses}
        </p>
      )}
    </>
  );
};

export default GameBoard;

/* eslint-disable */
import { useState } from 'react';

import GameBoard from './GameBoard.jsx';
import GameSettings from './GameSettings.jsx';
import PlayerStats from './PlayerStats.jsx';

const GameWrapper = () => {
  const [range, setRange] = useState({
    min: 0,
    max: 100
  });
  const [guessesAllowed, setGuessesAllowed] = useState(10);
  const [playerStats, setPlayerStats] = useState({
     correctGuesses: 0,
     gamesPlayed: 0,
     totalGuesses: 0
  });

  const onGameEnd = ({ isWin, numberOfGuesses }) => {
    console.log(isWin, numberOfGuesses)
    const {correctGuesses, gamesPlayed, totalGuesses} = playerStats;
    setPlayerStats({
      correctGuesses: isWin ? correctGuesses + 1 : correctGuesses,
      gamesPlayed: gamesPlayed + 1,
      totalGuesses: totalGuesses + numberOfGuesses
    })
  }

  return (
    <>
      <PlayerStats playerStats={playerStats} />
      <GameSettings
        range={range} setRange={setRange}
        guessesAllowed={guessesAllowed} setGuessesAllowed={setGuessesAllowed}
      />
      <GameBoard range={range} guessesAllowed={guessesAllowed} onGameEnd={onGameEnd} />
    </>
  );
};

export default GameWrapper;

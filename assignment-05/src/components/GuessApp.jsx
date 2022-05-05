import { useState } from 'react';

import {Link, Route, BrowserRouter, Routes} from 'react-router-dom';

import GameBoard from './GameBoard.jsx';
import GameSettings from './GameSettings.jsx';
import PlayerStats from './PlayerStats.jsx';

const GuessApp = () => {
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
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">Game Board</Link></li>
          <li><Link to="/stats">Player Stats</Link></li>
          <li><Link to="/settings">Game Settings</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path='/' element={
          <GameBoard range={range} guessesAllowed={guessesAllowed} onGameEnd={onGameEnd} />
        }/>
 
        <Route path="/stats" element={
          <PlayerStats playerStats={playerStats} />
        }/>
        <Route path="/settings" element={
          <GameSettings
              range={range} setRange={setRange}
              guessesAllowed={guessesAllowed} setGuessesAllowed={setGuessesAllowed}
              />
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default GuessApp;

import { useRef, useState } from 'react';

import {Link, Route, BrowserRouter, Routes} from 'react-router-dom';

import GameBoard from './GameBoard';
import GameSettings from './GameSettings';
import ScoreHistory from './ScoreHistory';

const HarryPotterUNO = () => {
  const games = useRef(JSON.parse(localStorage.getItem('UNO-scores')) || []);
  const [players] = useState([
    {
      id: 'harry-potter',
      name: 'Harry Potter',
      house: 'Gryffindor'
    },
    {
      id: 'draco-malfoy',
      name: 'Draco Malfoy',
      house: 'Slytherin'
    }
  ]);
  
  const onGameEnd = (game) => {
    const updatedGames = [
      ...games.current,
      game
    ];
    games.current = updatedGames;
    localStorage.setItem('UNO-scores', JSON.stringify(updatedGames));
  }

  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">Game Board</Link></li>
          <li><Link to="/score">Scoresheet</Link></li>
          <li><Link to="/settings">Game Settings</Link></li>
        </ul>
      </nav>

      <div className="route-container">
        <Routes>
          <Route path='/' element={
            <GameBoard players={players} onGameEnd={onGameEnd} />
          }/>
   
          <Route path="/score" element={
            <ScoreHistory players={players} games={games.current} />
          }/>
          <Route path="/settings" element={
            <GameSettings players={players} />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default HarryPotterUNO;

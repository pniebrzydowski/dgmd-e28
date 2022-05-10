import { useState } from 'react';

import {Link, Route, BrowserRouter, Routes} from 'react-router-dom';

import GameBoard from './GameBoard';
import GameSettings from './GameSettings';
import ScoreHistory from './ScoreHistory';

const HarryPotterUNO = () => {
  const [games] = useState([]);
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
    games.push(game);
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
            <ScoreHistory players={players} games={games} />
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

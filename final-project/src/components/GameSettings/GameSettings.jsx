import { useEffect, useState } from 'react';
import './styles.css';

const HOUSES = [
  'Gryffindor',
  'Hufflepuff',
  'Ravenclaw',
  'Slytherin'
];

const uniqBy = (arr, predicate) => {
  const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];
  
  return [...arr.reduce((map, item) => {
    const key = (item === null || item === undefined) ? 
      item : cb(item);
    
    map.has(key) || map.set(key, item);
    
    return map;
  }, new Map()).values()];
};

const GameSettings = ({
  players,
  setPlayers
}) => {
  const [characters, setCharacters] = useState([]);
  const [houseFilter, setHouseFilter] = useState("");

  useEffect(() => {
    const getCharacters = async () => {
      const response = await fetch('https://hp-api.herokuapp.com/api/characters', {
        method: "GET",
      }).then((res) => res.json());
      const filteredCharacters = response.filter(character => !!character.house).sort((a, b)=> {
        return a.name > b.name ? 1 : -1;
      });
      const uniqueCharacters = uniqBy(filteredCharacters, 'name');
      setCharacters(uniqueCharacters);
    }

    getCharacters();
  }, []);

  const remainingCharacters = characters.filter(option => players.findIndex(p => p.name === option.name) === -1);

  const selectPlayer = (player) => {
    const newPlayers = [
      ...players,
      player
    ];
    localStorage.setItem('UNO-players', JSON.stringify(newPlayers));
    setPlayers(newPlayers);
  } 

  const resetPlayers = () => {
    if (window.confirm('Are you sure you want to clear the players? This will also clear the scoresheet and reset any ongoing game!')) {
      setPlayers([]);
      localStorage.removeItem('UNO-players');
      localStorage.removeItem('UNO-scores');
    }
  }

  const characterSelectList = !houseFilter
    ? remainingCharacters
    : remainingCharacters.filter(character => character.house === houseFilter);
  
  return (
    <section className='players'>
      {players.length > 0 && (
        <section className="gamePlayers">
          <h2>Current players:</h2>
          <ul>
            {players.map((player, idx) => (
              <li key={player.name}>
                {player.name}{idx === 0 ? ' (You)' : ''}<br />
                <span class="character-house">{player.house}</span>
              </li>
            ))}
          </ul>
          <button type="button" className="button-clearPlayers" onClick={resetPlayers}>Clear All Players</button>
        </section>
      )}

      <section className="addNewPlayer">
        <h2>
          {players.length === 0 ? 'Select your character:' : 'Who will you play against?'}
        </h2>
        <p>Filter by House: 
          <select onChange={(e) => setHouseFilter(e.target.value)} value={houseFilter}>
            <option value="">Show All</option>
            {HOUSES.map(house => (
              <option key={house}>{house}</option>
            ))}
          </select>
        </p>
        {characterSelectList.length > 0 ? (
          <ul class="characterSelect">
            {characterSelectList.map(character => (
              <li key={character.name}>
                <button onClick={() => selectPlayer(character)}>
                  <div>
                    {character.name}<br />
                    <span class="character-house">{character.house}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>All available players are already taking part in the game.</p>
        )}
      </section>
    </section>
  );
};

export default GameSettings;

import { useEffect, useState } from 'react';
import './styles.css';

const GameSettings = ({
  players,
  setPlayers
}) => {
  const [characters, setCharacters] = useState([]);
  useEffect(() => {
    const getCharacters = async () => {
      const response = await fetch('http://hp-api.herokuapp.com/api/characters', {
        method: "GET",
      }).then((res) => res.json());
      setCharacters(response.filter(character => !!character.house).sort((a, b)=> {
        return a.name > b.name ? 1 : -1;
      }));
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
  
  return (
    <section className='players'>
      <section className="gamePlayers">
        <h2>Current players:</h2>
        <ul>
          {players.map((player, idx) => (
            <li key={player.name}>{player.name} - {player.house}{idx === 0 ? ' (You)' : ''}</li>
          ))}
        </ul>
      </section>

      <section className="addNewPlayer">
        <h2>
          {players.length === 0 ? 'Select your character:' : 'Who will you play against?'}
        </h2>
        {remainingCharacters.length > 0 ? (
          <ul>
            {remainingCharacters.map(player => (
                <li key={player.name}>
                  <button onClick={() => selectPlayer(player)}>Add</button>
                  {player.name} - {player.house}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>All available players are already taking part in the game.</p>
        )}
      </section>
    </section>
  );
};

export default GameSettings;

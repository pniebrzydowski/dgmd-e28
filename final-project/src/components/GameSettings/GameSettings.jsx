import './styles.css';

const GameSettings = ({
  players,
  setPlayers
}) => {
  const playerOptions = [
    {
      id: 'harry-potter',
      name: 'Harry Potter',
      house: 'Gryffindor'
    },
    {
      id: 'ron-weasley',
      name: 'Ron Weasley',
      house: 'Gryffindor'
    },
    {
      id: 'draco-malfoy',
      name: 'Draco Malfoy',
      house: 'Slytherin'
    }
  ];

  const remainingPlayers = playerOptions.filter(option => players.findIndex(p => p.id === option.id) === -1);

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
          {players.map(player => (
            <li key={player.id}>{player.name} - {player.house}</li>
          ))}
        </ul>
      </section>

      <section className="addNewPlayer">
        <h2>Add a new player:</h2>
        {remainingPlayers.length > 0 ? (
          <ul>
            {remainingPlayers.map(player => (
                <li key={player.id}>
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

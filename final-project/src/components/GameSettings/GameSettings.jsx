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

  const selectPlayer = (player) => {
    setPlayers([
      ...players,
      player
    ])
  } 
  
  return (
    <>
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
        <ul>
          {playerOptions.map(player => {
            if (players.findIndex(p => p.id === player.id) !== -1) {
              return null;
            }
            return (
              <li key={player.id}>
                <button onClick={() => selectPlayer(player)}>Select</button>
                {player.name} - {player.house}
              </li>
            );
            })}
        </ul>
      </section>
    </>
  );
};

export default GameSettings;

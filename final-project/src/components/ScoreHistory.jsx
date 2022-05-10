const ScoreHistory = ({
  players = [],
  games = []
}) => {
  return (
    <section>
      <table>
        <thead>
          <tr>
            <th>Game Start</th>
            <th>Game End</th>
            {players.map(player => (
              <th key={player.id}>
                {player.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {games.map(game => (
            <tr key={game.start}>
              <td>{game.start}</td>
              <td>{game.end}</td>
              {game.scores.map((score, idx) => (
                <td key={`${game.start}-${idx}`}>
                  {score}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default ScoreHistory;

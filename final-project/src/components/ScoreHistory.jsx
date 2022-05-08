const ScoreHistory = ({
  players = [],
  games = []
}) => {
  return (
    <section>
      <table>
        <th>
          <tr>
            <th>Game Start</th>
            <th>Game End</th>
            {players.map(player => (
              <th>
                {player.name}
              </th>
            ))}
          </tr>
        </th>
        <tbody>
          {games.map(game => (
            <tr>
              <td>{game.start}</td>
              <td>{game.end}</td>
              {game.scores.map(score => (
                <td>
                  {score.score}
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

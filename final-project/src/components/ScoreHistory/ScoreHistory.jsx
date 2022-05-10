import './styles.css';

const formatDate = (dateValue) => {
  const dateObj = new Date(dateValue)
  return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString().substring(0, 5)}`;
}

const ScoreHistory = ({
  players = [],
  games = []
}) => {
  const totals = [];
  games.forEach(game => {
    game.scores.forEach((score, idx) => {
      console.log(totals[idx], score);
      if (!totals[idx]) {
        totals[idx] = 0;
      }
      totals[idx] += score;
    })
  });

  return (
    <section className="scoreHistory">
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
          <tr className="totalScore">
            <td colSpan={2}>Total Score</td>
            {totals.map((total, idx) => (<td key={`total-${idx}`}>{total}</td>))}
          </tr>
          {games.map(game => (
            <tr key={game.start}>
              <td>{formatDate(game.start)}</td>
              <td>{formatDate(game.end)}</td>
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

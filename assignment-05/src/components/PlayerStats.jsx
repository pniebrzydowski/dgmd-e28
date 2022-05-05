const PlayerStats = ({playerStats: {
  gamesPlayed,
  correctGuesses,
  totalGuesses
}}) => {
  console.log(totalGuesses);
  return (
    <section>
      <table>
        <tbody>
          <tr>
            <td>Total Games Played:</td>
            <td>{gamesPlayed}</td>
          </tr>
          <tr>
            <td>Correct Guesses:</td>
            <td>{correctGuesses}</td>
          </tr>
          <tr>
            <td>Average Guesses per Game:</td>
            <td>{!gamesPlayed ? 'No games played yet' : (totalGuesses / gamesPlayed).toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

export default PlayerStats;

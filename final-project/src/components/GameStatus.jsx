const GameStatus = ({ currentPlayer, gameStatus }) => (
  <>
    {currentPlayer && <p>{currentPlayer.name}'s turn</p>}
    {gameStatus && <p>{gameStatus}</p>}
  </>
);

export default GameStatus;
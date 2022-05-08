import { useEffect, useState } from 'react';

import useUnoDeck from '../hooks/useUnoDeck'

const getHandScore = (hand) => hand.cards.reduce((prev, curr) => prev + curr, 0);


const GameBoard = ({players, onGameEnd}) => {
  const [gameIsActive, setGameIsActive] = useState(false);
  const [gameStart, setGameStart] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [hands, setHands] = useState([]);
  const deck = useUnoDeck();

  useEffect(() => {
    const h = players.map(p => ({
      player: p,
      cards: null
    }));
    setHands(h);
  }, [players]);

  if (!players.length) {
    return null;
  }

  const endGame = () => {
    setGameIsActive(false);
    onGameEnd({
      start: gameStart,
      end: new Date().valueOf(),
      scores: hands
    });
  }
  const startNewGame = () => {
    const h = [...hands];
    h.forEach(hand => {
      hand.cards = deck.dealNewCards(7)
    });
    setHands(h);
    setGameStart(new Date().valueOf());
    setCurrentPlayer(hands[0].player.name);
    setGameIsActive(true);
  }
  
  const gameOver = hands.some(hand => hand.cards !== null && hand.cards.length === 0);

  return (
    <>
      <button type="button" onClick={startNewGame} disabled={gameIsActive}>Start New Game</button>

      {gameIsActive && (
        <>
          {hands.map(hand => {
            console.log(hand.cards);
            return (
            <ul key={`player-${hand.player.id}-hand`}>
              <p>{hand.player.name}</p>
              {hand.cards && (
                <ul>
                  {hand.cards.map((card, idx) => (
                    <li key={idx}>{card.value}-{card.color}</li>
                  ))}
                </ul>
              )}
            </ul>
          )})}
        </>
      )}

      {currentPlayer && <p>{currentPlayer}'s turn</p>}

      {gameOver && (
        <p>Final Scores:
          {hands.reduce((prev, curr) => (
            prev.push(`${curr.player.name}: ${getHandScore(curr)}`)
          ), []).join(', ')}
        </p>
      )}
    </>
  );
};

export default GameBoard;

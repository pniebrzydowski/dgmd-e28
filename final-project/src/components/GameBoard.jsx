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
    deck.flipCard();
    setHands(h);
    setGameStart(new Date().valueOf());
    setCurrentPlayer(0);
    setGameIsActive(true);
  }

  const playCard = (hand, card) => {
    const isValid = deck.playCard(card);
    if (!isValid) {
      alert('Sorry, that card cannot be played at this time');
      return;
    }
    const idx = hand.cards.findIndex(handCard => handCard.value === card.value && handCard.color === card.color);
    hand.cards.splice(idx, 1);
    deck.playCard(card);
    if (currentPlayer === players.length - 1) {
      setCurrentPlayer(0);
      return;
    }
    setCurrentPlayer(currentPlayer + 1);
  }
  
  const gameOver = hands.some(hand => hand.cards !== null && hand.cards.length === 0);

  return (
    <>
      <button type="button" onClick={startNewGame} disabled={gameIsActive}>Start New Game</button>

      {gameIsActive && (
        <>
          {hands.map(hand => {
            return (
            <ul key={`player-${hand.player.id}-hand`}>
              <p>{hand.player.name}</p>
              {hand.cards && (
                <ul>
                  {hand.cards.map((card, idx) => (
                    <li key={idx}>
                      {card.display()}
                      {hands[currentPlayer].player.name === hand.player.name && (
                        <button type="button" onClick={() => playCard(hand, card)}>Play!</button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </ul>
          )})}
        </>
      )}

      {deck.currentCard && (
      <p>
        Current Card: {deck.currentCard.display()}
      </p>
      )}

      {currentPlayer !== null && <p>{hands[currentPlayer].player.name}'s turn</p>}

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

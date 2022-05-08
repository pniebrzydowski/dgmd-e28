import { useEffect, useState } from 'react';

import useUnoDeck from '../../hooks/useUnoDeck'
import Deck from '../Deck';
import GameStatus from '../GameStatus';
import PlayerHand from '../PlayerHand';

import './styles.css';

const getHandScore = (hand) => hand.cards.reduce((prev, curr) => prev + curr, 0);

const GameBoard = ({players, onGameEnd}) => {
  const [playDirection, setPlayDirection] = useState(null);
  const [gameStart, setGameStart] = useState(null);
  const [currentPlayerIndex, setcurrentPlayerIndex] = useState(null);
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
    setPlayDirection(null);
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
    setcurrentPlayerIndex(0);
    setPlayDirection('forward');
  }

  const advanceTurn = (activePlayer, playDirection) => {
    if (playDirection === 'forward') {
      if (activePlayer === players.length - 1) {
        return 0;
      }
      return activePlayer + 1; 
    }

    if (activePlayer === 0) {
      return players.length - 1;
    }
    return activePlayer - 1;
  }

  const evaluateCard = (cardValue) => {
    if (cardValue === 'Draw Four' || cardValue === 'Wild') {
      console.log('wild!')
    }
    if (cardValue === 'R') {
      setPlayDirection('reverse');
    }

    let actOnPlayer = advanceTurn(currentPlayerIndex);

    if (cardValue === 'S') {
      actOnPlayer = advanceTurn(actOnPlayer);
    }
    if (cardValue === 'D') {
      console.log(hands[actOnPlayer].player.name, ' draws 2');
    }
    if (cardValue === 'Draw Four') {
      console.log(hands[actOnPlayer].player.name, ' draws 4');
    }
    setcurrentPlayerIndex(actOnPlayer);
  }

  const playCard = (hand, card) => {
    const isValid = deck.playCard(card);
    if (!isValid) {
      alert('Sorry, that card cannot be played at this time');
      return;
    }
    const idx = hand.cards.findIndex(handCard => handCard.value === card.value && handCard.color === card.color);
    hand.cards.splice(idx, 1);

    setHands((prevState) => {
      const h = [
        ...prevState
      ];
      const playerIndex = h.findIndex(playerHand => playerHand.player.id === hand.player.id);
      h[playerIndex].cards = hand.cards;
      return h;
    });
    deck.playCard(card);
    evaluateCard(card.value);
  }
  
  const gameOver = hands.some(hand => hand.cards !== null && hand.cards.length === 0);
  const currentPlayer = (hands && currentPlayerIndex !== null) ? hands[currentPlayerIndex].player : null;

  return (
    <>
      <button type="button" onClick={startNewGame} disabled={playDirection !== null}>Start New Game</button>

      {!!playDirection && (
        <>
          <Deck deck={deck} />
          <GameStatus currentPlayer={currentPlayer} />
          <ul className="playerHands">
            {hands.map(hand => (
              <PlayerHand
                key={`player-${hand.player.id}-hand`}
                player={hand.player}
                cards={hand.cards}
                isPlayersTurn={currentPlayer.id === hand.player.id}
                onPlay={(card) => {
                  playCard(hand, card);
                }}
              />
            ))}
          </ul>
        </>
      )}

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

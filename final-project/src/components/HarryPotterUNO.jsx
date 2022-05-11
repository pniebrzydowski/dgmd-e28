import { useCallback, useEffect, useRef, useState } from 'react';

import {Link, Route, BrowserRouter, Routes} from 'react-router-dom';
import useUnoDeck from '../hooks/useUnoDeck';

import GameBoard from './GameBoard';
import GameSettings from './GameSettings';
import ScoreHistory from './ScoreHistory';

const getHandScore = (hand) => hand.cards.reduce((prev, curr) => {
  if (curr.value === 'D' || curr.value === 'S' || curr.value === 'R') {
    return prev + 10;
  }
  if (curr.value === 'Wild') {
    return prev + 40;
  }
  if (curr.value === 'Draw Four') {
    return prev + 50;
  }
  return prev + curr.value;
}, 0);

const HarryPotterUNO = () => {
  const games = useRef(JSON.parse(localStorage.getItem('UNO-scores')) || []);
  const [players, setPlayers] = useState([]);
  const [playDirection, setPlayDirection] = useState(null);
  const [gameStart, setGameStart] = useState(null);
  const [currentPlayerIndex, setcurrentPlayerIndex] = useState(null);
  const [wildPlayed, setWildPlayed] = useState(false);
  const [hands, setHands] = useState([]);
  const deck = useUnoDeck();

  useEffect(() => {
    const h = players.map(p => ({
      player: p,
      cards: null
    }));
    setHands(h);
  }, [players]);

  const gameOver = hands.some(hand => hand.cards !== null && hand.cards.length === 0);

  const endGame = useCallback(() => {
    setPlayDirection(null);
    const updatedGames = [
      ...games.current,
      {
        start: gameStart,
        end: new Date().valueOf(),
        scores: hands.map(hand => getHandScore(hand))
      }
    ];
    games.current = updatedGames;
  }, [gameStart, hands]);
  
  useEffect(() => {
    if (gameOver) {
      endGame();
    }
  }, [endGame, gameOver]);


  const addCardsToHand = (numberOfCards, hand) => {
    setHands((prevState) => {
      const playerIndex = prevState.findIndex(playerHand => playerHand.player.id === hand.player.id);
      const h = [
        ...prevState
      ];
      h[playerIndex] = {
        ...prevState[playerIndex],
        cards: [
          ...prevState[playerIndex].cards,
          ...deck.dealNewCards(numberOfCards)
        ]
      };;
      return h;
    });
  }

  const startNewGame = () => {
    const h = [...hands];
    h.forEach(hand => {
      hand.cards = deck.dealNewCards(1)
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

  const onChooseColor = (color) => {
    deck.chooseWildColor(color);
    setWildPlayed(false);
    setcurrentPlayerIndex(advanceTurn(currentPlayerIndex));
  }

  const evaluateCard = (cardValue) => {
    let actOnPlayer = advanceTurn(currentPlayerIndex);

    if (cardValue === 'Draw Four') {
      addCardsToHand(4, hands[actOnPlayer]);
    }

    if (cardValue === 'Draw Four' || cardValue === 'Wild') {
      setWildPlayed(true);
      return;
    }

    if (cardValue === 'R') {
      if (players.length === 2) {
        actOnPlayer = advanceTurn(actOnPlayer);
      }  
      setPlayDirection('reverse');
    }

    if (cardValue === 'S') {
      actOnPlayer = advanceTurn(actOnPlayer);
    }
    if (cardValue === 'D') {
      addCardsToHand(2, hands[actOnPlayer]);
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

  const onPass = () => {
    const currentPlayerHand = hands[currentPlayerIndex];
    addCardsToHand(1, currentPlayerHand);
    setcurrentPlayerIndex(advanceTurn(currentPlayerIndex));
  }

  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li><Link to="/">Game Board</Link></li>
          <li><Link to="/score">Scoresheet</Link></li>
          <li><Link to="/settings">Game Settings</Link></li>
        </ul>
      </nav>

      <div className="route-container">
        <Routes>
          <Route path='/' element={
            <>
              {gameOver && (
                <p>Final Score:{' '}
                  {hands.reduce((prev, curr) => (
                    [
                      ...prev,
                      `${curr.player.name}: ${getHandScore(curr)}`
                    ]
                  ), []).join(', ')}
                </p>
              )}

              {!playDirection && players.length > 1 && (
                <button type="button" onClick={startNewGame}>Start New Game</button>
              )}

              {players.length <= 1 && (
                <p>You need at least 2 players to start a game. <Link to="/settings">Add more players</Link></p>
              )}

              {(!!playDirection || gameOver) && (
                <GameBoard
                  playDirection={playDirection}
                  deck={deck}
                  wildPlayed={wildPlayed}
                  onChooseColor={onChooseColor}
                  hands={hands}
                  currentPlayerIndex={currentPlayerIndex}
                  playCard={playCard}
                  onPass={onPass}
                />
              )}
            </>
          }/>
   
          <Route path="/score" element={
            <ScoreHistory players={players} games={games.current} />
          }/>
          <Route path="/settings" element={
            <GameSettings players={players} setPlayers={setPlayers} />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default HarryPotterUNO;

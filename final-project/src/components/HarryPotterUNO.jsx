import { useCallback, useEffect, useState } from "react";

import { Link, Route, BrowserRouter, Routes } from "react-router-dom";
import useUnoDeck from "../hooks/useUnoDeck";
import FinalScore, { getHandScore } from "./FinalScore";

import GameBoard from "./GameBoard";
import GameSettings from "./GameSettings";
import Navigation from "./Navigation";
import { getBestColor } from "./PlayerHands/AIHand";
import Rules from "./Rules";
import ScoreHistory from "./ScoreHistory";

export const HOUSE_COLORS = {
  Gryffindor: "red",
  Hufflepuff: "yellow",
  Ravenclaw: "blue",
  Slytherin: "green",
};

const HarryPotterUNO = () => {
  // On mount, fetch the score history & players from local storage
  const [games, setGames] = useState(
    JSON.parse(localStorage.getItem("UNO-scores")) || []
  );
  const [players, setPlayers] = useState(
    JSON.parse(localStorage.getItem("UNO-players")) || []
  );
  const [playDirection, setPlayDirection] = useState(null);
  const [gameStart, setGameStart] = useState(null);
  const [currentPlayerIndex, setcurrentPlayerIndex] = useState(null);
  const [wildPlayed, setWildPlayed] = useState(false);
  const [hands, setHands] = useState([]);
  const deck = useUnoDeck();

  useEffect(() => {
    const h = players.map((p) => ({
      player: p,
      cards: null,
    }));
    setHands(h);
  }, [players]);

  const endGame = useCallback(
    (lastCard) => {
      setPlayDirection(null);

      setGames((prevGames) => {
        const updatedGames = [
          ...prevGames,
          {
            start: gameStart,
            end: new Date().valueOf(),
            scores: [...hands].map((hand) => getHandScore(hand, lastCard)),
          },
        ];
        localStorage.setItem("UNO-scores", JSON.stringify(updatedGames));
        return updatedGames;
      });
    },
    [gameStart, hands]
  );

  const gameOver = hands.some(
    (hand) => hand.cards !== null && hand.cards.length === 0
  );

  useEffect(() => {
    if (gameOver) {
      endGame(deck.currentCard);
    }
  }, [deck.currentCard, endGame, gameOver]);

  const addCardsToHand = (numberOfCards, hand) => {
    setHands((prevState) => {
      const playerIndex = prevState.findIndex(
        (playerHand) => playerHand.player.name === hand.player.name
      );
      const h = [...prevState];
      h[playerIndex] = {
        ...prevState[playerIndex],
        cards: [
          ...prevState[playerIndex].cards,
          ...deck.dealNewCards(numberOfCards),
        ],
      };
      return h;
    });
  };

  const startNewGame = () => {
    const h = [...hands];
    h.forEach((hand) => {
      hand.cards = deck.dealNewCards(7);
    });
    deck.flipCard();
    setHands(h);
    setGameStart(new Date().valueOf());
    setcurrentPlayerIndex(0);
    setPlayDirection("forward");
  };

  const advanceTurn = (activePlayer, direction) => {
    if (direction === "forward") {
      if (activePlayer === players.length - 1) {
        return 0;
      }
      return activePlayer + 1;
    }

    if (activePlayer === 0) {
      return players.length - 1;
    }
    return activePlayer - 1;
  };

  const onChooseColor = (color) => {
    deck.chooseWildColor(color);
    setWildPlayed(false);
    setcurrentPlayerIndex(advanceTurn(currentPlayerIndex, playDirection));
  };

  const evaluateCard = (cardValue) => {
    const direction =
      cardValue === "R"
        ? playDirection === "forward"
          ? "reverse"
          : "forward"
        : playDirection;
    let actOnPlayer = advanceTurn(currentPlayerIndex, direction);

    if (cardValue === "R") {
      setPlayDirection(direction);
      if (players.length === 2) {
        actOnPlayer = advanceTurn(actOnPlayer, direction);
      }
    }

    if (cardValue === "Draw Four") {
      addCardsToHand(4, hands[actOnPlayer]);
    }

    if (cardValue === "Draw Four" || cardValue === "Wild") {
      if (currentPlayerIndex !== 0) {
        // Handle wild color selection if played by a computer opponent
        setTimeout(() => {
          onChooseColor(getBestColor(hands[currentPlayerIndex]));
        }, 1000);
        return;
      }
      setWildPlayed(true);
      return;
    }

    if (cardValue === "S") {
      actOnPlayer = advanceTurn(actOnPlayer, direction);
    }
    if (cardValue === "D") {
      addCardsToHand(2, hands[actOnPlayer]);
    }
    setcurrentPlayerIndex(actOnPlayer);
  };

  const playCard = (hand, card) => {
    // Check whether the card is playable (matching value/color or a wild)
    const isValid = deck.playCard(card);
    if (!isValid) {
      alert("Sorry, that card cannot be played at this time");
      return;
    }
    const idx = hand.cards.findIndex(
      (handCard) =>
        handCard.value === card.value && handCard.color === card.color
    );
    hand.cards.splice(idx, 1);

    setHands((prevState) => {
      const h = [...prevState];
      const playerIndex = h.findIndex(
        (playerHand) => playerHand.player.name === hand.player.name
      );
      h[playerIndex].cards = hand.cards;
      return h;
    });
    deck.playCard(card);
    evaluateCard(card.value);
  };

  const onClearPlayers = () => {
    // When players are reset, the current game & scoresheet should also be reset
    setPlayDirection(null);

    setGames([]);
    localStorage.removeItem("UNO-games");
  };

  const onPass = () => {
    const currentPlayerHand = hands[currentPlayerIndex];
    addCardsToHand(1, currentPlayerHand);
    setcurrentPlayerIndex(advanceTurn(currentPlayerIndex, playDirection));
  };

  return (
    <BrowserRouter>
      <Navigation />

      <div className="route-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {gameOver && (
                  <FinalScore hands={hands} currentCard={deck.currentCard} />
                )}

                {!playDirection && players.length > 1 && (
                  <button
                    type="button"
                    className="newGameButton"
                    onClick={startNewGame}
                  >
                    Start New Game
                  </button>
                )}

                {players.length <= 1 && (
                  <p>
                    You need at least 2 players to start a game.{" "}
                    <Link to="/players">Add more players</Link>
                  </p>
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
                    gameOver={gameOver}
                  />
                )}
              </>
            }
          />

          <Route
            path="/score"
            element={<ScoreHistory players={players} games={games} />}
          />
          <Route
            path="/players"
            element={
              <GameSettings
                players={players}
                setPlayers={setPlayers}
                onClear={onClearPlayers}
              />
            }
          />
          <Route path="/rules" element={<Rules />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default HarryPotterUNO;

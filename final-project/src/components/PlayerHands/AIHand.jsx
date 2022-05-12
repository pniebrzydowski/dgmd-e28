import { useEffect } from "react";
import { COLORS } from "../../hooks/useUnoDeck";
import Card from "../Card";
import PlayerDisplay from "./PlayerDisplay";

import "./styles.css";

export const getBestColor = (hand) => {
  const colorLengths = COLORS.map((color) => ({
    color,
    length: hand.cards.filter((card) => card.color === color).length,
  }));
  const mostColor = Math.max.apply(
    Math,
    colorLengths.map((color) => color.length)
  );
  return colorLengths.find((color) => color.length === mostColor).color;
};

const getAIcard = (sortedCards, currentCard) => {
  /** A basic "AI" for opponents, who play according to the following logic:
   *
   *  1. Highest card in the active color
   *  2. First card with a matching value
   *  3. Draw Four
   *  4. Regular Wild card
   **/
  const sameColorCard = sortedCards.find(
    (card) => card.color === currentCard.color
  );
  if (sameColorCard) {
    return sameColorCard;
  }

  const sameValueCard = sortedCards.find(
    (card) => card.value === currentCard.value
  );
  if (sameValueCard) {
    return sameValueCard;
  }

  const drawFour = sortedCards.find((card) => card.value === "Draw Four");
  if (drawFour) {
    return drawFour;
  }

  const wild = sortedCards.find((card) => card.value === "Wild");
  if (drawFour) {
    return wild;
  }

  return null;
};

const AIHand = ({
  player,
  showCards,
  cards,
  isPlayersTurn,
  onPlay,
  onPass,
  currentCard,
}) => {
  useEffect(() => {
    if (showCards) {
      return;
    }

    if (!isPlayersTurn) {
      return;
    }

    const cardToPlay = getAIcard(cards, currentCard);
    setTimeout(cardToPlay ? () => onPlay(cardToPlay) : onPass, 1000);
  }, [
    showCards,
    isPlayersTurn,
    cards,
    currentCard.color,
    onPlay,
    onPass,
    currentCard,
  ]);

  return (
    <li className={`playerHand ${isPlayersTurn ? "playerHand--active" : ""}`}>
      <PlayerDisplay player={player} isAI />

      {cards &&
        (showCards ? (
          <>
            <ul className="playerHand-cards">
              {cards.map((card, idx) => (
                <li key={idx}>
                  <Card card={card} mini />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>
            Number of cards in hand:{" "}
            {cards.length === 1 ? "UNO!" : cards.length}
          </p>
        ))}
    </li>
  );
};

export default AIHand;

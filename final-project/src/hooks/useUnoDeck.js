import { useRef } from "react";

export const COLORS = ["blue", "green", "red", "yellow"];

const SPECIALTY_CARDS = ["D", "S", "R"];

class Card {
  constructor(value, color) {
    this.value = value;
    this.color = color;
  }

  // In the future, this could be updated to display images, components, etc.
  display = () => this.value;
}

const buildUnoDeck = () => {
  const deck = [];
  COLORS.forEach((color) => {
    deck.push(new Card(0, color));
    for (let i = 1; i <= 9; i++) {
      deck.push(new Card(i, color));
      deck.push(new Card(i, color));
    }
    SPECIALTY_CARDS.forEach((card) => {
      deck.push(new Card(card, color));
      deck.push(new Card(card, color));
    });
  });
  for (let i = 1; i <= 4; i++) {
    deck.push(new Card("Wild", "black"));
    deck.push(new Card("Draw Four", "black"));
  }
  return deck;
};

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const useUnoDeck = () => {
  const remainingCards = useRef(buildUnoDeck());
  const stack = useRef([]);
  // Track the color in a ref to be able to switch it when wilds are played
  const currentColor = useRef(null);

  const validatePlayedCard = (card) => {
    const lastValue = stack.current[stack.current.length - 1].value;
    if (card.color === "black") {
      // Wilds may always be played
      return true;
    }

    if (card.color === currentColor.current) {
      return true;
    }
    if (card.value === lastValue) {
      return true;
    }
    return false;
  };

  const addCardToStack = (card) => {
    stack.current.push(card);
    currentColor.current = card.color;
  };

  const playCard = (card) => {
    const isValid = validatePlayedCard(card);
    if (!isValid) {
      return false;
    }
    addCardToStack(card);
    return true;
  };

  const chooseWildColor = (color) => {
    // Change the "active" color of the last wild played to enable play to continue
    stack.current[stack.current.length - 1].color = color;
    currentColor.current = color;
  };

  const getRandomCard = () => {
    if (remainingCards.current.length === 0) {
      // If the deck is empty, "reshuffle"
      remainingCards.current = buildUnoDeck();
    }
    const cardsLeft = remainingCards.current.length;
    const randomNumber = getRandomNumber(0, cardsLeft - 1);
    const card = remainingCards.current[randomNumber];
    remainingCards.current.splice(randomNumber, 1);
    return card;
  };

  const flipCard = () => {
    const startCard = getRandomCard();
    if (startCard.color === "black") {
      // If a wild is flipped, select a random color to allow the game to start
      startCard.color = COLORS[getRandomNumber(0, 3)];
    }
    addCardToStack(startCard);
  };

  const dealNewCards = (n) => {
    const hand = [];
    for (let i = 0; i < n; i++) {
      hand.push(getRandomCard());
    }
    return hand;
  };

  return {
    dealNewCards,
    flipCard,
    playCard,
    chooseWildColor,
    currentCard:
      stack.current.length > 0 ? stack.current[stack.current.length - 1] : null,
  };
};

export default useUnoDeck;

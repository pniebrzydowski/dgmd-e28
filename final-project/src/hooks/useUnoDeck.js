import { useRef } from 'react';

const COLORS = [
  'red',
  'green',
  'blue',
  'yellow'
];

const SPECIALTY_CARDS = [
  'D',
  'S',
  'R'
];

class Card {
  constructor(value, color) {
    this.value = value;
    this.color = color;
  }

  display = () => `${this.value}-${this.color}`;
}

const buildUnoDeck = () => {
  const deck = [];
  COLORS.forEach((color) => {
    deck.push(new Card(0, color));
    for(let i = 1; i <= 9; i++) {
      deck.push(new Card(i, color));
      deck.push(new Card(i, color));
    }
    SPECIALTY_CARDS.forEach(card => {
      deck.push(new Card(card, color));
      deck.push(new Card(card, color));
    });
  });
  for(let i = 1; i <= 4; i++) {
    deck.push(new Card('Wild', 'black'));
    deck.push(new Card('Draw Four', 'black'));
  }
  return deck;
}

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const validatePlayedCard = (card, prevCard) => {
  if (card.color === 'black') {
    return true;
  }
  if (card.color === prevCard.color) {
    return true;
  }
  if (card.value === prevCard.value) {
    return true;
  }
  return false;
};

const useUnoDeck = () => {
  const remainingCards = useRef(buildUnoDeck());
  const stack = useRef([]);


  const playCard = card => {
    const isValid = validatePlayedCard(card, stack.current[stack.current.length - 1]);
    if (!isValid) {
      return false;
    }
    stack.current.push(card);
    return true;
  }

  const flipCard = () => {
    const card = getRandomCard();
    stack.current.push(card);
  }
  
  const getRandomCard = () => {
    const cardsLeft = remainingCards.current.length;
    const randomNumber = getRandomNumber(0, cardsLeft - 1);
    const card = remainingCards.current[randomNumber];
    remainingCards.current.splice(randomNumber, 1);
    return card;
  }

  const dealNewCards = (n) => {
    const hand = [];
    for(let i=0; i<n; i++) {
      hand.push(getRandomCard());
    }
    return hand;
  };

  return {
    dealNewCards,
    flipCard,
    playCard,
    currentCard: stack.current.length > 0 ? stack.current[stack.current.length - 1] : null
  }
}

export default useUnoDeck;
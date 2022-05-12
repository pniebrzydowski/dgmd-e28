import { useEffect } from 'react';
import Card from '../Card';

import './styles.css';

const getAIcard = (sortedCards, currentCard) => {
  /** A basic "AI" for opponents, who play according to the following logic:
   *  
   *  1. Highest card in the active color
   *  2. First card with a matching value
   *  3. Draw Four
   *  4. Regular Wild card
   **/
  console.log(sortedCards);
  
  const sameColorCard = sortedCards.find(card => card.color === currentCard.color);
  if (sameColorCard) {
    return sameColorCard;
  }

  const sameValueCard = sortedCards.find(card => card.value === currentCard.value);
  if (sameValueCard) {
   return sameValueCard;
  }

  const drawFour = sortedCards.find(card => card.value === 'Draw Four');
  if (drawFour) {
    return drawFour;
  }

  const wild = sortedCards.find(card => card.value === 'Draw Four');
  if (drawFour) {
    return wild;
  }

  return null;
}

const PlayerHand = ({player, showCards, cards, isPlayersTurn, onPlay, onPass, canPlay, currentCard}) => {
  const sortedCards = cards.sort((a, b) => {
    if (a.color === b.color) {
      if (a.value === b.value) { return 0 }
      return a.value < b.value ? 1 : -1;
    }
    return (a.color > b.color) ? 1 : -1;
  });

  useEffect(() => {
    if (showCards) {
      return;
    }

    if (!isPlayersTurn) {
      return;
    }

    const cardToPlay = getAIcard(sortedCards, currentCard);
    setTimeout( cardToPlay ? () => onPlay(cardToPlay) : onPass, 1000 );
  }, [showCards, isPlayersTurn, sortedCards, currentCard.color, onPlay, onPass, currentCard]);

  return (
    <li className={`playerHand ${isPlayersTurn ? 'playerHand--active' : ''}`}>
      <p>{player.name}</p>
      {sortedCards && (
        showCards ? (
          <>
            {isPlayersTurn && (
              <p className='playerHand-passButton'>
                <button type="button" onClick={onPass}>Pass</button>
              </p>
            )}
      
            <ul className="playerHand-cards">
              {sortedCards.map((card, idx) => (
                <li key={idx}>
                  <Card card={card} />
                  {isPlayersTurn && (
                    <button type="button" onClick={() => onPlay(card)} disabled={!canPlay}>Play!</button>
                  )}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Number of cards in hand: {cards.length === 1 ? 'UNO!' : cards.length}</p>
        )
      )}
    </li>
  );
}

export default PlayerHand;

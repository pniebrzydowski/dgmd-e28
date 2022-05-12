import Card from '../Card';
import PlayerDisplay from './PlayerDisplay';

import './styles.css';

const PlayerHand = ({player, showCards, cards, isPlayersTurn, onPlay, onPass, canPlay, currentCard}) => {
  const sortedCards = cards.sort((a, b) => {
    if (a.color === b.color) {
      if (a.value === b.value) { return 0 }
      return a.value < b.value ? 1 : -1;
    }
    return (a.color > b.color) ? 1 : -1;
  });

  return (
    <li className={`playerHand ${isPlayersTurn ? 'playerHand--active' : ''}`}>
      <PlayerDisplay player={player} />
      {sortedCards && (
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
      )}
    </li>
  );
}

export default PlayerHand;

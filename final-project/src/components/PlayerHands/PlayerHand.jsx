import Card from '../Card';

import './styles.css';

const PlayerHand = ({player, cards, isPlayersTurn, onPlay, onPass, canPlay}) => (
  <li className='playerHand'>
    <p>{player.name}</p>
    {cards && (
      <ul className={`playerHand-cards ${isPlayersTurn ? 'playerHand-cards--active' : ''}`}>
        <li className='playerHand-passButton'>
          <button type="button" onClick={onPass}>Pass</button>
        </li>
        {cards.map((card, idx) => (
          <li key={idx}>
            <Card card={card} />
            {isPlayersTurn && (
              <button type="button" onClick={() => onPlay(card)} disabled={!canPlay}>Play!</button>
            )}
          </li>
        ))}
      </ul>
    )}
  </li>
);

export default PlayerHand;

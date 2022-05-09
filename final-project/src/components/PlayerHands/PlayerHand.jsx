import Card from '../Card';

import './styles.css';

const PlayerHand = ({player, cards, isPlayersTurn, onPlay}) => (
  <li className='playerHand'>
    <p>{player.name}</p>
    {cards && (
      <ul className="playerHand-cards">
        {cards.map((card, idx) => (
          <li key={idx}>
            <Card card={card} />
            {isPlayersTurn && (
              <button type="button" onClick={() => onPlay(card)}>Play!</button>
            )}
          </li>
        ))}
      </ul>
    )}
  </li>
);

export default PlayerHand;

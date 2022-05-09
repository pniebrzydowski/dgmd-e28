import PlayerHand from './PlayerHand';

import './styles.css';

const PlayerHands = ({ currentPlayerIndex, hands, playCard }) => {
  const currentPlayer = (hands && currentPlayerIndex !== null) ? hands[currentPlayerIndex].player : null;

  return (
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
  );
}

export default PlayerHands;
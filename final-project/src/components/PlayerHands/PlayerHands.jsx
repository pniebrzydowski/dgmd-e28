import PlayerHand from './PlayerHand';

import './styles.css';

const PlayerHands = ({ currentPlayerIndex, hands, playCard, onPass, canPlay, currentCard, gameOver }) => {
  const currentPlayer = (hands && currentPlayerIndex !== null) ? hands[currentPlayerIndex].player : null;

  return (
    <ul className="playerHands">
      {hands.map((hand, idx) => (
        <PlayerHand
          showCards={idx === 0 || gameOver}
          key={`${hand.player.name}'s hand`}
          player={hand.player}
          cards={hand.cards}
          isPlayersTurn={currentPlayer.name === hand.player.name}
          onPlay={(card) => {
            playCard(hand, card);
          }}
          onPass={onPass}
          canPlay={canPlay}
          currentCard={currentCard}
        />
      ))}
    </ul>
  );
}

export default PlayerHands;
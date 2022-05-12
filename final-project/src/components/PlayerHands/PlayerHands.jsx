import PlayerHand from './PlayerHand';

import './styles.css';

const PlayerHands = ({ currentPlayerIndex, hands, playCard, onPass, canPlay, currentCard, gameOver }) => {
  const currentPlayer = (hands && currentPlayerIndex !== null) ? hands[currentPlayerIndex].player : null;

  const [myHand, ...opponentHands] = hands;
  return (
    <section className='playerHands'>
      <ul className='myHand'>
        <PlayerHand
          showCards={true}
          key={`${myHand.player.name}'s hand`}
          player={myHand.player}
          cards={myHand.cards}
          isPlayersTurn={!gameOver && currentPlayer.name === myHand.player.name}
          onPlay={(card) => {
            playCard(myHand, card);
          }}
          onPass={onPass}
          canPlay={canPlay}
          currentCard={currentCard}
        />
      </ul>
      <ul className="opponentHands">
        {opponentHands.map((hand) => (
          <PlayerHand
            showCards={gameOver}
            key={`${hand.player.name}'s hand`}
            player={hand.player}
            cards={hand.cards}
            isPlayersTurn={!gameOver && currentPlayer.name === hand.player.name}
            onPlay={(card) => {
              playCard(hand, card);
            }}
            onPass={onPass}
            canPlay={canPlay}
            currentCard={currentCard}
          />
        ))}
      </ul>
    </section>
  );
}

export default PlayerHands;
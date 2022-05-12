import AIHand from "./AIHand";
import PlayerHand from "./PlayerHand";

import "./styles.css";

const sortCards = (a, b) => {
  if (a.color === b.color) {
    if (a.value === b.value) {
      return 0;
    }
    return String(a.value) < String(b.value) ? 1 : -1;
  }
  return a.color > b.color ? 1 : -1;
};

const PlayerHands = ({
  currentPlayerIndex,
  hands,
  playCard,
  onPass,
  canPlay,
  currentCard,
  gameOver,
}) => {
  const currentPlayer =
    hands && currentPlayerIndex !== null
      ? hands[currentPlayerIndex].player
      : null;

  const [myHand, ...opponentHands] = hands;
  return (
    <section className="playerHands">
      <ul className="myHand">
        <PlayerHand
          player={myHand.player}
          cards={myHand.cards.sort(sortCards)}
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
        <li>
          <h3>Opponents</h3>
        </li>
        {opponentHands.map((hand) => (
          <AIHand
            showCards={gameOver}
            key={`${hand.player.name}'s hand`}
            player={hand.player}
            cards={hand.cards.sort(sortCards)}
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
};

export default PlayerHands;

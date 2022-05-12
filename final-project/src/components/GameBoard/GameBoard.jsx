import ChooseColor from "../ChooseColor/ChooseColor";
import Deck from "../Deck/Deck";
import PlayerHands from "../PlayerHands/PlayerHands";

import "./styles.css";

const GameBoard = ({
  playDirection,
  deck,
  wildPlayed,
  onChooseColor,
  hands,
  currentPlayerIndex,
  playCard,
  onPass,
  gameOver,
}) => (
  <section className="gameBoard-wrapper">
    {!!playDirection && (
      <p>
        {playDirection === "reverse" && <>&larr;</>}
        {" Play Direction "}
        {playDirection === "forward" && <>&rarr;</>}
      </p>
    )}
    <Deck deck={deck} />
    {wildPlayed && <ChooseColor onChooseColor={onChooseColor} />}
    <PlayerHands
      hands={hands}
      currentPlayerIndex={currentPlayerIndex}
      playCard={playCard}
      onPass={onPass}
      canPlay={!wildPlayed}
      currentCard={deck.currentCard}
      gameOver={gameOver}
    />
  </section>
);

export default GameBoard;

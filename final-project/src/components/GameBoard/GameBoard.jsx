import ChooseColor from '../ChooseColor/ChooseColor';
import Deck from '../Deck/Deck';
import PlayerHands from '../PlayerHands/PlayerHands';

import './styles.css';

const GameBoard = ({ 
  deck,
  wildPlayed,
  onChooseColor,
  hands,
  currentPlayerIndex,
  playCard,
  onPass,
}) => (
  <section className="gameBoard-wrapper">
    <Deck deck={deck} />
    {wildPlayed && <ChooseColor onChooseColor={onChooseColor} />}
    <PlayerHands
      hands={hands}
      currentPlayerIndex={currentPlayerIndex}
      playCard={playCard}
      onPass={onPass}
      canPlay={!wildPlayed}
    />
  </section>
);

export default GameBoard;

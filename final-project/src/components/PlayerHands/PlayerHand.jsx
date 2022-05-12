import Card from "../Card";
import PlayerDisplay from "./PlayerDisplay";

import "./styles.css";

const PlayerHand = ({
  player,
  cards,
  isPlayersTurn,
  onPlay,
  onPass,
  canPlay,
}) => (
  <li className={`playerHand ${isPlayersTurn ? "playerHand--active" : ""}`}>
    <PlayerDisplay player={player} />
    {cards && (
      <>
        {isPlayersTurn && (
          <p className="playerHand-passButton">
            <button type="button" onClick={onPass}>
              Pass
            </button>
          </p>
        )}

        <ul className="playerHand-cards">
          {cards.map((card, idx) => (
            <li key={idx}>
              <Card card={card} />
              {isPlayersTurn && (
                <button
                  type="button"
                  onClick={() => onPlay(card)}
                  disabled={!canPlay}
                >
                  Play!
                </button>
              )}
            </li>
          ))}
        </ul>
      </>
    )}
  </li>
);

export default PlayerHand;

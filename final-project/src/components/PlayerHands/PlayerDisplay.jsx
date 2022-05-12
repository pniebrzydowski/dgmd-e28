import { HOUSE_COLORS } from "../HarryPotterUNO";

const PlayerDisplay = ({ player, isAI = false }) => {
  const houseColor = HOUSE_COLORS[player.house];
  return (
    <div className={"playerHand-display"}>
      <h4>
        {player.name}
        {!isAI && " (you)"}
      </h4>
      <h5 className={`playerHand-display--${houseColor}`}>{player.house}</h5>
    </div>
  );
};

export default PlayerDisplay;

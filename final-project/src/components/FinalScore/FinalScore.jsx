import { HOUSE_COLORS } from "../HarryPotterUNO";

export const getHandScore = (hand, lastCard) => {
  /**
   * If a winning player's last card matches his or her house color, they receive
   * a bonus of -25 points
   **/

  if (hand.cards.length === 0) {
    return lastCard.color === HOUSE_COLORS[hand.player.house] ? -25 : 0;
  }
  return hand.cards.reduce((prev, curr) => {
    if (curr.value === "S" || curr.value === "R") {
      return prev + 10;
    }
    if (curr.value === "D") {
      return prev + 20;
    }

    if (curr.value === "Wild") {
      return prev + 40;
    }
    if (curr.value === "Draw Four") {
      return prev + 50;
    }
    return prev + curr.value;
  }, 0);
};

const FinalScore = ({ hands, currentCard }) => (
  <p>
    Final Score:{" "}
    {[...hands]
      .sort((a, b) =>
        getHandScore(a, currentCard) > getHandScore(b, currentCard) ? 1 : -1
      )
      .reduce(
        (prev, curr) => [
          ...prev,
          `${curr.player.name}: ${getHandScore(curr, currentCard)}`,
        ],
        []
      )
      .join(", ")}
  </p>
);

export default FinalScore;

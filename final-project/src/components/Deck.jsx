const Deck = ({ deck }) => (
  <>
    {deck.currentCard && (
      <p>
        Current Card: {deck.currentCard.display()}
      </p>
    )}
  </>
);

export default Deck;
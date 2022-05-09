import Card from "../Card";

import './styles.css';

const Deck = ({ deck }) => (
  <section className="deck">
    <Card card={null} />
    {deck.currentCard && (
      <Card card={deck.currentCard} />
    )}
  </section>
);

export default Deck;
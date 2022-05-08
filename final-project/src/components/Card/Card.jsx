import
 './styles.css';

const Card = ({ card }) => (
  <div className={`card card-${card.color}`}>{card.display()}</div>
);

export default Card;
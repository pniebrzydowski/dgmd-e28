import './styles.css';

const Card = ({ card }) => {
  if (!card) {
    return (
      <div className="card card-back">UNO</div>
    );
  }

  return (
    <div className={`card card-${card.color}`}>{card.display()}</div>
  );
};

export default Card;
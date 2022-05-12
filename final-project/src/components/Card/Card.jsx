import './styles.css';

const Card = ({ card, mini = false }) => {
  if (!card) {
    return (
      <div className="card card-back">UNO</div>
    );
  }

  return (
    <div className={`card card-${card.color}${mini ? ' card-mini' : ''}`}>{card.display()}</div>
  );
};

export default Card;
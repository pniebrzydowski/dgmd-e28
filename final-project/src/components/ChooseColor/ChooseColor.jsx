import { COLORS } from "../../hooks/useUnoDeck";

import "./styles.css";

const ChooseColor = ({ onChooseColor }) => (
  <>
    <p>Choose a color: </p>
    <ul className="chooseColor">
      {COLORS.map((color) => (
        <li key={color}>
          <button
            type="button"
            className={`chooseColor-${color}`}
            onClick={() => onChooseColor(color)}
          >
            {color}
          </button>
        </li>
      ))}
    </ul>
  </>
);

export default ChooseColor;

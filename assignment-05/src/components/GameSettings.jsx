/* eslint-disable */
import { useState } from 'react';

const GameSettings = ({range: { min, max }, setRange, guessesAllowed, setGuessesAllowed}) => {
  const [minValue, setMinValue] = useState(String(min));
  const [maxValue, setMaxValue] = useState(String(max));
  const [guessesValue, setGuessesValue] = useState(String(guessesAllowed));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setRange({
      min: Number(minValue),
      max: Number(maxValue)
    })
    setGuessesAllowed(guessesValue);
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="range-min">Number Range:</label>
        <input
          id="range-min"
          type="number"
          name="minValue"
          value={minValue}
          onChange={e => setMinValue(e.target.value)}
        />
        <input
          id="range-max"
          type="number"
          name="maxValue"
          value={maxValue}
          onChange={e => setMaxValue(e.target.value)}
        />
      </fieldset>
      <fieldset>
        <label htmlFor="guesses-allowed"># of Guesses Allowed:</label>
        <input
          id="guesses-allowed"
          name="guessesAllowed"
          value={guessesValue}
          onChange={e => setGuessesValue(e.target.value)}
        />
      </fieldset>
      <button type="submit">Save</button>
    </form>
  );
};

export default GameSettings;

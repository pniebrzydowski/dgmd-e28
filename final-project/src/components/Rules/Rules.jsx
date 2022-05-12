import { Link } from "react-router-dom";
import "./styles.css";

const Rules = () => (
  <section className="rules">
    <h1>Rules of the Game</h1>

    <h2>Setup</h2>
    <p>
      Before playing the game, the player must first choose their own character
      as well as at least one opponent. This can be done on the{" "}
      <Link to="/players">Players</Link> page. Characters available for choosing
      include characters from the Harry Potter series of books and movies. Only
      characteres which are part of a Hogwarts house are available to choose, as
      this affects the scoring. For more details, see the "Scoring" section
      below.
    </p>

    <p>Recommended number of players: 2 - 6</p>

    <h2>Game Play</h2>
    <ol>
      <li>
        To play a game, once you've set up your characters, visit the{" "}
        <Link to="/">Game Board</Link> and click "Start New Game".
      </li>
      <li>
        All players are dealt 7 cards and a single card is dealt face up next to
        the deck.
      </li>
      <li>
        The player (you) always plays first. Your opponents hands are controlled
        by the system.
      </li>
      <li>Play starts in a clockwise direction.</li>
      <li>
        A played card must always match either the value or color (e.g, if a Red
        5 is showing, any Red card or a 5 card in any color may be played), or
        be a black "wild" card.
      </li>
      <li>
        A player may click "Pass" to skip their turn. Passing is possible even
        if there is a playable card in your hand. This will add one card from
        the deck to their hand.
      </li>
      <li>
        The game ends when the first player plays all of the cards in his or her
        hand.
      </li>
      <li>
        Scores will be added up, and each game adds a player's score to his or
        her total.
      </li>
      <li>
        As this is a digital game, there is no requirement to shout UNO! when
        you have one card remaining, but it might add to the experience :-). The
        card count for opponent hands will show "UNO" when they have only one
        card remaining, instead of a 1.
      </li>
    </ol>

    <h3>The Deck</h3>
    <p>The deck consists of 108 cards in four colors, plus wild cards</p>
    <ol>
      <li>
        25 cards in each color&mdash;blue, green, red, and yellow
        <ol>
          <li>One 0 (ZERO) card</li>
          <li>Two each of values 1 (ONE) to 9 (NINE)</li>
          <li>
            Two each of each action card&mdash;Draw Two (D), Reverse (R), and
            Skip (S)
          </li>
        </ol>
      </li>
      <li>4 "Wild" Cards</li>
      <li>4 "Draw Four" Cards</li>
    </ol>

    <h4>Action Cards</h4>
    <p>There are 5 special action cards</p>
    <ol>
      <li>Draw Two (D) - The next player will be forced draw two cards</li>
      <li>Reverse (R) - The direction of play is switched</li>
      <li>Skip (S) - The next player will be skipped</li>
      <li>
        Wild - The player playing this card can choose a color to continue play
      </li>
      <li>
        Draw Four - Same as "Wild", but the next player will be forced to draw
        four cards as well
      </li>
    </ol>
    <p>
      Even when a player is forced to draw cards, they may still take their turn
      as normal.
    </p>
    <p>
      When playing a two player game, Reverse (R) cards will act the same as a
      Skip (S), returning play to the same player who played the Reverse card.
    </p>

    <h2>Scoring</h2>
    <p>
      At the end of each round, the remaining cards in each player's hand is
      totaled according to the following values:
    </p>
    <ul>
      <li>50 Points - Draw Four</li>
      <li>40 Points - Wild</li>
      <li>20 Points - Draw Two</li>
      <li>10 Points - Reverse; Skip</li>
      <li>All number cards are scored at face value</li>
    </ul>
    <p>
      A summary of previously played games, as well as a total score are
      available on the <Link to="/scores">Scoresheet</Link> page. Refreshing the
      page or closing and reopening will not erase the scores! You can reset the
      scoresheet by resetting the chosen characters on the{" "}
      <Link to="/players">Players</Link> page.
    </p>

    <h3>Harry Potter Bonus!</h3>
    <p>
      In this special Harry Potter themed game, a bonus is provided if you
      manage to play your last card in a matching color to your chosen
      character's Hogwarts house, you will receive a bonus of{" "}
      <strong>-25 points</strong> for that game (remember, lower scores are
      better!). The house colors are displayed on the game board, and associated
      as following:
    </p>
    <ul>
      <li>Gryffindor - Red</li>
      <li>Hufflepuff - Yellow</li>
      <li>Ravenclaw - Blue</li>
      <li>Slytherin - Green</li>
    </ul>
  </section>
);

export default Rules;

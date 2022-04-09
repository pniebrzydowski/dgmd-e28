class Letter {
  constructor(letter = "", index = -1) {
    this.letter = letter;
    this.index = index;
    this.isCorrect = false;
    this.isInWord = false;
  }

  generateElement() {
    const $letterEl = document.createElement("li");
    $letterEl.classList.add("letter");
    if (this.letter === "") {
      return $letterEl;
    }
    $letterEl.innerHTML = this.letter;

    if (this.isCorrect) {
      $letterEl.classList.add("letter-correct");
    }
    if (this.isInWord) {
      $letterEl.classList.add("letter-inword");
    }
    return $letterEl;
  }

  evaluate(guessResult) {
    if (guessResult.state === 2) {
      this.isCorrect = true;
    } else if (guessResult.state === 1) {
      this.isInWord = true;
    }
  }
}

class Guess {
  constructor(index) {
    this.index = index;
    this.letterCount = 0;
    const emptyWord = [];
    for (let i = 0; i < 5; i++) {
      emptyWord.push(new Letter());
    }
    this.letters = emptyWord;
  }

  getGuessWord() {
    return this.letters.reduce((word, letter) => (word += letter.letter), "");
  }

  evaluate(evaluatedResult) {
    this.letters.forEach((letter, idx) => {
      letter.evaluate(evaluatedResult[idx]);
    });
    this.updateRow();

    return evaluatedResult.every((letter) => letter.state === 2);
  }

  isFull() {
    return this.letterCount === 5;
  }

  updateRow() {
    this.$row.innerHTML = this.getRow().join("");
  }

  removeLastLetter() {
    this.letters[this.letterCount - 1] = new Letter();
    if (this.letterCount > 0) {
      this.letterCount--;
    }
    this.updateRow();
  }

  addNewLetter(letter) {
    const length = this.letterCount;
    this.letters[length] = new Letter(letter, this.letterCount);
    this.letterCount++;
    this.updateRow();
  }

  getRow() {
    return this.letters.map((letter) => letter.generateElement().outerHTML);
  }

  generateElement() {
    const $el = document.createElement("ul");
    $el.className = "row";
    $el.innerHTML = this.getRow().join("");
    this.$row = $el;
    return $el;
  }
}

class Game {
  constructor(wordApi) {
    this.wordApi = wordApi;
    this.$gameBoard = document.getElementById("game-board");
    this.initGame();
    this.startGame();
  }

  updateGuessedLetters(newLetters) {
    if (!this.$guessedLettersContainer) {
      const $guessedDiv = document.createElement("ul");
      $guessedDiv.id = "letters-guessed";
      this.$gameBoard.appendChild($guessedDiv);
      this.$guessedLettersContainer = $guessedDiv;
    }

    newLetters.forEach((letter) => {
      const existingLetterIndex = this.guessedLetters.findIndex((l) => l.letter === letter.letter);
      if (existingLetterIndex !== -1) {
        this.guessedLetters[existingLetterIndex] = letter;
        return;
      }
      this.guessedLetters.push(letter);
    });

    this.guessedLetters = this.guessedLetters.sort((a, b) => a.letter.localeCompare(b.letter));
    const newLetterHtml = this.guessedLetters.reduce(
      (html, letter) => (html += letter.generateElement().outerHTML),
      ""
    );
    this.$guessedLettersContainer.innerHTML = newLetterHtml;
  }

  createEmptyBoard() {
    this.$gameBoard.innerHTML = "";
    this.guesses.forEach((guess) => {
      const $el = guess.generateElement();
      this.$gameBoard.appendChild($el);
    });
  }

  goToNextGuess() {
    this.guessIndex++;
    this.currentGuess = this.guesses[this.guessIndex];
  }

  initGame() {
    this.guesses = [1, 2, 3, 4, 5, 6].map((idx) => new Guess(idx));
    this.guessIndex = 0;
    this.currentGuess = this.guesses[0];
    this.guessedLetters = [];
  }

  endGame(msg) {
    if (confirm(`${msg}. Would you like to play again?`)) {
      this.initGame();
      this.restartGame();
    }
  }

  async evaluateGuess() {
    const guessWord = this.currentGuess.getGuessWord();
    const evaluatedGuess = await this.wordApi.evaluate(guessWord);
    if (evaluatedGuess.error) {
      alert(evaluatedGuess.error);
      return;
    }
    const isCorrect = this.currentGuess.evaluate(evaluatedGuess);
    if (isCorrect) {
      setTimeout(() => {
        this.endGame(`Congratulations, you guessed the word ${guessWord} correctly`);
      }, 0);
      return;
    }
    this.updateGuessedLetters(this.currentGuess.letters);
    if (this.guessIndex === 5) {
      const correctWord = await this.wordApi.endGame();
      this.endGame(`Sorry, the word was: ${correctWord}`);
      return;
    }
    this.goToNextGuess();
    return;
  }

  initKeyboard() {
    document.body.addEventListener("keyup", (e) => {
      const key = e.key;
      const fullGuess = this.currentGuess.isFull();

      if (key === "Enter") {
        return this.evaluateGuess();
      }

      if (key === "Backspace") {
        this.currentGuess.removeLastLetter();
        return;
      }

      if (key.length !== 1 || !/[a-zA-Z]/.test(key)) {
        // not a letter
        return;
      }

      if (fullGuess) {
        return;
      }
      this.currentGuess.addNewLetter(key);
    });
  }

  restartGame() {
    this.startGame(true);
  }

  toggleLoader(visible) {
    if (!this.$loader) {
      this.$loaderDiv = document.createElement("div");
      this.$loaderDiv.innerHTML = "Loading...";
      this.$gameBoard.prepend(this.$loaderDiv);
    }
    this.$loaderDiv.className = visible ? "visible" : "hidden";
  }

  async startGame(isRestart = false) {
    this.toggleLoader(true);
    this.word = await this.wordApi.getRandomWord();
    this.toggleLoader(false);
    this.createEmptyBoard();
    if (isRestart) {
      return;
    }
    this.initKeyboard();
  }
}

class WordAPI {
  constructor() {
    this.baseUrl = "https://word.digitalnook.net/api/v1";
  }

  async getRandomWord() {
    const response = await fetch(`${this.baseUrl}/start_game/`, {
      method: "POST",
    }).then((res) => res.json());
    this.id = response.id;
    this.key = response.key;
    this.wordId = response.wordID;
    return response;
  }

  async endGame() {
    const gameResult = await fetch(`${this.baseUrl}/finish_game/`, {
      method: "POST",
      body: JSON.stringify({
        id: this.id,
        key: this.key,
      }),
    }).then((res) => res.json());
    return gameResult.answer;
  }

  async evaluate(word) {
    if (word.length !== 5) {
      return {
        error: "Sorry, you must enter a five letter word",
      };
    }

    const evaluatedResult = await fetch(`${this.baseUrl}/guess/`, {
      method: "POST",
      body: JSON.stringify({
        id: this.id,
        key: this.key,
        guess: word,
      }),
    })
      .then((res) => res.json())
      .catch(() => {
        return {
          error: "Sorry, this word was already guessed or not found in our dictionary",
        };
      });

    return evaluatedResult;
  }
}

document.body.onload = () => {
  const API_KEY = "";
  new Game(new WordAPI());
};

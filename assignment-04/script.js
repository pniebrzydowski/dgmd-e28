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
  evaluate(wordGuess) {
    const lettersGuessed = wordGuess.split("");
    if (lettersGuessed.includes(this.letter)) {
      if (lettersGuessed[this.index] === this.letter) {
        this.isCorrect = true;
      } else {
        this.isInWord = true;
      }
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

  evaluate(correctWord) {
    this.letters.forEach((letter) => {
      letter.evaluate(correctWord);
    });
    this.updateRow();

    return this.getGuessWord() === correctWord;
  }

  isFull() {
    return this.letterCount === 5;
  }

  updateRow() {
    this.$row.innerHTML = this.getRow().join("");
  }

  removeLastLetter() {
    this.letters[this.letterCount - 1] = new Letter();
    this.letterCount--;
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
      if (this.guessedLetters.includes(letter.letter)) {
        return;
      }
      this.guessedLetters.push(letter.letter);
      const $newLetterEl = letter.generateElement();
      this.$guessedLettersContainer.appendChild($newLetterEl);
    });
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

  initKeyboard() {
    document.body.addEventListener("keyup", (e) => {
      const key = e.key;
      const fullGuess = this.currentGuess.isFull();
      const correctWord = this.word;

      if (key === "Enter") {
        const wordError = this.wordApi.isValidWord(this.currentGuess.getGuessWord());
        if (wordError !== "") {
          alert(wordError);
          return;
        }

        const isCorrect = this.currentGuess.evaluate(correctWord);
        if (isCorrect) {
          this.endGame("Congratulations, you guessed the word correctly!");
          return;
        }
        this.updateGuessedLetters(this.currentGuess.letters);
        if (this.guessIndex === 5) {
          this.endGame(`Sorry, the word was: ${correctWord}`);
          return;
        }
        this.goToNextGuess();
        return;
      }

      if (key === "Backspace") {
        this.currentGuess.removeLastLetter();
        return;
      }

      if (key.length !== 1 || !/[a-zA-Z]/.test(key)) {
        console.log("Not a letter", key);
        return;
      }

      if (fullGuess) {
        return;
      }
      this.currentGuess.addNewLetter(key.toUpperCase());
    });
  }

  restartGame() {
    this.startGame(true);
  }

  async startGame(isRestart = false) {
    this.word = await this.wordApi.getRandomWord();
    this.createEmptyBoard();
    if (isRestart) {
      return;
    }
    this.initKeyboard();
  }
}

class WordAPI {
  constructor(apiKey) {
    this.setupAPI(apiKey);
  }

  async getRandomWord() {
    return Promise.resolve("ILUVU");
  }

  setupAPI(apiKey) {
    console.log(`API Key: ${apiKey}`);
  }

  isValidWord(word) {
    if (word.length !== 5) {
      return "Sorry, you must enter a five letter word";
    }
    if (word === "DEBUG") {
      return "Sorry, this word was not found in our dictionary";
    }
    return "";
  }
}

document.body.onload = () => {
  const API_KEY = "";
  new Game(new WordAPI());
};

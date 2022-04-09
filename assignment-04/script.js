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

  debugEvaluate(correctAnswer) {
    const correctAnswerLetters = correctAnswer.split("");
    const letterInWord = correctAnswerLetters.filter((l) => letter.letter);
    if (letterInWord.length === 0) {
      return { state: 0 };
    }

    if (letterInWord.length === 1) {
      const state = correctAnswerLetters[idx] === letter.letter ? 2 : 1;
      return { state };
    }
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
  constructor(index, letters) {
    this.index = index;
    this.letterCount = 0;
    if (letters) {
      this.letters = letters;
      return;
    }

    const emptyWord = [];
    for (let i = 0; i < 5; i++) {
      emptyWord.push(new Letter());
    }
    this.letters = emptyWord;
  }

  getGuessWord() {
    return this.letters.reduce((word, letter) => (word += letter.letter), "");
  }

  debugEvaluate(correctAnswer) {
    const correctAnswerLetters = correctAnswer.split("");
    const guessLetters = this.letters.map((l) => l.letter);
    let letterState = new Array(5).fill({ state: 0 });

    // check for green letters; remove them from the comparison arrays
    guessLetters.forEach((letter, idx) => {
      if (letter === correctAnswerLetters[idx]) {
        correctAnswerLetters[idx] = "";
        guessLetters[idx] = "";
        letterState[idx] = { state: 2 };
      }
    });

    // check for yellow letters and remove them from the comparison arrays
    guessLetters.forEach((letter, idx) => {
      if (letter === "") {
        return;
      }
      const correctLetterIndex = correctAnswerLetters.findIndex((l) => l === letter);
      if (correctLetterIndex !== -1) {
        correctAnswerLetters[correctLetterIndex] = "";
        guessLetters[idx] = "";
        letterState[idx] = { state: 1 };
      }
    });

    return letterState;
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

  async enableDebugMode() {
    const letters = this.correctAnswer.split("").map((l) => new Letter(l));
    const correctGuess = new Guess(-1, letters);

    const $debugMsg = document.createElement("p");
    $debugMsg.className = "debug-msg";
    $debugMsg.innerHTML = "Debug Mode Active - Correct Answer:";

    const $answerRow = correctGuess.generateElement();
    $answerRow.className = "row row-answer";
    this.$gameBoard.querySelector(".btn-debug").remove();
    this.$gameBoard.prepend($debugMsg, $answerRow);
  }

  addDebugModeButton() {
    const $debugBtn = document.createElement("button");
    $debugBtn.innerHTML = "Enable Debug Mode";
    $debugBtn.className = "btn-debug";
    $debugBtn.addEventListener("click", () => this.enableDebugMode());
    this.$gameBoard.appendChild($debugBtn);
  }
  createEmptyBoard() {
    this.$gameBoard.innerHTML = "";
    this.addDebugModeButton();
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
    const validatedGuess = await this.wordApi.validateWord(guessWord);
    if (validatedGuess.error) {
      alert(validatedGuess.error);
      return;
    }
    this.updateGuessedLetters(this.currentGuess.letters);

    const evaluatedGuess = this.currentGuess.debugEvaluate(this.correctAnswer);
    const isCorrect = this.currentGuess.evaluate(evaluatedGuess);
    if (isCorrect) {
      setTimeout(() => {
        this.endGame(`Congratulations, you guessed the word ${guessWord} correctly`);
      }, 0);
      return;
    }
    if (this.guessIndex === 5) {
      const correctWord = this.correctAnswer;
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
    this.correctAnswer = this.word;
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

  async startGame() {
    const response = await fetch(`${this.baseUrl}/start_game/`, {
      method: "POST",
    }).then((res) => res.json());
    this.id = response.id;
    this.key = response.key;
    this.wordId = response.wordID;
    return response;
  }

  async getRandomWord() {
    await this.startGame();
    const gameResult = await fetch(`${this.baseUrl}/finish_game/`, {
      method: "POST",
      body: JSON.stringify({
        id: this.id,
        key: this.key,
      }),
    }).then((res) => res.json());
    return gameResult.answer;
  }

  async validateWord(word) {
    if (word.length !== 5) {
      return {
        error: "Sorry, you must enter a five letter word",
      };
    }

    const wordDefinition = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
      method: "GET",
    }).then((res) => res.json());

    if (wordDefinition?.title === "No Definitions Found") {
      return {
        error: "Sorry, this is not a valid word, please try a new guess",
      };
    }

    return wordDefinition;
  }
}

document.body.onload = () => {
  const API_KEY = "";
  new Game(new WordAPI());
};

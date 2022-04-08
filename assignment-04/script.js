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
    console.log(lettersGuessed, this.letter);
    if (lettersGuessed.includes(this.letter)) {
      console.log(lettersGuessed[this.index], this.letter);
      if (lettersGuessed[this.index] === this.letter) {
        this.isCorrect = true;
      } else {
        this.isInWord = true;
      }
    }
  }
}

class Word {
  constructor() {
    this.letters = [];
  }

  get() {
    if (this.word) {
      return this.word;
    }

    this.word = "ILUVU".toUpperCase();
    this.letters = this.word.split("").map((ltr, idx) => new Letter(ltr, idx));
    return this.word;
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
    return this.letters.reduce((word, letter) => (word += letter));
  }

  evaluate(correctWord) {
    if (this.getGuessWord() === correctWord) {
      return true;
    }

    this.letters.forEach((letter) => {
      letter.evaluate(correctWord);
    });
    this.updateRow();
    return false;
  }

  isFull() {
    return this.letterCount === 5;
  }

  updateRow() {
    this.$row.innerHTML = this.getRow().join("");
  }

  removeLastLetter() {
    console.log(this.letters);
    const length = this.letters.length;
    this.letters.splice(length, 1);
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
  constructor() {
    this.$gameBoard = document.getElementById("game-board");
    this.guesses = [1, 2, 3, 4, 5, 6].map((idx) => new Guess(idx));
    this.guessIndex = 0;
    this.currentGuess = this.guesses[0];
    this.startGame();
  }

  createEmptyBoard() {
    this.guesses.forEach((guess) => {
      const $el = guess.generateElement();
      this.$gameBoard.appendChild($el);
    });
  }

  goToNextGuess() {
    this.guessIndex++;
    this.currentGuess = this.guesses[this.guessIndex];
  }

  initKeyboard() {
    document.body.addEventListener("keyup", (e) => {
      const key = e.key;
      const fullGuess = this.currentGuess.isFull();

      if (key === "Enter") {
        if (fullGuess) {
          const isCorrect = this.currentGuess.evaluate(this.word.get());
          if (isCorrect) {
            alert("Congratulations, you guessed the word correctly!");
            return;
          }
          this.goToNextGuess();
          return;
        }

        alert("You must enter 5 letters before submitting!");
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

  startGame() {
    this.word = new Word();
    this.initKeyboard();
    this.createEmptyBoard();
    this.word.get();
  }
}

document.body.onload = () => {
  new Game();
};

class Letter {
  constructor(letter) {
    this.letter = letter;
    this.isCorrect = false;
    this.isInWord = false;
  }
  generateElement() {
    const $letterEl = document.createElement("li");
    $letterEl.classList.add("letter");
    if (this.isCorrect) {
      $letterEl.classList.add("letter-correct");
    }
    if (this.isInWord) {
      $letterEl.classList.add("letter-inword");
    }
    $letterEl.innerHTML = this.letter;
    return $letterEl;
  }
  evalute() {}
}

class Word {
  constructor() {
    this.word = "ILUVU";
    this.letters = this.word.split("").map((ltr) => new Letter(ltr));
  }

  generateElement() {
    const lettersList = this.letters.map((letter) => letter.generateElement().outerHTML);
    const $el = document.createElement("ul");
    $el.className = "row";
    $el.innerHTML = lettersList.join("");
    return $el;
  }

  evaluate(wordGuess) {
    if (wordGuess.toUpperCase() === this.word) {
      return true;
    }

    this.letters.forEach((letter) => {
      letter.evalute(this.word);
    });
  }
}

class Game {
  constructor() {
    this.$gameBoard = document.getElementById("game-board");
    this.startGame();
  }

  createNewRow() {
    const $wordEl = this.word.generateElement();
    console.log($wordEl);
    this.$gameBoard.appendChild($wordEl);
  }

  validateWordEntry(word) {
    if (word.length !== 5) {
      alert("Your word entry must be 5 letters! Try again");
      return false;
    }
    return true;
  }

  initForm() {
    console.log("init form");
    const $form = this.$gameBoard.querySelector("form");
    $form.addEventListener("submit", (e) => {
      e.preventDefault();
      const $input = this.$form.querySelector("input");
      const value = $input.value;
      if (!this.validateWordEntry(value)) {
        return;
      }
      this.word.evalute(value);
    });
  }

  startGame() {
    this.word = new Word();
    this.createNewRow();
    // this.initForm();
  }
}

document.body.onload = () => {
  new Game();
};

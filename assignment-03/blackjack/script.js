class Card {
  SUITS = {
    0: '<img class="suit" src="./heart.svg" />',
    1: '<img class="suit" src="./spade.svg" />',
    2: '<img class="suit" src="./diamond.svg" />',
    3: '<img class="suit" src="./clubs.svg" />',
  };
  FACE_CARDS = {
    1: "A",
    11: "J",
    12: "Q",
    13: "K",
  };

  constructor(cardValue, suitValue) {
    this.cardValue = cardValue;
    this.suit = suitValue;
    this.color = this.getColor();
    this.blackjackValue = this.getBlackjackValue();
    this.display = this.getDisplay();
  }

  getColor() {
    if (this.suit === 0 || this.suit === 2) {
      return "red";
    }
    return "black";
  }

  getBlackjackValue() {
    if (this.cardValue < 11) {
      return this.cardValue;
    } else return 10;
  }

  getValueDisplay() {
    const cardValue = this.FACE_CARDS[this.cardValue];
    if (cardValue) {
      return cardValue;
    }
    return this.cardValue;
  }

  getSuitDisplay() {
    return this.SUITS[this.suit];
  }

  getDisplay() {
    return this.getValueDisplay() + this.getSuitDisplay();
  }
}

class Hand {
  constructor($container, hideFirst) {
    this.$container = $container;
    this.cards = [];
    $container.innerHTML = "";
  }

  appendCardToDOM(newCard, hidden) {
    const $newCardDiv = document.createElement("div");
    $newCardDiv.classList.add("card");
    $newCardDiv.classList.add(newCard.color);
    if (hidden) {
      $newCardDiv.classList.add("placeholder");
    }
    $newCardDiv.innerHTML = newCard.display;
    this.$container.appendChild($newCardDiv);
  }

  async deal(hideFirst) {
    await this.dealNewCard(hideFirst ? true : false);
    await this.dealNewCard();
  }

  dealNewCard(hidden) {
    const cardValue = Math.ceil(Math.random() * 13);
    const suitValue = Math.floor(Math.random() * 4);
    const newCard = new Card(cardValue, suitValue);
    this.cards.push(newCard);
    return new Promise((resolve) => {
      this.appendCardToDOM(newCard, hidden);
      resolve();
    });
  }

  isSoft(cards = this.cards) {
    return cards.some((card) => card.cardValue === 1) && this.getScore() < 12;
  }

  getScore(cards = this.cards) {
    return cards.reduce((prev, curr) => prev + curr.blackjackValue, 0);
  }

  getFinalScore(score = this.getScore()) {
    if (this.isSoft(this.cards)) {
      score += 10;
    }
    return score;
  }

  checkForBust() {
    return this.getFinalScore() > 21;
  }
}

class DealerHand extends Hand {
  async deal() {
    await super.deal(true);
    this.visibleHand = this.cards.slice(1);
  }

  showFirstCard() {
    const $cards = this.$container.querySelectorAll(".card");
    $cards[0].classList.remove("placeholder");
    this.visibleHand = this.cards;
  }

  isSoft(cards = this.visibleHand) {
    return super.isSoft(cards);
  }

  getScore(cards = this.visibleHand) {
    return super.getScore(cards);
  }

  getFinalScore() {
    return super.getFinalScore(this.getScore(this.cards));
  }
}

class BlackjackGame {
  constructor() {
    this.cashBalance = 10000;
    this.currentBet = 50;
    this.$cashDisplay = document.getElementById("player-cash");
    this.$betForm = document.getElementById("player-bet-form");
    this.$hitButton = document.getElementById("game-button-hit");
    this.$stayButton = document.getElementById("game-button-stay");
    this.$dealerScore = document.getElementById("dealer-score");
    this.$playerScore = document.getElementById("player-score");
    this.$gameStatus = document.getElementById("game-status");
    this.initActions();
  }

  enableBetForm() {
    const $inputEl = this.$betForm.querySelector("input");
    $inputEl.disabled = false;
    const $btnEl = this.$betForm.querySelector("button");
    $btnEl.disabled = false;
  }
  disableBetForm() {
    const $inputEl = this.$betForm.querySelector("input");
    $inputEl.disabled = true;
    const $btnEl = this.$betForm.querySelector("button");
    $btnEl.disabled = true;
  }

  enableGameButtons() {
    this.$hitButton.disabled = false;
    this.$stayButton.disabled = false;
  }
  disableGameButtons() {
    this.$hitButton.disabled = true;
    this.$stayButton.disabled = true;
  }

  async dealDealerCards() {
    const $dealerHand = document.getElementById("dealer-hand");
    this.dealerHand = new DealerHand($dealerHand);
    await this.dealerHand.deal();
  }

  async dealPlayerCards() {
    const $playerHand = document.getElementById("player-hand");
    this.playerHand = new Hand($playerHand);
    await this.playerHand.deal();
  }

  updateCashBalanceDisplay() {
    const convertedBalance = (this.cashBalance / 100).toFixed(2);
    this.$cashDisplay.innerHTML = convertedBalance;
  }

  updateScoreDisplay(useFinal = false) {
    if (useFinal) {
      this.$dealerScore.innerHTML = this.dealerHand.getFinalScore();
      this.$playerScore.innerHTML = this.playerHand.getFinalScore();
    } else {
      const dealerScore = this.dealerHand.getScore();
      this.$dealerScore.innerHTML = this.dealerHand.isSoft() ? `${dealerScore + 10} (Soft)` : dealerScore;
      const playerScore = this.playerHand.getScore();
      this.$playerScore.innerHTML = this.playerHand.isSoft() ? `${playerScore + 10} (Soft)` : playerScore;
    }
  }

  endHand(playerWinnings, statusMsg) {
    this.disableGameButtons();
    this.dealerHand.showFirstCard();
    this.updateScoreDisplay(true);
    this.setGameStatus(statusMsg);
    this.cashBalance += playerWinnings;
    this.updateCashBalanceDisplay();
    this.enableBetForm();
  }

  setGameStatus(msg) {
    this.$gameStatus.innerHTML = msg;
  }

  declarePush() {
    const msg = "Hand is a push!";
    this.endHand(0, msg);
  }

  declareWin(isBlackjack) {
    const msg = isBlackjack ? "Blackjack!" : "Congratulations, you won!";
    const winnings = isBlackjack ? this.currentBet * 1.5 : this.currentBet;
    this.endHand(winnings, msg);
  }

  declareDealerWin() {
    const msg = "Sorry, the dealer won!";
    this.endHand(-this.currentBet, msg);
  }

  declareBust() {
    const msg = "Sorry, Bust!";
    this.endHand(-this.currentBet, msg);
  }

  declareDealerBust() {
    const msg = "Congratulations you won! (Dealer Bust)";
    this.endHand(this.currentBet, msg);
  }

  checkWinner() {
    const dealerScore = this.dealerHand.getFinalScore();
    const playerScore = this.playerHand.getScore();

    if (playerScore > dealerScore) {
      this.declareWin();
    } else if (dealerScore > playerScore) {
      this.declareDealerWin();
    } else {
      this.declarePush();
    }
  }

  async startHand() {
    this.disableBetForm();
    this.setGameStatus("");
    await this.dealDealerCards();
    await this.dealPlayerCards();

    const isDealerBlackjack = this.dealerHand.getFinalScore() === 21;
    const isPlayerBlackjack = this.playerHand.getFinalScore() === 21;

    if (isDealerBlackjack && isPlayerBlackjack) {
      this.declarePush();
      return;
    }
    if (isPlayerBlackjack) {
      this.declareWin(true);
      return;
    }
    if (isDealerBlackjack) {
      this.declareDealerWin();
      return;
    }
    this.enableGameButtons();
    this.updateScoreDisplay();
  }

  submitBet() {
    this.disableBetForm();
    this.startHand();
  }

  initBetForm() {
    this.$betForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submitBet();
    });

    this.$betForm.querySelector("input").addEventListener("change", (e) => {
      this.currentBet = parseFloat(e.target.value) * 100;
    });
  }

  dealerTurn() {
    this.dealerHand.showFirstCard();

    while (this.dealerHand.getFinalScore() < 17) {
      this.dealerHand.dealNewCard();
      this.updateScoreDisplay(true);
    }
    if (this.dealerHand.checkForBust()) {
      this.declareDealerBust();
      return;
    }
    this.checkWinner();
  }

  initGameButtons() {
    this.$hitButton.addEventListener("click", async () => {
      await this.playerHand.dealNewCard();
      this.updateScoreDisplay();
      if (this.playerHand.checkForBust()) {
        this.declareBust();
      }
    });
    this.$stayButton.addEventListener("click", () => {
      this.updateScoreDisplay(true);
      this.dealerTurn();
    });
  }

  initActions() {
    this.initBetForm();
    this.initGameButtons();
  }
}

document.body.onload = () => {
  new BlackjackGame();
};

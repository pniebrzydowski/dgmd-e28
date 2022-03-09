class Card {
  SUITS = {
    0: "H",
    1: "S",
    2: "D",
    3: "C",
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
  constructor($container) {
    this.$container = $container;
    this.cards = [];
    this.dealNewCard();
    this.dealNewCard();
    $container.innerHTML = "";
  }

  appendCardToDOM(newCard) {
    const $newCardDiv = document.createElement("div");
    $newCardDiv.classList.add("card");
    $newCardDiv.classList.add(newCard.color);
    $newCardDiv.innerHTML = newCard.display;
    setTimeout(() => {
      this.$container.appendChild($newCardDiv);
    }, 0);
  }

  dealNewCard() {
    const cardValue = Math.ceil(Math.random() * 13);
    const suitValue = Math.floor(Math.random() * 4);
    const newCard = new Card(cardValue, suitValue);
    this.cards.push(newCard);
    this.appendCardToDOM(newCard);
  }

  getScore(cards = this.cards) {
    return cards.reduce((prev, curr) => prev + curr.blackjackValue, 0);
  }
}

class DealerHand extends Hand {
  getScore() {
    const [firstCard, ...visibleHand] = this.cards;
    return super.getScore(visibleHand);
  }
  getFinalScore = () => super.getScore();
}

class BlackjackGame {
  constructor() {
    this.cashBalance = 10000;
    this.currentBet = 25;
    this.$cashDisplay = document.getElementById("player-cash");
    this.$betForm = document.getElementById("player-bet-form");
    this.$hitButton = document.getElementById("game-button-hit");
    this.$stayButton = document.getElementById("game-button-stay");
    this.$dealerScore = document.getElementById("dealer-score");
    this.$playerScore = document.getElementById("player-score");
    this.initActions();
  }

  enableBetForm() {
    this.$betForm.querySelectorAll("input, button", () => {
      ($el) => ($el.disabled = false);
    });
  }
  disableBetForm() {
    this.$betForm.querySelectorAll("input, button", () => {
      ($el) => ($el.disabled = true);
    });
  }

  enableGameButtons() {
    this.$hitButton.disabled = false;
    this.$stayButton.disabled = false;
  }
  disableGameButtons() {
    this.$hitButton.disabled = true;
    this.$stayButton.disabled = true;
  }

  dealDealerCards() {
    const $dealerHand = document.getElementById("dealer-hand");
    this.dealerHand = new DealerHand($dealerHand);
  }

  dealPlayerCards() {
    const $playerHand = document.getElementById("player-hand");
    this.playerHand = new Hand($playerHand);
  }

  updateCashBalanceDisplay() {
    const convertedBalance = (this.cashBalance / 100).toFixed(2);
    this.$cashDisplay.innerHTML = convertedBalance;
  }

  updateScoreDisplay() {
    console.log(this.dealerHand, this.playerHand);
    this.$dealerScore.innerHTML = this.dealerHand.getScore();
    this.$playerScore.innerHTML = this.playerHand.getScore();
  }

  endHand(playerWinnings, statusMsg) {
    this.disableGameButtons();
    // this.showDealerHand();
    this.setGameStatus(statusMsg);
    this.cashBalance += playerWinnings;
    this.updateCashBalanceDisplay();
    this.enableBetForm();
  }

  setGameStatus(msg) {
    console.log(msg);
  }

  declarePush() {
    const msg = "Hand is a push!";
    this.endHand(0, msg);
  }

  declareWin(isBlackjack) {
    const msg = "Congratulations, you won!";
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

  checkWinner() {
    const dealerScore = this.dealerHand.getFinalScore();
    const playerScore = this.playerHand.getScore();
    console.log(playerScore, dealerScore);
    if (playerScore > dealerScore) {
      this.declareWin();
    } else if (dealerScore > playerScore) {
      this.declareDealerWin();
    } else {
      this.declarePush();
    }
  }

  startHand() {
    this.dealDealerCards();
    this.dealPlayerCards();
    const isDealerBlackjack = this.dealerHand.getScore() === 21;
    const isPlayerBlackjack = this.playerHand.getScore() === 21;
    if (isDealerBlackjack && isPlayerBlackjack) {
      this.declarePush();
      return;
    }
    if (isPlayerBlackjack) {
      this.declareWin(true);
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
  }

  initGameButtons() {
    this.$hitButton.addEventListener("click", () => {
      console.log("hit");
    });
    this.$stayButton.addEventListener("click", () => {
      console.log("stay");
      this.checkWinner();
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

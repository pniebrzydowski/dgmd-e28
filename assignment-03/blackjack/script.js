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
    this.blackjackValue = this.getBlackjackValue();
    this.display = this.getDisplay();
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
    $newCardDiv.innerHTML = newCard.display;
    this.$container.appendChild($newCardDiv);
  }

  dealNewCard() {
    const cardValue = Math.ceil(Math.random() * 13);
    const suitValue = Math.floor(Math.random() * 4);
    const newCard = new Card(cardValue, suitValue);
    this.cards.push(newCard);
    this.appendCardToDOM(newCard);
  }

  getScore() {
    this.cards.reduce((prev, curr) => prev.blackjackValue + curr.blackjackValue, 0);
  }
}

class BlackjackGame {
  constructor() {
    this.cashBalance = 10000;
    this.currentBet = 25;
    this.$cashDisplay = document.getElementById("player-cash");
    this.$betForm = document.getElementById("player-bet-form");
    this.$hitButton = document.getElementById("game-button-hit");
    this.$stayButton = document.getElementById("game-button-stay");
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
    this.dealerHand = new Hand($dealerHand);
  }

  dealPlayerCards() {
    const $playerHand = document.getElementById("player-hand");
    this.playerHand = new Hand($playerHand);
  }

  updateCashBalanceDisplay() {
    const convertedBalance = (this.cashBalance / 100).toFixed(2);
    this.$cashDisplay.innerHTML = convertedBalance;
  }

  endHand(playerWinnings, statusMsg) {
    this.disableGameButtons();
    this.showDealerHand();
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

  declareWin() {
    const msg = "Congratulations, you won!";
    this.endHand(this.currentBet, msg);
  }

  declareDealerWin() {
    const msg = "Sorry, the dealer won!";
    this.endHand(-this.currentBet, msg);
  }

  declareBust() {
    const msg = "Sorry, Bust!";
    this.endHand(-this.currentBet, msg);
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
      this.declareWin();
      return;
    }
    this.enableGameButtons();
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
      if (this.dealerScore === 0) {
        return;
      }
    });
    this.$stayButton.addEventListener("click", () => {
      if (this.dealerScore === 0) {
        return;
      }
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

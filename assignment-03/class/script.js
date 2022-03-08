class Order {
  constructor() {
    this.itemPrices = {
      "hot dogs": 400,
      fries: 350,
      soda: 150,
      sauerkraut: 100,
    };
  }

  showOrder(totalPrice, orderSummary) {
    this.$orderSummary.innerHTML = orderSummary.join(", ");
    this.$totalPrice.innerHTML = `$${(totalPrice / 100).toFixed(2)}`;
    this.$orderReview.classList.remove("hidden");
  }

  resetOrderDisplay() {
    this.$orderSummary.innerHTML = "";
    this.$totalPrice.innerHTML = "";
    this.$orderReview.classList.add("hidden");
  }

  getInputFields() {
    const $form = this.$orderForm;
    return {
      hotdog: $form.querySelector("input[name=hotdog]"),
      fries: $form.querySelector("input[name=fries]"),
      soda: $form.querySelector("input[name=soda]"),
      sauerkraut: $form.querySelector("input[name=sauerkraut]"),
    };
  }

  calculateOrder() {
    const inputs = this.getInputFields();
    const orderQuantities = {
      "hot dogs": parseInt(inputs.hotdog.value, 10),
      fries: parseInt(inputs.fries.value, 10),
      soda: parseInt(inputs.soda.value, 10),
      sauerkraut: parseInt(inputs.sauerkraut.value, 10),
    };

    let totalPrice = 0;
    let orderSummary = [];

    for (let key in this.itemPrices) {
      totalPrice += orderQuantities[key] * this.itemPrices[key];
      if (orderQuantities[key] > 0) {
        orderSummary.push(`${key}: ${orderQuantities[key]}`);
      }
    }

    this.showOrder(totalPrice, orderSummary);
  }

  resetOrder() {
    const inputs = this.getInputFields();
    for (let key in inputs) {
      inputs[key].value = 0;
    }
    this.resetOrderDisplay();
  }

  init($form) {
    this.$orderForm = $form;
    this.$orderReview = document.getElementById("order-review");
    this.$orderSummary = document.getElementById("order-summary");
    this.$totalPrice = document.getElementById("total-price");

    this.$orderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.calculateOrder();
    });

    const $resetBtn = document.getElementById("reset-btn");
    $resetBtn.addEventListener("click", () => this.resetOrder());
  }
}

document.body.onload = () => {
  const order = new Order();
  const $orderForm = document.getElementById("order-form");
  order.init($orderForm);
};

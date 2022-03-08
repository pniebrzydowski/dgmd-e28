const createOrder = ($orderForm) => {
  const itemPrices = {
    "hot dogs": 400,
    fries: 350,
    soda: 150,
    sauerkraut: 100,
  };

  const $orderReview = document.getElementById("order-review");
  const $orderSummary = document.getElementById("order-summary");
  const $totalPrice = document.getElementById("total-price");

  const inputs = {
    hotdog: $orderForm.querySelector("input[name=hotdog]"),
    fries: $orderForm.querySelector("input[name=fries]"),
    soda: $orderForm.querySelector("input[name=soda]"),
    sauerkraut: $orderForm.querySelector("input[name=sauerkraut]"),
  };

  $orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    calculateOrder();
  });

  const resetOrder = () => {
    for (let key in inputs) {
      inputs[key].value = 0;
    }
    resetOrderDisplay();
  };

  const $resetBtn = document.getElementById("reset-btn");
  $resetBtn.addEventListener("click", resetOrder);

  const showOrder = (totalPrice, orderSummary) => {
    $orderSummary.innerHTML = orderSummary.join(", ");
    $totalPrice.innerHTML = `$${(totalPrice / 100).toFixed(2)}`;
    $orderReview.classList.remove("hidden");
  };

  const resetOrderDisplay = () => {
    $orderSummary.innerHTML = "";
    $totalPrice.innerHTML = "";
    $orderReview.classList.add("hidden");
  };

  const calculateOrder = () => {
    const orderQuantities = {
      "hot dogs": parseInt(inputs.hotdog.value, 10),
      fries: parseInt(inputs.fries.value, 10),
      soda: parseInt(inputs.soda.value, 10),
      sauerkraut: parseInt(inputs.sauerkraut.value, 10),
    };

    let totalPrice = 0;
    let orderSummary = [];

    for (let key in itemPrices) {
      totalPrice += orderQuantities[key] * itemPrices[key];
      if (orderQuantities[key] > 0) {
        orderSummary.push(`${key}: ${orderQuantities[key]}`);
      }
    }

    showOrder(totalPrice, orderSummary);
  };
};

document.body.onload = () => {
  const $orderForm = document.getElementById("order-form");
  createOrder($orderForm);
};

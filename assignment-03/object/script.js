const itemPrices = {
  "hot dogs": 400,
  fries: 350,
  soda: 150,
  sauerkraut: 100,
};

const showOrder = (totalPrice, orderSummary) => {
  const $orderReview = document.getElementById("order-review");
  const $orderSummary = document.getElementById("order-summary");
  const $totalPrice = document.getElementById("total-price");

  if (undefined === totalPrice) {
    // reset condition
    $orderSummary.innerHTML = "";
    $totalPrice.innerHTML = "";
    $orderReview.classList.add("hidden");
    return;
  }

  $orderSummary.innerHTML = orderSummary.join(", ");
  $totalPrice.innerHTML = `$${(totalPrice / 100).toFixed(2)}`;
  $orderReview.classList.remove("hidden");
};

const resetOrderDisplay = () => showOrder();

const getInputFields = ($form) => {
  return {
    hotdog: $form.querySelector("input[name=hotdog]"),
    fries: $form.querySelector("input[name=fries]"),
    soda: $form.querySelector("input[name=soda]"),
    sauerkraut: $form.querySelector("input[name=sauerkraut]"),
  };
};

const calculateOrder = ($form) => {
  const inputs = getInputFields($form);
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

const resetOrder = ($form) => {
  const inputs = getInputFields($form);
  for (let key in inputs) {
    inputs[key].value = 0;
  }
  resetOrderDisplay();
};

const initForm = () => {
  const $orderForm = document.getElementById("order-form");
  $orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    calculateOrder($orderForm);
  });
  const $resetBtn = document.getElementById("reset-btn");
  $resetBtn.addEventListener("click", () => resetOrder($orderForm));
};

document.body.onload = initForm;

function calculateDeliveryFee(distance, weight) {
  if (distance < 0 || weight < 0) {
    throw new Error('Distance and weight must be positive');
  }
  if (distance > 10) {
    throw new Error('Delivery outside of zone');
  }

  let fee = 2.00;

  if (distance > 3) {
    fee += (distance - 3) * 0.50;
  }

  if (weight > 5) {
    fee += 1.50;
  }

  return fee;
}

module.exports = {
  calculateDeliveryFee
};

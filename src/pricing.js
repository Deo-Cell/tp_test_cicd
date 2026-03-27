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

function applyPromoCode(subtotal, promoCode, promoCodes) {
  if (subtotal < 0) throw new Error('Subtotal cannot be negative');
  if (!promoCode || promoCode.trim() === '') return subtotal;

  const promo = promoCodes.find((p) => p.code === promoCode);
  if (!promo) throw new Error('Invalid promo code');

  const expirationDate = new Date(promo.expiresAt);
  expirationDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (expirationDate < today) {
    throw new Error('Promo code is expired');
  }

  if (subtotal < promo.minOrder) {
    throw new Error('Minimum order amount not reached');
  }

  let discount = 0;
  if (promo.type === 'percentage') {
    discount = subtotal * (promo.value / 100);
  } else if (promo.type === 'fixed') {
    discount = promo.value;
  }

  return Math.max(0, subtotal - discount);
}

module.exports = {
  calculateDeliveryFee,
  applyPromoCode
};

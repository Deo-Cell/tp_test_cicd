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

function calculateSurge(hour, dayOfWeek) {
  if (hour < 10 || hour >= 23) {
    throw new Error('Restaurant is closed');
  }

  const day = dayOfWeek.toLowerCase();
  let surge = 1.0;

  if (day === 'sunday') {
    surge = 1.2;
  }

  // Déjeuner : 11h30 (11.5) à 14h00 (non-inclus, donc 14h = fin)
  if (hour >= 11.5 && hour < 14) {
    surge = Math.max(surge, 1.3);
  }

  // Dîner : 19h00 à 22h00
  if (hour >= 19 && hour <= 22) {
    if (day === 'friday' || day === 'saturday') {
      surge = Math.max(surge, 1.8);
    } else {
      surge = Math.max(surge, 1.5);
    }
  }

  return surge;
}

module.exports = {
  calculateDeliveryFee,
  applyPromoCode,
  calculateSurge
};

const globalPromoCodes = [
  { code: 'BIENVENUE20', type: 'percentage', value: 20, minOrder: 15.00, expiresAt: '2026-12-31' },
  { code: 'MINUS5', type: 'fixed', value: 5, minOrder: 20.00, expiresAt: '2026-12-31' },
  { code: 'EXPIRED10', type: 'percentage', value: 10, minOrder: 10.00, expiresAt: '2024-01-01' }
];

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

function calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek) {
  if (!items || items.length === 0) throw new Error('Cart is empty');
  
  let subtotal = 0;
  for (const item of items) {
    if (item.price < 0) throw new Error('Item price cannot be negative');
    if (item.quantity > 0) {
      subtotal += item.price * item.quantity;
    }
  }

  subtotal = Math.round(subtotal * 100) / 100;

  let discount = 0;
  if (promoCode) {
    const discountedTotal = applyPromoCode(subtotal, promoCode, globalPromoCodes);
    discount = subtotal - discountedTotal;
  }

  const baseDeliveryFee = calculateDeliveryFee(distance, weight);
  const surge = calculateSurge(hour, dayOfWeek);

  const finalDeliveryFee = Math.round((baseDeliveryFee * surge) * 100) / 100;
  const total = Math.round((subtotal - discount + finalDeliveryFee) * 100) / 100;

  return {
    subtotal: subtotal,
    discount: Math.round(discount * 100) / 100,
    deliveryFee: finalDeliveryFee,
    surge: surge,
    total: total
  };
}

module.exports = {
  calculateDeliveryFee,
  applyPromoCode,
  calculateSurge,
  calculateOrderTotal,
  globalPromoCodes
};

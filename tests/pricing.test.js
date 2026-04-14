const { calculateDeliveryFee, applyPromoCode, calculateSurge, calculateOrderTotal } = require('../src/pricing');

describe('calculateDeliveryFee', () => {
  test('should return base fee for short distance and low weight', () => {
    // Arrange
    const distance = 2;
    const weight = 1;
    // Act
    const result = calculateDeliveryFee(distance, weight);
    // Assert
    expect(result).toBe(2.00);
  });

  test('should add extra distance fee for distance > 3km', () => {
    // Arrange
    const distance = 6;
    const weight = 2;
    // Act
    const result = calculateDeliveryFee(distance, weight);
    // Assert
    expect(result).toBe(3.50);
  });

  test('should add extra weight fee for weight > 5kg and extra distance', () => {
    // Arrange
    const distance = 10;
    const weight = 6;
    // Act
    const result = calculateDeliveryFee(distance, weight);
    // Assert
    expect(result).toBe(7.00);
  });

  test('should return base fee for exactly 3km (no distance supplement)', () => {
    // Arrange
    const distance = 3;
    const weight = 2;
    // Act
    const result = calculateDeliveryFee(distance, weight);
    // Assert
    expect(result).toBe(2.00);
  });

  test('should calculate fee up to exactly 10km', () => {
    // Arrange
    const distance = 10;
    const weight = 2;
    // Act
    const result = calculateDeliveryFee(distance, weight);
    // Assert
    expect(result).toBe(5.50);
  });

  test('should not add weight supplement for exactly 5kg', () => {
    // Arrange
    const distance = 2;
    const weight = 5;
    // Act
    const result = calculateDeliveryFee(distance, weight);
    // Assert
    expect(result).toBe(2.00);
  });

  test('should throw error for distance > 10km (hors zone)', () => {
    // Arrange
    const distance = 15;
    const weight = 2;
    // Act & Assert
    expect(() => calculateDeliveryFee(distance, weight)).toThrow('Delivery outside of zone');
  });

  test('should throw error for negative distance', () => {
    // Arrange
    const distance = -1;
    const weight = 2;
    // Act & Assert
    expect(() => calculateDeliveryFee(distance, weight)).toThrow('Distance and weight must be positive');
  });

  test('should throw error for negative weight', () => {
    // Arrange
    const distance = 3;
    const weight = -1;
    // Act & Assert
    expect(() => calculateDeliveryFee(distance, weight)).toThrow('Distance and weight must be positive');
  });

  test('should return base fee for distance 0', () => {
    // Arrange
    const distance = 0;
    const weight = 2;
    // Act
    const result = calculateDeliveryFee(distance, weight);
    // Assert
    expect(result).toBe(2.00);
  });
});

describe('applyPromoCode', () => {
  const promoCodes = [
    { code: 'BIENVENUE20', type: 'percentage', value: 20, minOrder: 15.00, expiresAt: '2026-12-31' },
    { code: 'MINUS5', type: 'fixed', value: 5, minOrder: 20.00, expiresAt: '2026-12-31' },
    { code: 'EXPIRED10', type: 'percentage', value: 10, minOrder: 10.00, expiresAt: '2024-01-01' },
    { code: 'TODAY', type: 'fixed', value: 2, minOrder: 5.00, expiresAt: '2025-05-15' },
    { code: 'FREE100', type: 'percentage', value: 100, minOrder: 0, expiresAt: '2026-12-31' },
    { code: 'FIXED10', type: 'fixed', value: 10, minOrder: 0, expiresAt: '2026-12-31' },
  ];

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-15T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should apply percentage code 20% on 50€ returning 40€', () => {
    expect(applyPromoCode(50, 'BIENVENUE20', promoCodes)).toBe(40);
  });

  test('should apply fixed code 5€ on 30€ returning 25€', () => {
    expect(applyPromoCode(30, 'MINUS5', promoCodes)).toBe(25);
  });

  test('should throw error for expired code', () => {
    expect(() => applyPromoCode(50, 'EXPIRED10', promoCodes)).toThrow('Promo code is expired');
  });

  test('should throw error when subtotal is below minOrder', () => {
    expect(() => applyPromoCode(10, 'BIENVENUE20', promoCodes)).toThrow('Minimum order amount not reached');
  });

  test('should throw error when code does not exist', () => {
    expect(() => applyPromoCode(50, 'UNKNOWN', promoCodes)).toThrow('Invalid promo code');
  });

  test('should return 0 when fixed discount is greater than subtotal', () => {
    expect(applyPromoCode(5, 'FIXED10', promoCodes)).toBe(0);
  });

  test('should return 0 when percentage discount is 100%', () => {
    expect(applyPromoCode(50, 'FREE100', promoCodes)).toBe(0);
  });

  test('should accept code expiring today', () => {
    expect(applyPromoCode(10, 'TODAY', promoCodes)).toBe(8);
  });

  test('should return subtotal unchanged when promoCode is null', () => {
    expect(applyPromoCode(50, null, promoCodes)).toBe(50);
  });

  test('should return subtotal unchanged when promoCode is empty string', () => {
    expect(applyPromoCode(50, '', promoCodes)).toBe(50);
  });

  test('should throw error when subtotal is negative', () => {
    expect(() => applyPromoCode(-10, 'BIENVENUE20', promoCodes)).toThrow('Subtotal cannot be negative');
  });

  test('should apply discount even if subtotal is 0 given 0 minOrder', () => {
    expect(applyPromoCode(0, 'FIXED10', promoCodes)).toBe(0);
  });

  test('should return subtotal unchanged if promo type is unknown', () => {
    const unknownTypeCodes = [{ code: 'UNKNOWN', type: 'weird', value: 10, minOrder: 0, expiresAt: '2026-12-31' }];
    expect(applyPromoCode(50, 'UNKNOWN', unknownTypeCodes)).toBe(50);
  });
});

describe('calculateSurge', () => {
  test('should return 1.0 for normal hours (Mardi 15h)', () => {
    // Arrange & Act & Assert
    expect(calculateSurge(15, 'tuesday')).toBe(1.0);
  });
  test('should return 1.3 for lunch time (Mercredi 12h30)', () => {
    expect(calculateSurge(12.5, 'wednesday')).toBe(1.3);
  });
  test('should return 1.5 for normal dinner (Jeudi 20h)', () => {
    expect(calculateSurge(20, 'thursday')).toBe(1.5);
  });
  test('should return 1.8 for weekend dinner (Vendredi 21h)', () => {
    expect(calculateSurge(21, 'friday')).toBe(1.8);
  });
  test('should return 1.2 for sunday non-peak hours (Dimanche 14h)', () => {
    expect(calculateSurge(14, 'sunday')).toBe(1.2);
  });
  test('should return 1.3 for lunch exact start (11.5)', () => {
    expect(calculateSurge(11.5, 'tuesday')).toBe(1.3);
  });
  test('should return 1.5 for dinner exact start (19h)', () => {
    expect(calculateSurge(19, 'tuesday')).toBe(1.5);
  });
  test('should throw error for exact close time (23h)', () => {
    expect(() => calculateSurge(23, 'monday')).toThrow('Restaurant is closed');
  });
  test('should throw error for early morning before open (9h59)', () => {
    expect(() => calculateSurge(9.99, 'monday')).toThrow('Restaurant is closed');
  });
  test('should return 1.0 for exactly open time (10h)', () => {
    expect(calculateSurge(10, 'monday')).toBe(1.0);
  });
});

describe('calculateOrderTotal', () => {
  const items = [{ name: "Pizza", price: 12.50, quantity: 2 }];

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-15T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should process normal complete scenario', () => {
    const result = calculateOrderTotal(items, 5, 2, null, 15, 'tuesday');
    expect(result.subtotal).toBe(25.00);
    expect(result.discount).toBe(0);
    expect(result.deliveryFee).toBe(3.00);
    expect(result.surge).toBe(1.0);
    expect(result.total).toBe(28.00);
  });

  test('should process scenario with promo code', () => {
    const result = calculateOrderTotal(items, 5, 2, 'BIENVENUE20', 15, 'tuesday');
    expect(result.subtotal).toBe(25.00);
    expect(result.discount).toBe(5.00);
    expect(result.deliveryFee).toBe(3.00);
    expect(result.surge).toBe(1.0);
    expect(result.total).toBe(23.00);
  });

  test('should process scenario with surge pricing (vendredi 20h)', () => {
    const result = calculateOrderTotal(items, 5, 2, null, 20, 'friday');
    expect(result.subtotal).toBe(25.00);
    expect(result.discount).toBe(0);
    expect(result.deliveryFee).toBe(5.40); // 3 * 1.8
    expect(result.surge).toBe(1.8);
    expect(result.total).toBe(30.40);
  });

  test('should throw error for empty cart', () => {
    expect(() => calculateOrderTotal([], 5, 2, null, 15, 'tuesday')).toThrow('Cart is empty');
  });

  test('should ignore items with quantity 0', () => {
    const mixedItems = [{ name: 'Pizza', price: 12.5, quantity: 2 }, { name: 'Coke', price: 2, quantity: 0 }];
    const result = calculateOrderTotal(mixedItems, 5, 2, null, 15, 'tuesday');
    expect(result.subtotal).toBe(25.00);
  });

  test('should throw error if item price is negative', () => {
    const badItems = [{ name: 'Pizza', price: -5, quantity: 1 }];
    expect(() => calculateOrderTotal(badItems, 5, 2, null, 15, 'tuesday')).toThrow('Item price cannot be negative');
  });

  test('should throw error when ordering at closed hours', () => {
    expect(() => calculateOrderTotal(items, 5, 2, null, 23, 'tuesday')).toThrow('Restaurant is closed');
  });

  test('should throw error when distance is outside zone', () => {
    expect(() => calculateOrderTotal(items, 15, 2, null, 15, 'tuesday')).toThrow('Delivery outside of zone');
  });

  test('should guarantee structure contains expected keys', () => {
    const result = calculateOrderTotal(items, 5, 2, null, 15, 'tuesday');
    expect(result).toHaveProperty('subtotal');
    expect(result).toHaveProperty('discount');
    expect(result).toHaveProperty('deliveryFee');
    expect(result).toHaveProperty('surge');
    expect(result).toHaveProperty('total');
  });

  test('should combine surge and promo correctly', () => {
    const result = calculateOrderTotal(items, 5, 2, 'BIENVENUE20', 20, 'friday');
    expect(result.total).toBe(25.40); // (25 - 5) = 20 + 5.40
  });
});

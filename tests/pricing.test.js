const { calculateDeliveryFee, applyPromoCode } = require('../src/pricing');

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
});

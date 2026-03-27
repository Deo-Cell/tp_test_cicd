const { calculateDeliveryFee } = require('../src/pricing');

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

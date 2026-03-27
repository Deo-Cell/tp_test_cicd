const { isValidEmail, isValidPassword, isValidAge } = require('../src/validators');

describe('isValidEmail', () => {
  test('should return true when given a standard email', () => {
    // Arrange
    const email = 'user@example.com';
    // Act
    const result = isValidEmail(email);
    // Assert
    expect(result).toBe(true);
  });
  test('should return true when given email with tags and subdomains', () => {
    // Arrange
    const email = 'user.name+tag@domain.co';
    // Act
    const result = isValidEmail(email);
    // Assert
    expect(result).toBe(true);
  });
  test('should return false when given text without @ and .', () => {
    // Arrange
    const email = 'invalid';
    // Act
    const result = isValidEmail(email);
    // Assert
    expect(result).toBe(false);
  });
  test('should return false when missing username', () => {
    // Arrange
    const email = '@domain.com';
    // Act
    const result = isValidEmail(email);
    // Assert
    expect(result).toBe(false);
  });
  test('should return false when missing domain', () => {
    // Arrange
    const email = 'user@';
    // Act
    const result = isValidEmail(email);
    // Assert
    expect(result).toBe(false);
  });
  test('should return false when given empty string', () => {
    // Arrange
    const email = '';
    // Act
    const result = isValidEmail(email);
    // Assert
    expect(result).toBe(false);
  });
  test('should return false when given null', () => {
    // Arrange
    const email = null;
    // Act
    const result = isValidEmail(email);
    // Assert
    expect(result).toBe(false);
  });
});

describe('isValidPassword', () => {
  test('should return valid true when given strong password', () => {
    // Arrange
    const password = 'Passw0rd!';
    // Act
    const result = isValidPassword(password);
    // Assert
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
  test('should return false with multiple errors when password is too short and missing requirements', () => {
    // Arrange
    const password = 'short';
    // Act
    const result = isValidPassword(password);
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });
  test('should return false when uppercase missing', () => {
    // Arrange
    const password = 'alllowercase1!';
    // Act
    const result = isValidPassword(password);
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });
  test('should return false when lowercase missing', () => {
    // Arrange
    const password = 'ALLUPPERCASE1!';
    // Act
    const result = isValidPassword(password);
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });
  test('should return false when numbers missing', () => {
    // Arrange
    const password = 'NoDigits!here';
    // Act
    const result = isValidPassword(password);
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });
  test('should return false when special char missing', () => {
    // Arrange
    const password = 'NoSpecial1here';
    // Act
    const result = isValidPassword(password);
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character (!@#$%^&*)');
  });
  test('should return false when string is empty', () => {
    // Arrange
    const password = '';
    // Act
    const result = isValidPassword(password);
    // Assert
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be a string');
  });
  test('should return false when value is null', () => {
    // Arrange
    const password = null;
    // Act
    const result = isValidPassword(password);
    // Assert
    expect(result.valid).toBe(false);
  });
});

describe('isValidAge', () => {
  test('should return true for normal adult age', () => {
    // Arrange
    const age = 25;
    // Act
    const result = isValidAge(age);
    // Assert
    expect(result).toBe(true);
  });
  test('should return true for age 0', () => {
    // Arrange
    const age = 0;
    // Act
    const result = isValidAge(age);
    // Assert
    expect(result).toBe(true);
  });
  test('should return true for maximum age', () => {
    // Arrange
    const age = 150;
    // Act
    const result = isValidAge(age);
    // Assert
    expect(result).toBe(true);
  });
  test('should return false for negative age', () => {
    // Arrange
    const age = -1;
    // Act
    const result = isValidAge(age);
    // Assert
    expect(result).toBe(false);
  });
  test('should return false for age above 150', () => {
    // Arrange
    const age = 151;
    // Act
    const result = isValidAge(age);
    // Assert
    expect(result).toBe(false);
  });
  test('should return false for floats', () => {
    // Arrange
    const age = 25.5;
    // Act
    const result = isValidAge(age);
    // Assert
    expect(result).toBe(false);
  });
  test('should return false for string representations', () => {
    // Arrange
    const age = '25';
    // Act
    const result = isValidAge(age);
    // Assert
    expect(result).toBe(false);
  });
  test('should return false for null', () => {
    // Arrange
    const age = null;
    // Act
    const result = isValidAge(age);
    // Assert
    expect(result).toBe(false);
  });
});

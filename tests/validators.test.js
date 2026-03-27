const { isValidEmail, isValidPassword, isValidAge } = require('../src/validators');

describe('isValidEmail', () => {
  test('should return true when given a standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });
  test('should return true when given email with tags and subdomains', () => {
    expect(isValidEmail('user.name+tag@domain.co')).toBe(true);
  });
  test('should return false when given text without @ and .', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });
  test('should return false when missing username', () => {
    expect(isValidEmail('@domain.com')).toBe(false);
  });
  test('should return false when missing domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });
  test('should return false when given empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
  test('should return false when given null', () => {
    expect(isValidEmail(null)).toBe(false);
  });
});

describe('isValidPassword', () => {
  test('should return valid true when given strong password', () => {
    const result = isValidPassword('Passw0rd!');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
  test('should return false with multiple errors when password is too short and missing requirements', () => {
    const result = isValidPassword('short');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });
  test('should return false when uppercase missing', () => {
    const result = isValidPassword('alllowercase1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });
  test('should return false when lowercase missing', () => {
    const result = isValidPassword('ALLUPPERCASE1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });
  test('should return false when numbers missing', () => {
    const result = isValidPassword('NoDigits!here');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });
  test('should return false when special char missing', () => {
    const result = isValidPassword('NoSpecial1here');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character (!@#$%^&*)');
  });
  test('should return false when string is empty', () => {
    const result = isValidPassword('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be a string');
  });
  test('should return false when value is null', () => {
    const result = isValidPassword(null);
    expect(result.valid).toBe(false);
  });
});

describe('isValidAge', () => {
  test('should return true for normal adult age', () => {
    expect(isValidAge(25)).toBe(true);
  });
  test('should return true for age 0', () => {
    expect(isValidAge(0)).toBe(true);
  });
  test('should return true for maximum age', () => {
    expect(isValidAge(150)).toBe(true);
  });
  test('should return false for negative age', () => {
    expect(isValidAge(-1)).toBe(false);
  });
  test('should return false for age above 150', () => {
    expect(isValidAge(151)).toBe(false);
  });
  test('should return false for floats', () => {
    expect(isValidAge(25.5)).toBe(false);
  });
  test('should return false for string representations', () => {
    expect(isValidAge('25')).toBe(false);
  });
  test('should return false for null', () => {
    expect(isValidAge(null)).toBe(false);
  });
});

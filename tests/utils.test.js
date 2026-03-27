const { capitalize, calculateAverage, slugify, sortStudents, clamp } = require('../src/utils');

describe('capitalize', () => {
  test('should return capitalized string when given lowercase', () => {
    // Arrange
    const input = 'hello';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('Hello');
  });
  test('should return capitalized string when given uppercase', () => {
    // Arrange
    const input = 'HELLO';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('Hello');
  });
  test('should return empty string when given null', () => {
    // Arrange
    const input = null;
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('');
  });
  test('should return same single character capitalized when given single letter', () => {
    // Arrange
    const input = 'a';
    // Act
    const result = capitalize(input);
    // Assert
    expect(result).toBe('A');
  });
});

describe('calculateAverage', () => {
  test('should return the average when given an array of numbers', () => {
    // Arrange
    const input = [10, 12, 14, 16];
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(13);
  });
  test('should return 0 when given an empty array', () => {
    // Arrange
    const input = [];
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(0);
  });
  test('should return 0 when given null', () => {
    // Arrange
    const input = null;
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(0);
  });
  test('should return rounded average when given numbers with many decimals', () => {
    // Arrange
    const input = [10, 11, 12.333];
    // Act
    const result = calculateAverage(input);
    // Assert
    expect(result).toBe(11.11);
  });
});

describe('slugify', () => {
  test('should return slugified string when given normal text', () => {
    // Arrange
    const input = 'Hello World';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('hello-world');
  });
  test('should return slugified string when given special characters', () => {
    // Arrange
    const input = 'Hello @World!';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('hello-world');
  });
  test('should return empty string when given null', () => {
    // Arrange
    const input = null;
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('');
  });
  test('should return slugified string replacing multiple spaces when given messy string', () => {
    // Arrange
    const input = 'hello   world---test';
    // Act
    const result = slugify(input);
    // Assert
    expect(result).toBe('hello-world-test');
  });
});

describe('clamp', () => {
  test('should return value when value is between min and max', () => {
    // Arrange
    const value = 5;
    const min = 1;
    const max = 10;
    // Act
    const result = clamp(value, min, max);
    // Assert
    expect(result).toBe(5);
  });
  test('should return min when value is below min', () => {
    // Arrange
    const value = 0;
    const min = 1;
    const max = 10;
    // Act
    const result = clamp(value, min, max);
    // Assert
    expect(result).toBe(1);
  });
  test('should return max when value is above max', () => {
    // Arrange
    const value = 15;
    const min = 1;
    const max = 10;
    // Act
    const result = clamp(value, min, max);
    // Assert
    expect(result).toBe(10);
  });
  test('should return 0 when inputs are null or invalid', () => {
    // Arrange
    const value = null;
    const min = 1;
    const max = 10;
    // Act
    const result = clamp(value, min, max);
    // Assert
    expect(result).toBe(0);
  });
});

describe('sortStudents', () => {
  const students = [
    { name: 'Charlie', grade: 12, age: 22 },
    { name: 'Alice', grade: 18, age: 20 },
    { name: 'Bob', grade: 15, age: 21 },
  ];

  test('should sort students by grade ascending', () => {
    const sorted = sortStudents(students, 'grade', 'asc');
    expect(sorted[0].name).toBe('Charlie');
    expect(sorted[1].name).toBe('Bob');
    expect(sorted[2].name).toBe('Alice');
  });
  test('should sort students by grade descending', () => {
    const sorted = sortStudents(students, 'grade', 'desc');
    expect(sorted[0].name).toBe('Alice');
    expect(sorted[2].name).toBe('Charlie');
  });
  test('should sort students by name ascending', () => {
    const sorted = sortStudents(students, 'name', 'asc');
    expect(sorted[0].name).toBe('Alice');
    expect(sorted[2].name).toBe('Charlie');
  });
  test('should sort students by age ascending', () => {
    const sorted = sortStudents(students, 'age', 'asc');
    expect(sorted[0].name).toBe('Alice');
    expect(sorted[2].name).toBe('Charlie');
  });
  test('should return empty array for null input', () => {
    expect(sortStudents(null, 'grade', 'asc')).toEqual([]);
  });
  test('should return empty array for empty input', () => {
    expect(sortStudents([], 'grade', 'asc')).toEqual([]);
  });
  test('should not modify the original array', () => {
    const copy = [...students];
    sortStudents(students, 'grade', 'asc');
    expect(students).toEqual(copy);
  });
  test('should default to ascending order', () => {
    const sortedDef = sortStudents(students, 'grade');
    const sortedAsc = sortStudents(students, 'grade', 'asc');
    expect(sortedDef).toEqual(sortedAsc);
  });
});

const { capitalize, calculateAverage, slugify, sortStudents, clamp } = require('../src/utils');

describe('capitalize', () => {
  test('should return capitalized string when given lowercase', () => {
    expect(capitalize('hello')).toBe('Hello');
  });
  test('should return capitalized string when given uppercase', () => {
    expect(capitalize('HELLO')).toBe('Hello');
  });
  test('should return empty string when given null', () => {
    expect(capitalize(null)).toBe('');
  });
  test('should return same single character capitalized when given single letter', () => {
    expect(capitalize('a')).toBe('A');
  });
});

describe('calculateAverage', () => {
  test('should return the average of grades', () => {
    expect(calculateAverage([10, 12, 14, 16])).toBe(13);
  });
  test('should return 0 for an empty array', () => {
    expect(calculateAverage([])).toBe(0);
  });
  test('should return 0 for null input', () => {
    expect(calculateAverage(null)).toBe(0);
  });
  test('should round to 2 decimal places', () => {
    expect(calculateAverage([10, 11, 12.333])).toBe(11.11);
  });
});

describe('slugify', () => {
  test('should return slugified string when given normal text', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });
  test('should return slugified string when given special characters', () => {
    expect(slugify('Hello @World!')).toBe('hello-world');
  });
  test('should return empty string when given null', () => {
    expect(slugify(null)).toBe('');
  });
  test('should replace multiple spaces and hyphens with single hyphen', () => {
    expect(slugify('hello   world---test')).toBe('hello-world-test');
  });
});

describe('clamp', () => {
  test('should return value when value is between min and max', () => {
    expect(clamp(5, 1, 10)).toBe(5);
  });
  test('should return min when value is below min', () => {
    expect(clamp(0, 1, 10)).toBe(1);
  });
  test('should return max when value is above max', () => {
    expect(clamp(15, 1, 10)).toBe(10);
  });
  test('should return 0 when inputs are invalid', () => {
    expect(clamp(null, 1, 10)).toBe(0);
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

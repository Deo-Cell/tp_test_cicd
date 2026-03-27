function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return Math.round((sum / numbers.length) * 100) / 100;
}

function slugify(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/[ _-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function sortStudents(students, sortBy, order = 'asc') {
  if (!students || !Array.isArray(students)) return [];
  return [...students].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (valA < valB) return order === 'desc' ? 1 : -1;
    if (valA > valB) return order === 'desc' ? -1 : 1;
    return 0;
  });
}

function clamp(value, min, max) {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') return 0;
  return Math.min(Math.max(value, min), max);
}

module.exports = {
  capitalize,
  calculateAverage,
  slugify,
  sortStudents,
  clamp
};

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const parts = email.split('@');
  if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) return false;
  return parts[1].includes('.');
}

function isValidPassword(password) {
  const result = { valid: false, errors: [] };
  if (!password || typeof password !== 'string') {
    result.errors.push('Password must be a string');
    return result;
  }
  if (password.length < 8) result.errors.push('Password must be at least 8 characters long');
  if (!/[a-z]/.test(password)) result.errors.push('Password must contain at least one lowercase letter');
  if (!/[A-Z]/.test(password)) result.errors.push('Password must contain at least one uppercase letter');
  if (!/[0-9]/.test(password)) result.errors.push('Password must contain at least one number');
  if (!/[!@#$%^&*]/.test(password)) result.errors.push('Password must contain at least one special character (!@#$%^&*)');
  
  result.valid = result.errors.length === 0;
  return result;
}

function isValidAge(age) {
  return Number.isInteger(age) && age >= 0 && age <= 150;
}

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidAge
};

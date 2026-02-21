// Input validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 8;
}

export function isValidSymbol(symbol: string): boolean {
  // 1-10 alphanumeric characters
  return /^[A-Z0-9]{1,10}$/i.test(symbol);
}

export function isValidNumberString(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num) && num > 0;
}

export function sanitizeInput(input: string): string {
  return input.trim().slice(0, 255);
}

export function validateTradeRequest(symbol: string, quantity: string, price: string): string | null {
  if (!isValidSymbol(symbol)) {
    return 'Invalid symbol';
  }
  if (!isValidNumberString(quantity)) {
    return 'Invalid quantity';
  }
  if (!isValidNumberString(price)) {
    return 'Invalid price';
  }
  const qty = parseFloat(quantity);
  const prc = parseFloat(price);
  if (qty <= 0 || prc <= 0) {
    return 'Quantity and price must be positive';
  }
  if (qty > 1000000) {
    return 'Quantity exceeds maximum';
  }
  return null;
}

export function validateRegisterRequest(
  email: string,
  password: string,
  confirmPassword: string
): string | null {
  if (!isValidEmail(email)) {
    return 'Invalid email address';
  }
  if (!isValidPassword(password)) {
    return 'Password must be at least 8 characters';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

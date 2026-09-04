import crypto from 'crypto';

export function hashIdentifier(inputValue) {
  if (!inputValue) return null;
  return crypto
    .createHash('sha256')
    .update(inputValue.trim().toLowerCase())
    .digest('hex');
}

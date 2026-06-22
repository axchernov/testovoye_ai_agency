export type TextValidationResult = { ok: true; value: string } | { ok: false };

export function validateText(input: string): TextValidationResult {
  const value = input.trim();
  return value ? { ok: true, value } : { ok: false };
}

export function validateEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

export function validatePhone(input: string): boolean {
  const value = input.trim();
  if (!/^\+?[\d\s()-]+$/.test(value)) {
    return false;
  }

  const digitCount = value.replace(/\D/g, "").length;
  return digitCount >= 10 && digitCount <= 15;
}

export function sanitizeString(value: string): string {
  return value.replaceAll('<', '').replaceAll('>', '').trim();
}

export function sanitizeObject<T>(value: T): T {
  if (typeof value === 'string') return sanitizeString(value) as T;
  if (Array.isArray(value)) return value.map((item) => sanitizeObject(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, sanitizeObject(entry)])) as T;
  }
  return value;
}

const WRAPPED_KEYS = [
  'investor',
  'requests',
  'contact',
  'companies',
  'property',
  'franchise',
  'leads',
  'data',
  'list',
  'items',
];

/**
 * Normalise an API payload that may be either a bare array or an object
 * wrapping the array under a known key (the userpanel endpoints vary).
 */
export function toArray<T = any>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    for (const key of WRAPPED_KEYS) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
    // Some endpoints return the array directly under a singular key.
    const values = Object.values(obj);
    const arr = values.find((v) => Array.isArray(v));
    if (arr) return arr as T[];
  }
  return [];
}

export function fullName(firstname?: string | null, lastname?: string | null, fallback = ''): string {
  const parts = [firstname, lastname].filter(Boolean).join(' ').trim();
  return parts || fallback;
}

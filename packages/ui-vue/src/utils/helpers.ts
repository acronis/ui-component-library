export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === '') {
    return true;
  }

  return (Array.isArray(value) && value.length === 0) || JSON.stringify(value) === '{}';
}

export function isNullOrUndefined(value: unknown): value is undefined | null {
  return value === null || value === undefined;
}

export function isEmptyArray(arr: unknown): boolean {
  return Array.isArray(arr) && arr.length === 0;
}

export function isObject(obj: unknown): obj is object {
  return obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj);
}

export function isNumeric(value: unknown): boolean {
  return (typeof value === 'string' || typeof value === 'number') && value !== '' && !Number.isNaN(Number(value));
}

export function clampNumber(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function capitalize(str: string) {
  return (str[0] as string).toUpperCase() + str.slice(1);
}

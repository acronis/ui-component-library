export function omit<Obj extends object, Keys extends keyof Obj>(
  obj: Obj,
  keys: Keys[],
): Omit<Obj, Keys> {
  const result = { ...obj };

  for (const key of keys) {
    delete result[key];
  }

  return result;
}

export function pick<Obj extends object, Keys extends keyof Obj>(
  obj: Obj,
  keys: Keys[],
): Pick<Obj, Keys> {
  const result = {} as Pick<Obj, Keys>;

  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Parse jsonString and in case of exception return defaultValue
 */
export function parseJsonSafe<T>(jsonString: string, defaultValue: T): T;
export function parseJsonSafe<T>(jsonString: string): T | undefined;
export function parseJsonSafe<T>(jsonString: string, defaultValue?: T) {
  try {
    return JSON.parse(jsonString);
  }
  catch (e) {
    return defaultValue;
  }
}

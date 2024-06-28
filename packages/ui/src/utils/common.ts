/** Whether the current environment is the client */
export const isClient = typeof window !== 'undefined';
/** Whether the current environment is IOS */
export const isIOS
/* #__PURE__ */ = isClient
&& window?.navigator?.userAgent
&& /iP(?:ad|hone|od)/.test(window.navigator.userAgent);

const { toString } = Object.prototype;
const { hasOwnProperty } = Object.prototype;

/**
 * Determine whether a value is of the specified type
 *
 * @param value the value to be judged
 * @param type The specified type, pay attention to the case
 *
 * @returns whether the type matches
 */
export function is(value: unknown, type: string) {
  return toString.call(value) === `[object ${type}]`;
}

/**
 * Determine whether an object contains the specified key value
 *
 * @param value object to be judged
 * @param key the specified key value
 *
 * @returns whether it contains key value
 */
export function has(value: Record<string, any>, key: string | symbol): key is keyof typeof value {
  return hasOwnProperty.call(value, key);
}

/**
 * Determine whether a value has been defined
 *
 * @param value the value to be judged
 *
 * @returns whether it has been defined
 */
export function isDefined<T = unknown>(
  value: T | undefined | null
): value is Exclude<T, undefined | null> {
  return value !== undefined && value !== null;
}

/**
 * Determine whether a value is undefined
 *
 * @param value the value to be judged
 *
 * @returns whether it is undefined
 */
export function isNull(value: unknown): value is null | undefined {
  return value === undefined || value === null;
}

/**
 * Determine whether a value is a number
 *
 * @param value the value to be judged
 *
 * @returns whether it is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/**
 * Determine whether a value is `NaN`
 *
 * @param value the value to be judged
 *
 * @returns whether it is `NaN`
 */
export function isNaN(value: unknown): value is number {
  return Number.isNaN(value);
}

/**
 * Determine whether a value is a string
 *
 * @param value the value to be judged
 *
 * @returns whether it is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Determine whether a value is a Boolean value
 *
 * @param value the value to be judged
 *
 * @returns whether it is a Boolean value
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Determine whether a value is `true`
 *
 * @param value the value to be judged
 *
 * @returns whether it is `true`
 */
export function isTrue(value: unknown): value is true {
  return value === true;
}

/**
 * Determine whether a value is `false`
 *
 * @param value the value to be judged
 *
 * @returns whether it is `false`
 */
export function isFalse(value: unknown): value is false {
  return value === false;
}

/**
 * Determine whether a value is `Symbol`
 *
 * @param value the value to be judged
 *
 * @returns whether it is `Symbol`
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

/**
 * Determine whether a value is `BigInt`
 *
 * @param value the value to be judged
 *
 * @returns whether it is `BigInt`
 */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

/**
 * Determine whether a value is an array
 *
 * @param value the value to be judged
 *
 * @returns whether it is an array
 */
export function isArray<T = any>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Determine whether a value is an object
 *
 * Note that `null` and native special objects are not included
 *
 * @param value the value to be judged
 *
 * @returns whether it is an object
 */
export function isObject<T extends Record<any, any> = Record<any, any>>(
  value: unknown
): value is T {
  return is(value, 'Object');
}

/**
 * Determine whether a value is a `Promise`
 *
 * If an object contains `then` and `catch` methods, it is considered a `Promise`
 *
 * @param value the value to be judged
 *
 * @returns whether it is `Promise`
 */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return (
    !!value
    && typeof (value as any).then === 'function'
    && typeof (value as any).catch === 'function'
  );
}

/**
 * Determine whether a value is a function
 *
 * @param value the value to be judged
 *
 * @returns whether it is a function
 */
export function isFunction(value: unknown): value is (...any: any[]) => any {
  return typeof value === 'function';
}

/**
 * Determine whether a value is a `Set`
 *
 * @param value the value to be judged
 *
 * @returns whether it is `Set`
 */
export function isSet<T = any>(value: unknown): value is Set<T> {
  return is(value, 'Set');
}

/**
 * Determine whether a value is a `Map`
 *
 * @param value the value to be judged
 *
 * @returns whether it is `Map`
 */
export function isMap<K = any, V = any>(value: unknown): value is Map<K, V> {
  return is(value, 'Map');
}

/**
 * Determine whether a value is `Date`
 *
 * @param value the value to be judged
 *
 * @returns whether it is `Date`
 */
export function isDate(value: unknown): value is Date {
  return is(value, 'Date');
}

/**
 * Determine whether a value is regular
 *
 * @param value the value to be judged
 *
 * @returns whether it is regular
 */
export function isRegExp(value: unknown): value is RegExp {
  return is(value, 'RegExp');
}

/**
 * Determine whether a value is empty
 *
 * - Empty if `length` is `0` if this is an array or string
 * - Empty if `size` is `0` if this is a `Set` or `Map`
 * - If this is an object, empty if there are no key values
 * - if this is a number, or empty if `NaN`
 * - Otherwise, empty if undefined
 *
 * @param value the value to be judged
 *
 * @returns whether it is empty
 */
export function isEmpty(value: unknown) {
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  if (typeof value === 'number') {
    return isNaN(value);
  }

  return isNull(value);
}

/**
 * Determine whether a value is `Element`
 *
 * @param value the value to be judged
 * @param ssr whether to consider server-side rendering
 *
 * @returns whether it is `Element`
 */
export function isElement<T extends Element = Element>(value: unknown, ssr = false): value is T {
  if (!ssr && !isClient) {
    return false;
  }

  return !!(value && 'nodeType' in (value as any));
}

/**
 * Determine whether a value can be iterated
 *
 * @param value the value to be judged
 *
 * @returns whether it can be iterated
 */
export function isIterable(value: unknown) {
  return isDefined(value) && typeof (value as any)[Symbol.iterator] === 'function';
}

/**
 * An empty placeholder function
 */
export function noop(...args: any[]): any;
export function noop() {}

/**
 * A placeholder function that returns `true`
 *
 * @returns `true`
 */
export function toTrue(...args: any[]): true;
export function toTrue() {
  return true;
}

/**
 * A placeholder function that returns `false`
 *
 * @returns `false`
 */
export function toFalse(...args: any[]): false;
export function toFalse() {
  return false;
}

/**
 * Generate an array with progressive values
 *
 * @param size size
 * @param start The starting value, default is 1
 * @param step span, default is 1
 *
 * @returns generated array
 */
export function range(size: number, start = 1, step = 1) {
  const array: number[] = [];

  for (let i = 0; i < size; ++i) {
    array.push(start + i * step);
  }

  return array;
}

/**
 * Get the type of variable
 *
 * @param value any variable
 *
 * @returns variable type
 */
export function getType(value: unknown) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

/**
 * Generate a random string based on length
 *
 * @param length The length of the string
 *
 * @returns generated string
 */
export function randomString(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  const maxPos = chars.length;

  let string = '';

  while (length--) {
    string += chars.charAt(Math.floor(Math.random() * maxPos));
  }

  return string;
}

/**
 * Based on a series of judgment conditions, execute the callback function corresponding to the first `true` condition
 *
 * @param conditions Judgment conditions and callback function
 * @param options additional options
 *
 * @returns whether any condition is matched
 */
export async function decide(
  conditions: [boolean | (() => boolean), () => void | Promise<void>][],
  options: {
    /**
     * When any condition is matched, it will be executed before the callback function corresponding to the condition is executed.
     */
    beforeMatchAny?: () => void | Promise<void>
    /**
     * When any condition is matched, it will be executed after the callback function corresponding to the condition is executed.
     */
    afterMatchAny?: () => void | Promise<void>
  } = {}
) {
  if (conditions.length) {
    for (const [condition, callback] of conditions) {
      if (typeof condition === 'function' ? condition() : condition) {
        if (typeof options.beforeMatchAny === 'function') {
          await options.beforeMatchAny();
        }

        await callback();

        if (typeof options.afterMatchAny === 'function') {
          await options.afterMatchAny();
        }

        return true;
      }
    }
  }

  return false;
}

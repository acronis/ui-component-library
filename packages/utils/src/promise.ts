import { AbortError } from './abort.ts';

export type PromiseFunction<Args extends any[] = any[]> = (...args: Args) => Promise<any>;
export type PromiseResolve<Value> = (value: Value | PromiseLike<Value>) => void;
export type PromiseReject = (reason: unknown) => void;
export type PromiseResolvers<Value> = ReturnType<typeof withResolvers<Value>>;

/**
 * Need to replace when time comes
 * https://github.com/tc39/proposal-promise-with-resolvers
 */
export function withResolvers<Value>() {
  let resolve: PromiseResolve<Value>;
  let reject: PromiseReject;
  const promise = new Promise<Value>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    // @ts-expect-error Promise constructor is sync
    resolve,
    // @ts-expect-error Promise constructor is sync
    reject,
  };
}

/**
 * Wait 'delay' seconds
 * If abort event fires - reject promise immediately
 */
export async function wait(delay: number, signal?: AbortSignal) {
  const { resolve, reject, promise } = withResolvers<void>();
  const timeout = setTimeout(fire, delay);

  signal?.addEventListener('abort', abort);

  return promise;

  function fire() {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
    resolve();
  }

  function abort() {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
    reject(new AbortError('Abort timeout'));
  }
}

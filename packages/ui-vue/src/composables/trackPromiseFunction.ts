import type { PromiseFunction } from '@acronis-platform/utils';

export type PromiseFunctionResponse<Fn> = Fn extends (...args: any[]) => Promise<infer Res>
  ? Res
  : never;
export type PromiseFunctionWithParams<
  Fn extends PromiseFunction,
  Res = PromiseFunctionResponse<Fn>,
> = (...params: Parameters<Fn>) => Promise<Res>;

/**
 * Intercept call of promise function
 *
 * @param before called before promise function
 * @param success called on promise success
 * @param error called on promise error
 */
export function trackPromiseFunction(
  before?: () => void,
  success?: () => void,
  error?: (error: unknown) => void,
) {
  return <Fn extends PromiseFunction>(promiseFn: Fn): PromiseFunctionWithParams<Fn> =>
    async (...params) => {
      try {
        before?.();
        const response = await promiseFn(...params);
        success?.();
        return response;
      }
      catch (e) {
        error?.(e);
        throw e;
      }
    };
}

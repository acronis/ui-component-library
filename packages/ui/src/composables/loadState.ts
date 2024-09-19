import type { Ref } from 'vue';
import {
  computed,
  effectScope,
  getCurrentScope,
  onScopeDispose,
  ref,
  shallowReactive,
  watch,
} from 'vue';
import type { PromiseFunction } from '@acronis-platform/utils';
import { AbortError } from '@acronis-platform/utils';
import { trackPromiseFunction } from '@/composables/trackPromiseFunction.ts';
import type { OnCleanup } from '@/types/oncleanup.ts';

export type LoadState =
  | 'blank' // this is state before first load
  | 'loading'
  | 'error'
  | 'loaded';

export type LoadStateRef = Ref<LoadState>;

export class LoadStatePromiseError extends Error {
  static is(error: unknown) {
    return error instanceof LoadStatePromiseError;
  }
}

/**
 * Use for track load state
 *
 * @example
 * const { loadState, wrapLoad } = useLoadState();
 * const submit = wrapLoad(await () => {...})
 *
 * submit();
 * console.log(loadState.value === 'loading');
 */
export function useLoadState() {
  let wrapLoadCount = 0;
  const loadState = ref<LoadState>('blank');

  return {
    loadPromise,
    loadFunction,
    wrapLoad,
    loadState,
    setLoading,
    setError,
    setLoaded,
    setBlank,
  };

  function setBlank() {
    loadState.value = 'blank';
  }

  function setLoading() {
    loadState.value = 'loading';
  }

  function setError() {
    loadState.value = 'error';
  }

  function setLoaded() {
    loadState.value = 'loaded';
  }

  function wrapLoad<Fn extends PromiseFunction>(promiseFn: Fn) {
    return (...props: Parameters<Fn>) => {
      let count: number;

      // execute promiseFn and track its promise state
      return trackPromiseFunction(onBefore, onSuccess, onError)(promiseFn)(...props);

      function onBefore() {
        // increment count to ignore previous calls of wrapLoad function
        count = ++wrapLoadCount;
        setLoading();
      }

      function onSuccess() {
        // eslint-disable-next-line ts/no-unused-expressions
        count === wrapLoadCount && setLoaded();
      }

      function onError() {
        // eslint-disable-next-line ts/no-unused-expressions
        count === wrapLoadCount && setError();
      }
    };
  }

  function loadFunction<Fn extends PromiseFunction>(fn: Fn) {
    // @ts-expect-error use types from wrapLoad
    return wrapLoad(fn)();
  }

  function loadPromise<P extends Promise<any>>(promise: P) {
    return loadFunction(() => promise);
  }
}

export function useMergedLoadStates(...states: LoadStateRef[]) {
  return computed(() => getMergedLoadStates());

  function getMergedLoadStates() {
    if (states.some(({ value }) => value === 'error')) {
      return 'error';
    }

    if (states.some(({ value }) => value === 'loading')) {
      return 'loading';
    }

    if (states.every(({ value }) => value === 'blank')) {
      return 'blank';
    }

    // blank states do not prevent merged state to be loaded
    return 'loaded';
  }
}

/**
 * Wrap promiseFn to track its load state
 */
export function useCallbackLoadState<Fn extends PromiseFunction>(promiseFn: Fn) {
  const { wrapLoad, ...loadStateAPI } = useLoadState();

  // TODO: change wrapLoad to loadPromise
  return { callback: wrapLoad(promiseFn), ...loadStateAPI };
}

/**
 * Use this function when you need to track multiple load states
 */
export function useMultipleLoadStates<T>() {
  const states = shallowReactive(new Map<T, LoadStateRef>());

  return { getLoadState: get, setLoadState: set, clearLoadStates, multipleLoadPromise };

  function clearLoadStates() {
    states.clear();
  }

  function set(key: T, loadState: LoadStateRef) {
    states.set(key, loadState);
  }

  function get(key: T) {
    return states.get(key)?.value ?? 'blank';
  }

  function multipleLoadPromise<P extends Promise<any>>(key: T, promise: P) {
    const { loadState, loadPromise } = useLoadState();
    set(key, loadState);
    return loadPromise(promise);
  }
}

export function useLoadStatePromise(loadState: LoadStateRef) {
  const controller = new AbortController();

  if (!getCurrentScope()) {
    throw new Error('useLoadStatePromise should be called in scope of Component!');
  }

  onScopeDispose(() => controller.abort());

  return { waitLoadState };

  async function waitLoadState() {
    return getLoadStatePromise(loadState, controller.signal);
  }
}

/**
 * Resolve promise when loadState become loaded and reject when become error
 * Signal is required to prevent developers forgetting to cancel waiting to prevent memory leaks
 */
export function getLoadStatePromise(loadState: LoadStateRef, signal: AbortSignal) {
  return new Promise<undefined>((resolve, reject) => {
    if (signal.aborted) {
      reject(new AbortError('getLoadStatePromise is called with aborted signal'));
      return;
    }

    // create detached scope to prevent watch to be cancelled if this function is called in
    // context of component
    const scope = effectScope(true);
    scope.run(() => watch(loadState, onLoadStateChange, { immediate: true, flush: 'sync' }));

    function onLoadStateChange(state: LoadState, _: LoadState | undefined, onCleanup: OnCleanup) {
      signal.addEventListener('abort', abort);
      onCleanup(() => signal.removeEventListener('abort', abort));

      if (state === 'loaded') {
        scope.stop();
        resolve(undefined);
      }
      else if (state === 'error') {
        scope.stop();
        reject(new LoadStatePromiseError('Load state become isError'));
      }
    }

    function abort() {
      scope.stop();
      reject(new AbortError('getLoadStatePromise is aborted'));
    }
  });
}

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  useDataTableTreeMachine,
  type DataTableTreeLoadEvent,
} from '../data-table-tree';

// `packages/ui-spec/components/data-table/behavior.md` — "Lazy child load handles
// stale work". Every clause of that scenario has a case here.

interface Node {
  readonly id: string;
  readonly name: string;
}

/** A promise whose settlement the test controls. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

const parent: Node = { id: 'p', name: 'Parent' };
const childA: Node = { id: 'a', name: 'A' };
const childB: Node = { id: 'b', name: 'B' };

describe('lazy tree children — request machine', () => {
  it('reports idle for a row that has never been requested', () => {
    const { result } = renderHook(() =>
      useDataTableTreeMachine<Node>({ loadChildren: async () => [] })
    );

    expect(result.current.statusOf('p')).toEqual({ status: 'idle' });
    expect(result.current.childrenOf(parent)).toBeUndefined();
  });

  it('is disabled, and loads nothing, without a loader', () => {
    const { result } = renderHook(() => useDataTableTreeMachine<Node>({}));

    expect(result.current.enabled).toBe(false);
    act(() => result.current.load('p', parent));
    expect(result.current.statusOf('p').status).toBe('idle');
  });

  it('moves idle -> loading(requestKey) -> loaded, keyed by row ID', async () => {
    const gate = deferred<readonly Node[]>();
    const { result } = renderHook(() =>
      useDataTableTreeMachine<Node>({ loadChildren: () => gate.promise })
    );

    act(() => result.current.load('p', parent));

    const loading = result.current.statusOf('p');
    expect(loading.status).toBe('loading');
    expect(loading.requestKey).toBeTypeOf('string');
    // Keyed by row ID: a sibling is unaffected.
    expect(result.current.statusOf('other').status).toBe('idle');

    await act(async () => {
      gate.resolve([childA]);
      await gate.promise;
    });

    expect(result.current.statusOf('p')).toMatchObject({ status: 'loaded' });
    // Children come back by record identity, which is what getSubRows receives.
    expect(result.current.childrenOf(parent)).toEqual([childA]);
  });

  it('drops a superseded result and keeps the newer one', async () => {
    const first = deferred<readonly Node[]>();
    const second = deferred<readonly Node[]>();
    const calls: string[] = [];
    const { result } = renderHook(() =>
      useDataTableTreeMachine<Node>({
        loadChildren: (_row, requestKey) => {
          calls.push(requestKey);
          return calls.length === 1 ? first.promise : second.promise;
        },
      })
    );

    act(() => result.current.load('p', parent));
    // `retry` supersedes the in-flight request with a fresh key.
    act(() => result.current.retry('p', parent));
    expect(calls).toHaveLength(2);
    expect(calls[0]).not.toBe(calls[1]);

    // The FIRST request settles last — the stale case the scenario names.
    await act(async () => {
      second.resolve([childB]);
      first.resolve([childA]);
      await Promise.all([first.promise, second.promise]);
    });

    expect(result.current.statusOf('p').requestKey).toBe(calls[1]);
    // The stale payload never reached the tree.
    expect(result.current.childrenOf(parent)).toEqual([childB]);
  });

  it('exposes row-scoped error metadata with its request key, and retries', async () => {
    const failure = deferred<readonly Node[]>();
    const success = deferred<readonly Node[]>();
    let attempt = 0;
    const { result } = renderHook(() =>
      useDataTableTreeMachine<Node>({
        loadChildren: () => {
          attempt += 1;
          return attempt === 1 ? failure.promise : success.promise;
        },
      })
    );

    act(() => result.current.load('p', parent));
    const failingKey = result.current.statusOf('p').requestKey;

    const boom = new Error('offline');
    await act(async () => {
      failure.reject(boom);
      await failure.promise.catch(() => undefined);
    });

    expect(result.current.statusOf('p')).toEqual({
      status: 'error',
      requestKey: failingKey,
      error: boom,
    });

    // A repeated expand does not silently re-request work that just failed...
    act(() => result.current.load('p', parent));
    expect(attempt).toBe(1);
    // ...but the retry command does.
    act(() => result.current.retry('p', parent));
    expect(attempt).toBe(2);

    await act(async () => {
      success.resolve([childA]);
      await success.promise;
    });

    expect(result.current.statusOf('p').status).toBe('loaded');
    expect(result.current.childrenOf(parent)).toEqual([childA]);
  });

  it('does not duplicate an in-flight or already-loaded request', async () => {
    const gate = deferred<readonly Node[]>();
    let attempts = 0;
    const { result } = renderHook(() =>
      useDataTableTreeMachine<Node>({
        loadChildren: () => {
          attempts += 1;
          return gate.promise;
        },
      })
    );

    act(() => result.current.load('p', parent));
    act(() => result.current.load('p', parent));
    expect(attempts).toBe(1);

    await act(async () => {
      gate.resolve([childA]);
      await gate.promise;
    });

    act(() => result.current.load('p', parent));
    expect(attempts).toBe(1);
  });

  it('re-fetches for a replaced record object rather than reusing children', async () => {
    const gate = deferred<readonly Node[]>();
    const { result } = renderHook(() =>
      useDataTableTreeMachine<Node>({ loadChildren: () => gate.promise })
    );

    act(() => result.current.load('p', parent));
    await act(async () => {
      gate.resolve([childA]);
      await gate.promise;
    });

    // Same row ID, new object — the immutable-replacement case. Children are
    // keyed by identity, so they are not silently reused for a record that may
    // no longer have them.
    expect(result.current.childrenOf({ ...parent })).toBeUndefined();
    expect(result.current.childrenOf(parent)).toEqual([childA]);
  });

  it('emits loading and the terminal transition, and nothing for a dropped result', async () => {
    const first = deferred<readonly Node[]>();
    const second = deferred<readonly Node[]>();
    let attempt = 0;
    const onLoad = vi.fn<(event: DataTableTreeLoadEvent<Node>) => void>();
    const { result } = renderHook(() =>
      useDataTableTreeMachine<Node>({
        loadChildren: () => {
          attempt += 1;
          return attempt === 1 ? first.promise : second.promise;
        },
        onLoad,
      })
    );

    act(() => result.current.load('p', parent));
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onLoad.mock.calls[0]?.[0]).toMatchObject({
      rowId: 'p',
      row: parent,
      status: 'loading',
    });

    act(() => result.current.retry('p', parent));
    expect(onLoad).toHaveBeenCalledTimes(2);

    await act(async () => {
      second.resolve([childB]);
      first.resolve([childA]);
      await Promise.all([first.promise, second.promise]);
    });

    // Three: loading, loading (the retry), loaded. The superseded result causes
    // no transition, so it emits nothing.
    expect(onLoad).toHaveBeenCalledTimes(3);
    const statuses = onLoad.mock.calls.map((call) => call[0].status);
    expect(statuses).toEqual(['loading', 'loading', 'loaded']);
    expect(onLoad.mock.calls[2]?.[0].children).toEqual([childB]);
  });
});

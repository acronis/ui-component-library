export type DebounceService = ReturnType<typeof useDebounce>;

export function useDebounce<Cb extends (...args: any[]) => void>(callback: Cb, timeout = 300) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let nextCallback: (() => void) | undefined;

  return {
    call,
    flush,
    abort,
  };

  function call(...args: Parameters<Cb>) {
    abort();
    nextCallback = () => callback(...args);
    timer = setTimeout(() => flush(), timeout);
  }

  function flush() {
    nextCallback?.();
    abort();
  }

  function abort() {
    clearTimeout(timer);
    nextCallback = undefined;
    timer = undefined;
  }
}

export function debounce<Cb extends (...args: any[]) => void>(callback: Cb, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<Cb>) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), timeout);
  };
}

export function throttle<Cb extends (...args: any[]) => void>(callback: Cb, timeout = 300) {
  let waiting = false;

  return (...args: Parameters<Cb>) => {
    if (!waiting) {
      callback(...args);
      waiting = true;
      setTimeout(() => (waiting = false), timeout);
    }
  };
}

export function debounceAnimationFrame<Cb extends (...args: any[]) => void>(callback: Cb) {
  let timer: ReturnType<typeof requestAnimationFrame>;

  return (...args: Parameters<Cb>) => {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(() => callback(...args));
  };
}

/**
 * Acts like setInterval but with self-correction
 * @source https://gist.github.com/jakearchibald/cb03f15670817001b1157e62a076fe95
 */
export function setIntervalPrecise(callback: (time: number) => void, ms: number) {
  const start = performance.now();
  let timeout: ReturnType<typeof setTimeout>;
  let aborted = false;

  scheduleFrame(start);

  return () => {
    clearTimeout(timeout);
    aborted = true;
  };

  function frame(time: number) {
    if (aborted) {
      return;
    }

    callback(time);
    scheduleFrame(time);
  }

  function scheduleFrame(time: number) {
    const elapsed = time - start;
    const roundedElapsed = Math.round(elapsed / ms) * ms;
    const targetNext = start + roundedElapsed + ms;
    const delay = targetNext - performance.now();

    timeout = setTimeout(() => requestAnimationFrame(frame), delay);
  }
}

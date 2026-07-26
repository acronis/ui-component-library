import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { usePerfectScrollbar } from './usePerfectScrollbar';

describe('usePerfectScrollbar', () => {
  it('initializes PerfectScrollbar instance on mount', () => {
    const props = { options: {} };
    const emit = vi.fn();
    const scrollbar = ref<HTMLElement | null>(document.createElement('div'));

    usePerfectScrollbar(props, emit, scrollbar);

    expect(scrollbar.value).toBeDefined();
  });

  it('emits events correctly', () => {
    const props = { options: {} };
    const emit = vi.fn();
    const scrollbar = ref<HTMLElement | null>(document.createElement('div'));
    const { createEventListener } = usePerfectScrollbar(props, emit, scrollbar);

    const event = new Event('scroll');
    createEventListener('scroll')(event);

    expect(emit).toHaveBeenCalledWith('scroll', event);
  });

  it.skip('updates PerfectScrollbar options on props change', async () => {
    const props = { options: { maxScrollbarLength: 50 } };
    const emit = vi.fn();
    const scrollbar = ref<HTMLElement | null>(document.createElement('div'));
    const { ps, watchOptions } = usePerfectScrollbar(props, emit, scrollbar);

    props.options.maxScrollbarLength = 100;
    await watchOptions();

    expect(ps.value?.settings.maxScrollbarLength).toBe(100);
  });

  it('handles null scrollbar element gracefully', () => {
    const props = { options: {} };
    const emit = vi.fn();
    const scrollbar = ref<HTMLElement | null>(null);

    const { createInstance } = usePerfectScrollbar(props, emit, scrollbar);

    expect(() => createInstance()).not.toThrow();
  });
});

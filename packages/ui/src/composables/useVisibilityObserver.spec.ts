import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import type { Mock } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { useVisibilityObserver } from './useVisibilityObserver.ts';

describe('useVisibilityObserver', () => {
  let observerCallback: IntersectionObserverCallback;
  let IntersectionObserver: Mock<[callback: any], { observe: Mock<any, any>, unobserve: Mock<any, any> }>;

  beforeEach(() => {
    IntersectionObserver = vi.fn((callback) => {
      observerCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
      };
    });

    // vi.spyOn(global, 'IntersectionObserver').mockImplementation(() => IntersectionObserver as any);
    // @ts-expect-error because of the issue with global types
    global.IntersectionObserver = IntersectionObserver;
  });

  it('should create observers on mount', async () => {
    shallowMount({
      template: '<div v-visibility-observer-item="1"></div>',
      directives: {
        'visibility-observer-item': useVisibilityObserver().vVisibilityObserverItem,
      },
    });
    await nextTick();

    expect(IntersectionObserver).toHaveBeenCalledTimes(2);
  });

  it('should update visibility when element is visible', async () => {
    const { visible, vVisibilityObserverItem } = useVisibilityObserver();

    const wrapper = shallowMount({
      template: '<div v-visibility-observer-item="1"></div>',
      directives: {
        'visibility-observer-item': vVisibilityObserverItem,
      },
    });

    await nextTick();

    observerCallback([{
      target: wrapper.element,
      boundingClientRect: { top: 0, bottom: 100 },
      isIntersecting: true
    }], IntersectionObserver);

    // TODO check top and bottom cases
    expect(visible.get(1)).toEqual({ id: 1, element: wrapper.element, top: false, bottom: false });
  });

  it('should update visibility when element is not visible', async () => {
    const { visible, invisibleTop, invisibleBottom, vVisibilityObserverItem } = useVisibilityObserver();

    const wrapper = shallowMount({
      template: '<div v-visibility-observer-item="1"></div>',
      directives: {
        'visibility-observer-item': vVisibilityObserverItem,
      },
    });

    await nextTick();

    observerCallback([{
      target: wrapper.element,
      boundingClientRect: {
        top: -100,
        bottom: -50
      },
      isIntersecting: false
    }], IntersectionObserver);

    expect(visible.has(1)).toBe(false);
    expect(invisibleTop.get(1)).toEqual({ id: 1, element: wrapper.element, top: false, bottom: false });
    expect(invisibleBottom.has(1)).toBe(false);
  });

  it('should clean up on unmount', async () => {
    const { vVisibilityObserverItem } = useVisibilityObserver();

    const wrapper = shallowMount({
      template: '<div v-visibility-observer-item="1"></div>',
      directives: {
        'visibility-observer-item': vVisibilityObserverItem,
      },
    });

    await nextTick();

    wrapper.unmount();

    const unobserveSpies = IntersectionObserver.mock.results.reduce((arr, res) => {
      res?.value?.unobserve && arr.push(res.value.unobserve);
      return arr;
    }, []);

    expect(unobserveSpies[0]).toHaveBeenCalledWith(wrapper.element);
    expect(unobserveSpies[1]).toHaveBeenCalledWith(wrapper.element);
  });
});

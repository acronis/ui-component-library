import type { Directive } from 'vue';
import { computed, shallowReactive, shallowRef } from 'vue';

type VisibilityItemId = number;

interface VisibilityObserverItem {
  id: VisibilityItemId
  element: Element
  top: boolean // top 25% of the item is visible
  bottom: boolean // bottom 25% of the item is visible
}

interface VisibilityObserverInitialItem {
  id: VisibilityItemId
  element: Element
}

interface VisibilityObserverOptions {
  marginTop?: number
  marginBottom?: number
  scrollableContent?: Element
}

export function useVisibilityObserver(options?: VisibilityObserverOptions) {
  let topObserver: IntersectionObserver | undefined;
  let bottomObserver: IntersectionObserver | undefined;
  // observe 25% of top/bottom element's area
  const areaPercent = 0.25;
  // offset 1px is needed to trigger observer when user see at least 1px of content
  const topOffset = (options?.marginTop ?? 0) + 1;
  const bottomOffset = (options?.marginBottom ?? 0) + 1;
  const scrollableContent = shallowRef<Element | undefined>(options?.scrollableContent);
  const vVisibilityObserverItem = getItemDirective();
  const vVisibilityObserverContainer = getContainerDirective();
  const items = shallowReactive(new Map<Element, VisibilityObserverInitialItem>());
  const visible = shallowReactive(new Map<VisibilityItemId, VisibilityObserverItem>());
  const invisibleTop = shallowReactive(new Map<VisibilityItemId, VisibilityObserverItem>());
  const invisibleBottom = shallowReactive(new Map<VisibilityItemId, VisibilityObserverItem>());
  const visibleList = computed(() => getVisibleList());
  const firstVisible = computed(() => visibleList.value[0]);
  const lastVisible = computed(() => visibleList.value[visibleList.value.length - 1]);

  return {
    visible,
    firstVisible,
    lastVisible,
    vVisibilityObserverItem,
    vVisibilityObserverContainer,
    invisibleTop,
    invisibleBottom,
    scrollableContent,
  };

  function getVisibleList() {
    return Array.from(visible.values()).sort(
      (a, b) => a.element.getBoundingClientRect().top - b.element.getBoundingClientRect().top,
    );
  }

  function getScrollableContentBounds() {
    const { top, bottom } = scrollableContent.value
      ? scrollableContent.value.getBoundingClientRect()
      : { top: 0, bottom: document.documentElement.clientHeight };

    const scrollableContentTop = top + topOffset;
    const scrollableContentBottom = bottom - bottomOffset;

    return { scrollableContentTop, scrollableContentBottom };
  }

  function onIntersect(entries: IntersectionObserverEntry[]) {
    const { scrollableContentBottom, scrollableContentTop } = getScrollableContentBounds();

    for (const entry of entries) {
      const element = entry.target;
      const { id } = items.get(element)!;
      const entryRect = entry.boundingClientRect;

      // check if entry is visible at all
      if (!isInsideBounds(entryRect.top, entryRect.bottom)) {
        visible.delete(id);

        // determine where is the entry - above or below
        const aboveTarget = entryRect.bottom <= scrollableContentTop;
        const data: VisibilityObserverItem = { id, element, top: false, bottom: false };

        if (aboveTarget) {
          invisibleBottom.delete(id);
          invisibleTop.set(id, data);
        }
        else {
          invisibleTop.delete(id);
          invisibleBottom.set(id, data);
        }

        continue;
      }

      const offset = areaPercent * entryRect.height;
      // check if top part of the entry is visible
      const top = isInsideBounds(entryRect.top, entryRect.top + offset);
      // check if bottom part of the entry is visible
      const bottom = isInsideBounds(entryRect.bottom - offset, entryRect.bottom);
      const existing = visible.get(id);

      invisibleTop.delete(id);
      invisibleBottom.delete(id);

      // change reactive visible only if smth was changed
      if (!existing || existing.top !== top || existing.bottom !== bottom) {
        visible.set(id, { id, element, top, bottom });
      }
    }

    /**
     * Check if area from top to bottom at least partially inside contentRect
     */
    function isInsideBounds(top: number, bottom: number) {
      return (
        (bottom >= scrollableContentTop && bottom <= scrollableContentBottom)
        || (top >= scrollableContentTop && top <= scrollableContentBottom)
        || (top <= scrollableContentTop && bottom >= scrollableContentBottom)
      );
    }
  }

  function setItem(element: Element, id: VisibilityItemId) {
    const existing = items.get(element);

    items.set(element, { element, id });

    // we had no item in list before. Update not needed
    if (!existing) {
      return;
    }

    for (const map of [visible, invisibleTop, invisibleBottom]) {
      const item = map.get(existing.id);

      // change id in map if we have previous item with old id
      if (item && id !== existing.id) {
        map.delete(existing.id);
        map.set(id, { ...item, id });
      }
    }
  }

  function deleteItem(element: Element) {
    const { id } = items.get(element)!;

    visible.delete(id);
    invisibleTop.delete(id);
    invisibleBottom.delete(id);
    items.delete(element);
  }

  function getContainerDirective(): Directive<Element, VisibilityObserverOptions | undefined> {
    return {
      beforeMount(element) {
        scrollableContent.value = element;
      },
      unmounted() {
        scrollableContent.value = undefined;
      },
    };
  }

  function getItemDirective(): Directive<Element, VisibilityItemId> {
    return {
      updated(element, binding) {
        if (!items.has(element)) {
          return;
        }

        const existing = items.get(element)!;

        if (existing.id === binding.value) {
          return;
        }

        setItem(element, binding.value);
      },
      mounted(element, binding) {
        if (!topObserver) {
          topObserver = new IntersectionObserver(onIntersect, {
            root: scrollableContent.value,
            threshold: [0, 1 - areaPercent],
            rootMargin: `${-topOffset}px 99999px 99999px 99999px`,
          });
        }

        if (!bottomObserver) {
          bottomObserver = new IntersectionObserver(onIntersect, {
            root: scrollableContent.value,
            threshold: [0, 1 - areaPercent],
            rootMargin: `99999px 99999px ${-bottomOffset}px 99999px`,
          });
        }

        setItem(element, binding.value);
        topObserver.observe(element);
        bottomObserver.observe(element);
      },
      unmounted(element) {
        topObserver?.unobserve(element);
        bottomObserver?.unobserve(element);
        deleteItem(element);

        if (!items.size) {
          topObserver = undefined;
          bottomObserver = undefined;
        }
      },
    };
  }
}

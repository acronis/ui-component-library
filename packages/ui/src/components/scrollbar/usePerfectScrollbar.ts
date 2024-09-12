import { type Ref, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import PerfectScrollbar from 'perfect-scrollbar';
import type { AcvScrollbarProps, PerfectScrollbarEmitsKeys } from './scrollbar.ts';

type AcvScrollbarEmits = ((evt: 'scroll', value: Event) => void)
  & ((evt: 'ps-scroll-y', value: Event) => void)
  & ((evt: 'ps-scroll-x', value: Event) => void)
  & ((evt: 'ps-scroll-up', value: Event) => void)
  & ((evt: 'ps-x-reach-end', value: Event) => void);

export function usePerfectScrollbar(
  props: AcvScrollbarProps,
  emit: AcvScrollbarEmits,
  scrollbar: Ref<HTMLElement | null>,
) {
  const ps: Ref<null | PerfectScrollbar> = ref(null);

  const watchOptions = watch(
    () => props.options,
    () => {
      destroyInstance();
      createInstance();
    },
    { deep: true },
  );

  onMounted(() => {
    if (scrollbar.value) {
      createInstance();
    }
  });

  onBeforeUnmount(() => {
    destroyInstance();
  });

  function createInstance() {
    if (scrollbar.value) {
      ps.value = new PerfectScrollbar(scrollbar.value, props.options);
      toggleListeners();
    }
  }

  function destroyInstance() {
    if (ps.value) {
      toggleListeners(false);
      ps.value.destroy();
      ps.value = null;
    }
  }

  const eventListeners: Record<
    PerfectScrollbarEmitsKeys,
    (event: Event) => void
  > = {
    'scroll': createEventListener('scroll'),
    'ps-scroll-y': createEventListener('ps-scroll-y'),
    'ps-scroll-x': createEventListener('ps-scroll-x'),
    'ps-scroll-up': createEventListener('ps-scroll-up'),
    'ps-scroll-down': createEventListener('ps-scroll-down'),
    'ps-scroll-left': createEventListener('ps-scroll-left'),
    'ps-scroll-right': createEventListener('ps-scroll-right'),
    'ps-y-reach-start': createEventListener('ps-y-reach-start'),
    'ps-y-reach-end': createEventListener('ps-y-reach-end'),
    'ps-x-reach-start': createEventListener('ps-x-reach-start'),
    'ps-x-reach-end': createEventListener('ps-x-reach-end'),
  };

  function createEventListener(eventName: PerfectScrollbarEmitsKeys) {
    return function (event: Event) {
      emit(eventName as any, event);
    };
  }

  function toggleListeners(addListeners: boolean = true) {
    if (!ps.value?.element) {
      return;
    }

    Object.entries(eventListeners).forEach(([eventName, listener]) => {
      if (addListeners) {
        ps.value?.element.addEventListener(eventName, listener);
      }
      else {
        ps.value?.element.removeEventListener(eventName, listener);
      }
    });
  }

  return {
    ps,
    createInstance,
    createEventListener,
    watchOptions
  };
}

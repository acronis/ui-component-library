<script setup lang="ts">
  import type { CSSProperties, Ref, UnwrapRef } from 'vue';
  import { Teleport, computed, nextTick, ref, watch } from 'vue';
  import { arrow, autoPlacement, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue';
  import { onClickOutside, refDebounced, useEventListener, useMounted, useVModel } from '@vueuse/core';
  import { useTeleport } from '../../composables/useTeleport.ts';
  import type { AcvPopperEvents, AcvPopperProps, AcvPopperSlots } from './popper.ts';
  import './popper.css';

  defineOptions({
    name: 'AcvPopper',
    inheritAttrs: false
  });

  const props = withDefaults(defineProps<AcvPopperProps>(), {
    trigger: 'click',
    // placement: 'bottom-start',
    transition: 'fade',
    offset: 0,
    delay: 0,
    hideDelay: 0,
    teleport: true
  });

  const emit = defineEmits<AcvPopperEvents>();

  defineSlots<AcvPopperSlots>();

  const { teleportTarget } = useTeleport();
  const isMounted = useMounted();

  const anchorRef = ref(null);
  const popperRef = ref(null);
  const arrowRef = ref(null);

  // const referenceEl = props.referenceEl === 'parent' ? useParent() : anchorRef;
  const referenceEl: Ref<UnwrapRef<HTMLElement | Ref<UnwrapRef<null>>>> = ref(props.referenceEl || anchorRef);

  watch(() => props.referenceEl, async (value) => {
    await nextTick();

    if (value) {
      referenceEl.value = value;
    }
  });

  const middleware = ref([
    flip(),
    ...(props.flip && !props.placement ? [flip()] : []),
    // TODO implement placement 'auto' for autoPlacement
    ...(!props.flip && !props.placement ? [autoPlacement()] : []),
    offset(props.offset),
    shift(),
    ...(props.arrow
      ? [
        arrow({
          element: arrowRef,
          // padding: 8
        })
      ]
      : [])
  ]);

  // TODO use zindex in floating styles
  const {
    placement,
    floatingStyles,
    middlewareData
  } = useFloating(
    referenceEl,
    popperRef,
    {
      whileElementsMounted: autoUpdate,
      strategy: props.strategy,
      placement: props.placement,
      middleware,
    }
  );

  const arrowX = computed(() => middlewareData.value.arrow?.x ?? null);
  const arrowY = computed(() => middlewareData.value.arrow?.y ?? null);

  const arrowSide = computed(() => {
    const side = placement.value.split('-')[0];

    return {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[side];
  });

  const arrowStyle = computed<CSSProperties>(() => {
    return {
      left: arrowX.value != null ? `${arrowX.value}px` : '',
      top: arrowY.value != null ? `${arrowY.value}px` : '',
      width: `${props.offset}px`,
      height: `${props.offset}px`,
      [arrowSide.value as string]: `${-props.offset}px`,
    };
  });

  // If floating element is already visible then use `hideDelay` otherwise use `showDelay` for debounce
  const _delay = ref(props.modelValue ? props.hideDelay : props.delay);

  const isPopperVisible = useVModel(props, 'modelValue', emit, { defaultValue: false, passive: true });
  watch(isPopperVisible, (isShown) => {
    // Set hide delay when element is visible and show delay when element is hidden
    _delay.value = isShown ? props.hideDelay : props.delay;

    // Trigger events on visibility change
    isShown
      ? emit('show')
      : emit('hide');
  });
  const isPopperVisibleDebounced = refDebounced(isPopperVisible, _delay);

  /*
      Event listeners on anchor
      If moduleValue is provided don't attach any event to modify the visibility of menu
      props.modelValue === undefined => modelValue isn't provided
  */
  if (!props.modelValue) {
    // If trigger is hover
    if (props.trigger === 'hover') {
      // TODO: Try to refactor multiple listeners via https://github.com/vueuse/vueuse/pull/2180
      // Reference
      useEventListener(referenceEl, 'mouseenter', () => {
        if (!props.disabled) {
          isPopperVisible.value = true;
        }
      });
      useEventListener(referenceEl, 'mouseleave', () => {
        isPopperVisible.value = false;
      });

      // Floating
      useEventListener(popperRef, 'mouseenter', () => {
        if (!props.disabled) {
          isPopperVisible.value = true;
        }
      });
      useEventListener(popperRef, 'mouseleave', () => {
        isPopperVisible.value = false;
      });
    }
    else {
      useEventListener(
        referenceEl,
        'click',
        () => { isPopperVisible.value = !isPopperVisible.value; },
      );

      if (props.persist !== true) {
        onClickOutside(
          referenceEl,
          () => {
            isPopperVisible.value = false;
          },
          {
            ignore: props.persist === 'content' ? [popperRef] : [],
          },
        );
      }
    }
  }

  watch(() => props.disabled, (value) => {
    if (value) {
      isPopperVisible.value = false;
    }
  });
</script>

<template>
  <div
    v-if="!props.referenceEl"
    ref="anchorRef"
    class="anchor"
  >
    <slot></slot>
  </div>
  <component
    :is="props.teleport ? Teleport : 'div'"
    v-if="isMounted"
    :to="props.teleport ? teleportTarget : undefined"
  >
    <Transition :name="props.transition || undefined">
      <div
        v-show="isPopperVisibleDebounced"
        ref="popperRef"
        class="acv-popper"
        :style="floatingStyles"
      >
        <div class="content">
          <slot name="content" />
        </div>
        <div
          v-if="props.arrow"
          ref="arrowRef"
          class="arrow"
          :class="arrowSide"
          :style="arrowStyle"
        >
          <slot
            name="arrow"
            :side="arrowSide"
          ></slot>
        </div>
      </div>
    </Transition>
  </component>
</template>

<style scoped>
.anchor {
  position: relative;
  display: inline-flex;
  align-items: center;
  align-self: center;
}

.acv-popper {
  width: max-content;
  max-width: 12rem;
  position: absolute;
  top: 0;
  left: 0;
  z-index: var(--acv-z-index-popover);

  .content {
    position: relative;
    z-index: calc(var(--acv-z-index-popover) + 1);
  }

  .arrow {
    position: absolute;
    width: 1px;
    height: 1px;
    z-index: var(--acv-z-index-dropdown);
    pointer-events: none;
  }
}
</style>

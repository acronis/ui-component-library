<script setup lang="ts">
  import { computed, ref, toRef } from 'vue';
  import type { Ref } from 'vue';
  import { useMounted } from '@vueuse/core';
  import './drawer.css';
  import { useDOMScrollLock } from '../../composables/useDOMScrollLock.ts';
  import { useTeleport } from '../../composables/useTeleport.ts';
  import { onClickSameTarget } from '../../composables/onClickSameTarget.ts';
  import AcvCard from '../card/card.vue';
  import { filterUsedSlots } from '../../utils/vue.ts';
  import type {
    AcvDrawerEvents,
    AcvDrawerProps,
    AcvDrawerSlots
  } from './drawer.ts';

  defineOptions({
    name: 'AcvDrawer',
    inheritAttrs: false
  });
  const props = withDefaults(defineProps<AcvDrawerProps>(), {
    anchor: 'left',
    modelValue: false,
    persistent: false
  });
  const emit = defineEmits<AcvDrawerEvents>();
  const slots = defineSlots<AcvDrawerSlots>();

  const { teleportTarget } = useTeleport();

  const isMounted = useMounted();

  const drawerRef = ref<HTMLDivElement>();
  onClickSameTarget(drawerRef, () => {
    // If dialog is open & persistent prop is false => Close drawer
    if (props.modelValue && !props.persistent) {
      emit('update:modelValue', false);
    }
  });
  const transitionName = computed(() => {
    if (props.anchor === 'bottom') {
      return 'slide-y';
    }
    else if (props.anchor === 'top') {
      return 'slide-y-reverse';
    }
    else if (props.anchor === 'right') {
      return 'slide-x-reverse';
    }

    return 'slide-x';
  });
  const classes = computed(() => {
    return {
      'acv-drawer': true,
      [`acv-drawer-${props.anchor}`]: props.anchor
    };
  });

  const wrapperClasses = computed(() => {
    return {
      'acv-drawer-wrapper': true,
      [`acv-drawer-anchor-${props.anchor}`]: props.anchor
    };
  });

  useDOMScrollLock(toRef(props, 'modelValue') as Ref<boolean>);
</script>

<template>
  <Teleport
    v-if="isMounted"
    :to="teleportTarget"
  >
    <Transition name="bg">
      <div
        v-show="props.modelValue"
        ref="drawerRef"
        :class="wrapperClasses"
      >
        <Transition
          :name="transitionName"
        >
          <AcvCard
            v-show="props.modelValue"
            :class="classes"
            v-bind="{ ...$attrs, ...props }"
          >
            <!-- Recursively pass down slots to child -->
            <template
              v-for="name in filterUsedSlots(slots)"
              #[name]="slotProps"
            >
              <slot
                :name="name"
                v-bind="slotProps"
              />
            </template>
          </AcvCard>
        </Transition>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
  .acv-drawer-wrapper {
    display: flex;
    position: fixed;
    place-items: center;
    background-color: hsl(0deg 0% 0% / .35);
    inset: 0;
    z-index: var(--acv-drawer-z-index);
  }

  .acv-drawer-anchor-left {
    justify-content: flex-start;
  }

  .acv-drawer-anchor-right {
    justify-content: flex-end;
  }

  .acv-drawer-anchor-top {
    flex-direction: column;
    justify-content: flex-start;
  }

  .acv-drawer-anchor-bottom {
    flex-direction: column;
    justify-content: flex-end;
  }

  .acv-drawer-anchor-right,
  .acv-drawer-anchor-left {
    .acv-drawer {
      height: 100%;
      width: 300px;
      max-width: calc(100% - 2rem);
    }
  }

  .acv-drawer-anchor-top,
  .acv-drawer-anchor-bottom {
    .acv-drawer {
      width: 100%;
      height: 300px;
      max-height: calc(100vh - 2rem);
    }
  }

  .acv-drawer {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-drawer-color);
    background-color: var(--acv-color-surface-card);
    overflow: hidden;
    position: relative;
    backface-visibility: hidden;
    inset: 0;
    z-index: var(--acv-drawer-z-index);
    opacity: var(--acv-slide-y-reverse-opacity, 0);
    translate: 0 var(--acv-slide-y-reverse--transform-timing, -8px);
  }
</style>

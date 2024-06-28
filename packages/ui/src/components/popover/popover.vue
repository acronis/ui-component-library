<script setup lang="ts">
  import { computed } from 'vue';
  import AcvPopper from '../popper/popper.vue';
  import AcvCard from '../card/card.vue';
  import type {
    AcvPopoverEvents,
    AcvPopoverProps,
    AcvPopoverSlots
  } from './popover.ts';
  import './popover.css';

  defineOptions({
    name: 'AcvPopover'
  });

  const props = withDefaults(defineProps<AcvPopoverProps>(), {
    trigger: 'click',
    placement: 'right-start',
    arrow: true,
    offset: 32,
    width: 150,
    // teleport: true
  });

  const emit = defineEmits<AcvPopoverEvents>();
  const slots = defineSlots<AcvPopoverSlots>();

  const popoverWidth = computed(() => {
    return props.width ? `${Number(props.width)}px` : 'max-content';
  });
</script>

<template>
  <AcvPopper
    v-bind="{ ...props }"
    style="margin:30px"
    @show="emit('show')"
    @hide="emit('hide')"
  >
    <slot name="reference"></slot>
    <template #content>
      <div
        class="acv-popover"
      >
        <AcvCard
          class="acv-popover__content"
        >
          <slot />
          <div
            v-if="slots.actions"
            class="actions"
          >
            <slot name="actions"></slot>
          </div>
        </AcvCard>
      </div>
    </template>
    <template #arrow>
      <i class="pulsar container">
        <i class="circle first"></i>
        <i class="circle second animation"></i>
        <i class="circle third animation"></i>
      </i>
    </template>
  </AcvPopper>
</template>

<style scoped>
  .acv-popover {
    width: v-bind(popoverWidth);
    max-width: 50vw;
    color: var(--acv-color-text-primary);
    box-shadow:var(--acv-box-shadow) var(--acv-color-effect-shadow-primary);
    position: relative;
    z-index: var(--acv-z-index-popover);

    .arrow {
      position: absolute;
      width: 20px;
      height: 20px;
      background: var(--acv-color-black);
      z-index: var(--acv-z-index-dropdown);
      pointer-events: none;
    }
  }

  .actions {
    padding-inline: 16px;
    padding-block: 16px;
    border-top: var(--acv-border-small) var(--acv-color-divider-primary);
  }

  @keyframes scale-in {
    from {
      transform: scale(.25, .25);
      opacity: 1;
    }

    to {
      transform: scale(1.5, 1.5);
      opacity: 0;
    }
  }

  .pulsar {
    height: 32px;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    .circle {
      border-radius: 50%;
      background: var(--acv-color-form-success);
      position: absolute;
    }

    .animation {
      opacity: 0;
      animation: scale-in 1.5s infinite;
    }

    .first {
      width: 16px;
      height: 16px;
      opacity: 1;
    }

    .second {
      width: 24px;
      height: 24px;
      opacity: .2;
      animation-delay: .25s;
    }

    .third {
      width: 32px;
      height: 32px;
      opacity: .4;
      animation-delay: -.75s;
    }

  }
</style>

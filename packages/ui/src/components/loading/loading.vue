<script setup lang="ts">
  import type { AcvLoadingEvents, AcvLoadingProps, AcvLoadingSlots } from './loading.ts';
  import AcvSpinner from '@/components/spinner/spinner.vue';
  import { computed } from 'vue';

  /**
   * Loading is a widget that indicates a loading state.
   */
  defineOptions({
    name: 'AcvLoading',
  });

  const props = withDefaults(defineProps<AcvLoadingProps>(), {
    modelValue: false,
    fullscreen: false,
    background: 'primary',
    opacity: 0.5,
    size: 'medium',
    color: 'primary',
  });

  const emit = defineEmits<AcvLoadingEvents>();

  const slots = defineSlots<AcvLoadingSlots>();

  const backgroundColor = computed(() => {
    return props.background ? `var(--acv-color-${props.background})` : 'transparent';
  });
  const textColor = computed(() => {
    return props.textColor ? `var(--acv-color-${props.textColor})` : undefined;
  });

  function handleAfterLeave() {
    emit('afterLeave');
  }
</script>

<template>
  <transition
    name="acv-loading-fade"
    @after-leave="handleAfterLeave"
  >
    <div
      v-show="modelValue"
      class="acv-loading"
      :class="{ fullscreen }"
    >
      <div
        class="backdrop"
        :style="`opacity: ${opacity || 1}`"
        :class="{ [`color-${background}`]: background }"
      />
      <div class="content">
        <AcvSpinner
          :color="color"
          :size="size"
        />
        <div
          v-if="title || slots.title"
          class="title"
          :class="{ [`acv-text--color-${textColor}`]: textColor }"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <div
          v-if="description"
          class="description"
        >
          <span
            class="acv-text acv-text--body-24"
            :class="{ [`acv-text--color-${textColor}`]: textColor }"
          >
            {{ description }}
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.acv-loading {
  font-family: var(--acv-loading-font), sans-serif;
  line-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
  position: absolute;
  inset: 0;
  z-index: var(--acv-z-index-loading);
  color: v-bind(textColor);

  .backdrop {
    border-radius: inherit;
    position: absolute;
    inset: 0;
    background-color: v-bind(backgroundColor);

    /* TODO add all colors */
    &.color-primary {
      background-color: var(--acv-color-primary);
    }

    &.color-secondary {
      background-color: var(--acv-color-secondary);
    }
  }

  &.fullscreen {
    position: fixed;
    z-index: var(--acv-z-index-loading);
  }

  .content {
    text-align: center;
    z-index: inherit;
    display: flex;
    align-items: center;
    gap: 8px;

    &:has(.description) {
      flex-direction: column;
    }

    .title {
      font-size: var(--acv-font-size-body, 14px);
      font-style: normal;
      font-weight: var(--acv-font-weight-regular, 400);
      line-height: var(--acv-font-line-height-regular, 24px);

      &:has(~ .description) {
        font-weight: var(--acv-font-weight-strong, 600);
      }
    }

    .description {
      font-size: var(--acv-font-size-body, 14px);
      font-style: normal;
      font-weight: var(--acv-font-weight-regular, 400);
      line-height: var(--acv-font-line-height-regular, 24px); /* 171.429% */
    }
  }
}

.acv-loading-fade-enter,
.acv-loading-fade-leave-active {
  opacity: 0;
}

.backdrop.color-solid-brand-lightest {
  opacity: .95 !important;
}
</style>

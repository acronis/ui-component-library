<script setup lang="ts">
  import { computed, inject } from 'vue';
  import { IconGripDots16 } from '@acronis-platform/icons/grip';
  import { IconClose16 } from '@acronis-platform/icons/close';
  import type { AcvListInjection } from '../list/list.ts';
  import { LIST_KEY } from '../list/list.ts';
  // import AcvTypography from '../typography/typography.vue';
  import AcvIcon from '../icon/icon.vue';
  import AcvButton from '../button/button.vue';
  import type {
    AcvListItemEvents,
    AcvListItemProps,
    AcvListItemSlots
  } from './listItem.ts';
  import './listItem.css';

  defineOptions({
    name: 'AcvListItem',
  });
  const props = defineProps<AcvListItemProps>();
  const emit = defineEmits<AcvListItemEvents>();
  const slots = defineSlots<AcvListItemSlots>();
  const {
    card,
    sortable
  } = inject(LIST_KEY, {}) as AcvListInjection;

  const isCard = computed(() => {
    return card;
  });
  const isDraggable = computed(() => {
    return sortable || props.draggable;
  });

  const classes = computed(() => {
    return {
      'acv-list-item': true,
      'disabled': props.disabled,
      'draggable': isDraggable.value,
      'card': isCard.value,
    };
  });

  function handleClose() {
    emit('close');
  }
</script>

<template>
  <div :class="classes">
    <span
      v-if="isDraggable"
      class="knob"
    >
      <AcvIcon :icon="IconGripDots16" />
    </span>
    <span
      v-if="props.icon"
      class="icon"
    >
      <AcvIcon :icon="props.icon" />
    </span>

    <span class="left-section">
      <slot>
        <span class="title acv-text acv-text--body-24">
          {{ props.title }}
        </span>
      </slot>
    </span>
    <span
      v-if="slots.right"
      class="right-section"
      :class="{ 'displace-left': props.closable }"
    >
      <slot name="right">{{ props.subtitle }}</slot>
    </span>
    <span
      v-if="props.closable"
      class="close"
    >
      <AcvButton
        variant="ghost"
        :icon="IconClose16"
        @click="handleClose"
      />
    </span>

    <!--      <AcvTypography -->
    <!--        :title="props.title" -->
    <!--        :subtitle="props.subtitle" -->
    <!--      /> -->
  </div>
</template>

<style scoped>
  .acv-list-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: start;
    line-height: 24px;
    min-height: 48px;
    color: var(--acv-color-text-primary);
    position: relative;
    padding-block: 12px;
    padding-inline: 24px;

    &:not(:last-of-type) {
      border-bottom:
          var(--acv-border-style-solid)
          var(--acv-list-item-border-color)
          var(--acv-border-regular);
    }

    & > * {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.card {
       background-color: var(--acv-color-transparent);
       border: var(--acv-list-item-border);
       border-radius: var(--acv-radius-medium);
    }

    &.disabled {
      opacity: .5;
      pointer-events: none;
    }

    &.valued {
      cursor: pointer;
    }

    &.fixed {
      .knob {
        opacity: .3;
        cursor: default;
      }
    }

    .knob {
      cursor: grab;
      width: 24px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
    }

    .icon {
      max-width: 24px;
      margin-inline-end: 8px;
    }

    .close {
      cursor: pointer;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 16px;
      top: 0;
    }

    .right-section {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 8px;
      margin-inline-start: auto;
      padding-inline-start: 16px;

      &.displace-left {
        margin-right: 32px;
      }
    }
  }
</style>

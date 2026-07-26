<script setup lang="ts">
  import type { AcvDialogEvents, AcvDialogProps, AcvDialogSlots } from './dialog.ts';
  import { IconClose16 } from '@acronis-platform/icons/close';
  import { onClickOutside, onKeyDown, useDraggable } from '@vueuse/core';
  import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';
  import { computed, nextTick, ref, watch } from 'vue';
  import AcvButton from '../button/button.vue';

  import './dialog.css';

  /**
   * Dialog component informs users while preserving the current page state.
   */
  defineOptions({
    name: 'AcvDialog'
  });

  const {
    backdrop = true,
    closable = true,
    closeOnClickOutside = true,
    closeOnEscape = true,
    draggable = false,
    height = 'small',
    lockFocus = true,
    title,
    width = 'small'
  } = defineProps<AcvDialogProps>();

  const emit = defineEmits<AcvDialogEvents>();
  const slots = defineSlots<AcvDialogSlots>();
  const model = defineModel<boolean>();
  const dialog = ref<HTMLDialogElement>();
  const close = ref<HTMLButtonElement>();
  const body = ref<HTMLElement>();
  const header = ref<HTMLElement>();

  onKeyDown('Escape', () => {
    if (model.value && closeOnEscape) {
      onClose();
    }
  });

  onClickOutside(body, () => {
    if (model.value && closeOnClickOutside) {
      onClose();
    }
  });

  const { activate, deactivate } = useFocusTrap(body);

  const { x, y, isDragging } = useDraggable(header, {
    preventDefault: true,
    disabled: !draggable
  });

  // Trigger method important to show as modal dialog with backdrop
  watch(model, async (value) => {
    await nextTick();
    if (dialog.value && value) {
      dialog.value.showModal();
    }

    if (value && lockFocus) {
      activate();
    }
    else {
      deactivate();
    }
  }, { immediate: true });

  function onClose() {
    emit('update:modelValue', false);
    dialog.value?.close();

    // Reset draggable position
    x.value = 0;
    y.value = 0;
  }

  const classes = computed(() => {
    return {
      'acv-dialog': true,
      'backdrop': backdrop,
      'draggable': draggable,
      'is-dragging': isDragging.value,
      [`height-${height}`]: height,
      [`width-${width}`]: width,
    };
  });

  const computedStyles = computed(() => ({
    ...(draggable && {
      // apply auto margins initially, to place dialog in center
      margin: draggable && x.value !== 0 && y.value !== 0 ? 0 : 'auto',
      left: `${x.value}px`,
      top: `${y.value}px`
    })
  }));
</script>

<template>
  <dialog
    ref="dialog"
    :class="classes"
    role="alertdialog"
    aria-labelledby="label-area"
    aria-describedby="content-area"
    :aria-modal="backdrop"
    :aria-hidden="!model"
    :style="computedStyles"
  >
    <section
      ref="body"
      class="body"
    >
      <header
        v-if="title || slots.title"
        ref="header"
      >
        <div
          id="label-area"
          class="title"
        >
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <AcvButton
          v-if="closable"
          ref="close"
          variant="ghost"
          class="close"
          @click="onClose"
        >
          <IconClose16 />
        </AcvButton>
      </header>
      <main id="content-area">
        <div class="scrollable">
          <slot />
        </div>
      </main>
      <footer v-if="slots.footer">
        <slot name="footer" />
      </footer>
    </section>
  </dialog>
</template>

<style scoped>
  .acv-dialog {
    z-index: var(--acv-dialog-z-index);
    border-radius: var(--acv-radius-regular, 4px);
    border: none;
    box-shadow: 0 10px 20px 0 hsl(215deg 30% 20% / 0.9);
    width: var(--acv-dialog-width);
    height: var(--acv-dialog-height);
    min-height: 256px;
    padding: 0;
    max-width: calc(100% - 2em - var(--acv-dialog-margin));
    max-height: calc(100% - 2em - var(--acv-dialog-margin));
    margin: auto;

    &.backdrop::backdrop {
      background-color: var(--acv-dialog-backdrop-color);
    }

    &.height-fit {
      --acv-dialog-height: var(--acv-dialog-height-fit);
      --acv-dialog-margin: var(--acv-dialog-margin-small);
    }

    &.height-auto {
      --acv-dialog-height: var(--acv-dialog-height-auto);
      --acv-dialog-margin: var(--acv-dialog-margin-small);
    }

    &.height-small {
      --acv-dialog-height: var(--acv-dialog-height-small);
      --acv-dialog-margin: var(--acv-dialog-margin-small);
    }

    &.height-medium {
      --acv-dialog-height: var(--acv-dialog-height-medium);
      --acv-dialog-margin: var(--acv-dialog-margin-medium);
    }

    &.height-large {
      --acv-dialog-height: var(--acv-dialog-height-large);
      --acv-dialog-margin: var(--acv-dialog-margin-large);
    }

    &.width-small {
      --acv-dialog-width: var(--acv-dialog-width-small);
    }

    &.width-medium {
      --acv-dialog-width: var(--acv-dialog-width-medium);
    }

    &.width-large {
      --acv-dialog-width: var(--acv-dialog-width-large);
    }

    &.width-x-large {
      --acv-dialog-width: var(--acv-dialog-width-x-large);
    }

    &.draggable {
      header {
        cursor: move;
        user-select: none;
      }
    }

    &.is-dragging,
    &.is-resizing {
      user-select: none;
    }

    &.is-dragging {
      will-change: top, left;

      header {
        cursor: grabbing;
      }
    }

    .close {
      color: var(--acv-color-icon-primary);
      cursor: pointer;
    }

    .body {
      /* display: grid; */

      /* grid-template-rows: 64px minmax(0, 1fr) auto; */
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
      width: 100%;
    }

    header {
      display: grid;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      padding-inline: 16px;
      gap: 16px;
      border-bottom: var(--acv-border-small) var(--acv-dialog-border-color);
      grid-template-columns: 1fr 32px;
      flex-grow: 1;
      max-height: 64px;

      .title {
        font-size: var(--acv-dialog-title-font-size);
        line-height: var(--acv-dialog-title-line-height);
        font-weight: var(--acv-dialog-title-weight);
        color: var(--acv-dialog-title-color);
        margin-block: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    main {
      display: flex;
      background-color: var(--acv-dialog-bg-color);
      flex-grow: 1;
      overflow: auto;

      /* for Firefox */
      min-height: 0;

      & > * {
        flex-basis: 100%;
      }

      .scrollable {
        overflow: auto;
      }
    }

    footer {
      position: relative;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: flex-end;
      padding: var(--acv-dialog-footer-v-padding) var(--acv-dialog-footer-h-padding);
      border-top: var(--acv-border-small) var(--acv-dialog-border-color);
      gap: 16px;

      menu {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1rem;
      }
    }

    .acv-dialog__resizer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 10px;
      height: 10px;
      cursor: nw-resize;
      background-image: linear-gradient(
          -45deg,
          transparent calc(30% - 1px),
          var(--acv-dialog-resizer-color) 30%,
          transparent calc(30% + 1px),
          transparent calc(50% - 1px),
          var(--acv-dialog-resizer-color) 50%,
          transparent calc(50% + 1px)
      );
      border-radius: 0 0 var(--acv-dialog-radius) 0;
    }
  }
</style>

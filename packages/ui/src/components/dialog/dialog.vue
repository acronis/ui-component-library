<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue';
  import { onClickOutside, onKeyDown, useDraggable } from '@vueuse/core';
  import type { AcvDialogEvents, AcvDialogProps, AcvDialogSlots } from './dialog.ts';
  import './dialog.css';

  const {
    title,
    closeOnEscape,
    closable,
    closeOnClickOutside,
    backdrop,
    draggable,
    height,
    width
  } = withDefaults(defineProps<AcvDialogProps>(), {
    closeOnEscape: true,
    closable: true,
    closeOnClickOutside: true,
    backdrop: true,
    draggable: false,
  });

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
    autofocus
    role="alertdialog"
    aria-labelledby="label-area"
    aria-describedby="content-area"
    :aria-modal="backdrop"
    :aria-hidden="!model"
    :style="computedStyles"
  >
    <button
      v-if="closable"
      ref="close"
      class="dialog-close"
      @click="onClose"
    >
      X
    </button>
    <section
      ref="body"
      class="body"
    >
      <header
        v-if="title || slots.title"
        ref="header"
      >
        <h2 id="label-area">
          <slot name="title">
            {{ title }}
          </slot>
        </h2>
      </header>
      <main id="content-area">
        <div class="scrollable">
          <slot />
        </div>
      </main>
      <footer v-if="slots.footer">
        <slot name="footer"></slot>
      </footer>
    </section>
  </dialog>
</template>

<style scoped>
  .acv-dialog {
    z-index: var(--acv-dialog-z-index);
    border-radius: var(--acv-radius-regular, 4px);
    border: none;
    box-shadow: 0 10px 20px 0 rgb(36 49 67 / 0.90);
    width: var(--acv-dialog-width);
    height: var(--acv-dialog-height);
    min-height: 256px;
    padding: 0;
    max-width: calc(100% - 2em - var(--acv-dialog-margin));
    max-height: calc(100% - 2em - var(--acv-dialog-margin));

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
      }
    }

    &.is-dragging {
      user-select: none;

      header {
        cursor: grabbing;
      }
    }

    .dialog-close {
      position: absolute;
      width: 32px;
      height: 32px;
      margin-inline: 24px;
      margin-block: 16px;
      right: 0;
      top:0;
      cursor: pointer;
    }

    .body {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      overflow: hidden;
      height: 100%;
      width: 100%;
    }

    header {
      display: grid;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      padding-inline: 32px 80px;
      border-bottom: 1px solid var(--acv-dialog-border-color);

      h2 {
        font-size: var(--acv-dialog-title-font-size);
        font-weight: 600;
        color: var(--acv-dialog-title-color);
        margin-block: 0 ;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    main {
      display: flex;
      background-color: var(--acv-dialog-bg-color);

      & > * {
        flex-basis: 100%;
      }

      .scrollable {
        overflow: auto;
      }
    }

    footer {
      border-top: 1px solid var(--acv-dialog-border-color);

      menu {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1rem;
      }
    }

    .acv-dialog__wrapper {
      position: absolute;
      top: 100px;
      display: flex;
      flex-direction: column;
      max-width: calc(100vw - 28px);
      pointer-events: auto;
      background-color: var(--acv-dialog-bg-color);
      border: 0;
      border-radius: var(--acv-dialog-radius);
      box-shadow: var(--acv-dialog-shadow);
      transform: translateZ(0);

      .acv-dialog--dragging,
      .acv-dialog--resizing {
        user-select: none;
      }

      .acv-dialog--dragging {
        will-change: top, left;
      }
    }

    .acv-dialog--inner .acv-dialog__wrapper {
      position: absolute;
    }

    .acv-dialog__header {
      position: relative;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      padding: var(--acv-dialog-header-v-padding) var(--acv-dialog-header-h-padding);
      border-bottom: var(--acv-border-shape) var(--acv-dialog-d-color);
    }

    .acv-dialog--draggable .acv-dialog__header {
      cursor: move;
      user-select: none;
    }

    .acv-dialog--undivided .acv-dialog__header {
      border-bottom: 0;
    }

    .acv-dialog__title {
      flex: 1 0 0;
      font-size: var(--acv-dialog-title-font-size);
      font-weight: var(--acv-dialog-title-weight);
      color: var(--acv-dialog-title-color);
    }

    .acv-dialog__content {
      position: relative;
      flex: auto;
      min-width: 0;
      min-height: 0;
      padding: var(--acv-dialog-body-v-padding) var(--acv-dialog-body-h-padding);
      line-height: var(--acv-dialog-body-line-height);
    }

    .acv-dialog__footer {
      position: relative;
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: flex-end;
      padding: var(--acv-dialog-footer-v-padding) var(--acv-dialog-footer-h-padding);
      border-top: var(--acv-border-style-solid) var(--acv-dialog-border-color);
    }

    .acv-dialog--undivided .acv-dialog__footer {
      border-top: 0;
    }

    .acv-dialog__close {
      display: flex;
      align-items: center;
      height: 24px;
      padding: 0;
      margin-inline-start: 6px;
      color: var(--acv-dialog-close-color);
      cursor: pointer;
      background-color: transparent;
      border: 0;
      outline: 0;
      transition: var(--acv-transition-color);

      &:hover,
      &:focus {
        color: var(--acv-dialog-close-color-hover);
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

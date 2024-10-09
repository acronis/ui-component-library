<script setup lang="ts">
  import type { AcvButtonProps, AcvButtonSlots } from './button.ts';
  import { useButton } from '@/components/button/useButton.ts';
  import AcvSpinner from '@/components/spinner/spinner.vue';
  import { vAutofocus } from '@/directives/autofocus.ts';

  import './button.css';

  /**
   * Button is used to highlight key actions and clearly inform user of what will happen after the interaction.
   *
   * @displayName Button component
   */
  defineOptions({ name: 'AcvButton' });

  const props = withDefaults(defineProps<AcvButtonProps>(), {
    is: 'button',
    buttonType: 'button',
    color: 'primary',
    size: 'medium'
  });

  defineSlots<AcvButtonSlots>();

  const { isDisabled, classes, styles, attrs } = useButton(props);

  /**
   * Disable click if component is link. Use "capture" to prevent RouterLink click
   */
  function handleClick(event: MouseEvent) {
    if (props.is !== 'button' && isDisabled.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
</script>

<template>
  <component
    :is="is"
    v-autofocus="autofocus"
    v-bind="attrs"
    :class="classes"
    :style="styles"
    @click.capture="handleClick"
  >
    <template
      v-if="$slots.prepend || icon"
    >
      <slot name="prepend">
        <component
          :is="icon"
          v-if="icon"
        />
      </slot>
    </template>
    <span
      v-if="loading"
      class="loader"
    >
      <AcvSpinner :size="size" />
    </span>
    <template
      v-if="$slots.default"
    >
      <span
        class="content"
        :class="{ hidden: loading }"
      ><slot /></span>
    </template>
    <template
      v-if="$slots.append || appendIcon"
    >
      <slot name="append">
        <component
          :is="appendIcon"
          v-if="appendIcon"
        />
      </slot>
    </template>
  </component>
</template>

<style scoped>
  .acv-button {
    align-items: center;
    background-clip: padding-box;
    background-color: var(--acv-button-background-color);
    block-size: var(--acv-button-height);
    border-color: var(--acv-button-border-color);
    border-radius: var(--acv-button-border-radius);
    border-style: var(--acv-button-border-style);
    border-width: var(--acv-button-border-width);
    color: var(--acv-button-text-color);
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    font-family: var(--acv-font-family-default), sans-serif;
    font-size: var(--acv-button-font-size);
    font-weight: var(--acv-font-weight-strong);
    gap: var(--acv-button-content-gap);
    height: var(--acv-button-height);
    justify-content: center;
    line-height: var(--acv-button-height);
    max-width: 100%;
    min-inline-size: var(--acv-button-min-width);
    outline: none;
    padding-block: 0;
    padding-inline: var(--acv-button-padding);
    position: relative;
    text-align: center;
    transition: all 250ms;
    white-space: nowrap;

    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      place-items: center;
      display: inline-grid;
      grid-auto-flow: column;
      gap: var(--acv-button-content-gap);

      &.hidden {
        visibility: hidden;
      }
    }

    /* Sizes */

    &.small {
      --acv-button-font-size: var(--acv-button-font-size-small);
      --acv-button-height: var(--acv-button-height-small);
      --acv-button-padding: var(--acv-button-padding-small);
      --acv-icon-size: var(--acv-icon-size-xx-small);
      --acv-button-content-gap: var(--acv-button-content-gap-small);
      --acv-button-min-width: var(--acv-button-min-width-small);
    }

    &.medium {
      --acv-button-font-size: var(--acv-button-font-size-medium);
      --acv-button-height: var(--acv-button-height-medium);
      --acv-button-padding: var(--acv-button-padding-medium);
      --acv-icon-size: var(--acv-icon-size-x-small);
      --acv-button-content-gap: var(--acv-button-content-gap-medium);
      --acv-button-min-width: var(--acv-button-min-width-medium);
    }

    &.large {
      --acv-button-font-size: var(--acv-button-font-size-large);
      --acv-button-height: var(--acv-button-height-large);
      --acv-button-padding: var(--acv-button-padding-large);
      --acv-icon-size: var(--acv-icon-size-medium);
      --acv-button-content-gap: var(--acv-button-content-gap-large);
      --acv-spinner-size: var(--acv-spinner-size-large);
      --acv-button-min-width: var(--acv-button-min-width-large);
    }

    /* Button styles */

    &.pill {
      border-radius: var(--acv-radius-large);
    }

    &.squared {
      border-radius: var(--acv-radius-zero);
    }

    &.block {
      width: 100%;
    }

    /* Button variants */

    &.solid {
      --acv-button-background-color-active: hsl(
          from var(--acv-button-color) h s calc(l - 25)
      );
      --acv-button-background-color-disabled: var(
          --acv-button-background-color
      );
      --acv-button-background-color-hover: hsl(
          from var(--acv-button-color) h s calc(l - 15)
      );
      --acv-button-background-color: var(--acv-button-color);
      --acv-button-border-width: var(--acv-border-none);
      --acv-button-text-color-disabled: hsl(
          from var(--acv-button-text-color) h s calc(l + 10)
      );
      --acv-button-text-color: var(--acv-color-text-inversed-primary);
    }

    &.outline {
      --acv-button-background-color-active: hsl(from var(--acv-button-color) h s calc(l + 30));
      --acv-button-background-color-disabled: var(--acv-button-background-color);
      --acv-button-background-color-hover: hsl(from var(--acv-button-color) h s calc(l + 30));
      --acv-button-background-color: var(--acv-color-transparent);
      --acv-button-text-color: var(--acv-button-color);
      --acv-button-text-color-disabled: hsl(from var(--acv-button-text-color) h s calc(l + 10));
      --acv-button-text-color-hover: hsl(from var(--acv-button-text-color) h s calc(l - 10));
      --acv-button-text-color-active: hsl(from var(--acv-button-text-color) h s calc(l - 20));
      --acv-button-border-color-disabled: hsl(from var(--acv-button-color) h s calc(l + 10));
      --acv-button-border-color-hover: hsl(from var(--acv-button-color) h s calc(l - 10));
      --acv-button-border-color-active: hsl(from var(--acv-button-color) h s calc(l - 30));
      --acv-button-border-color: var(--acv-button-color);
      --acv-button-border-width: var(--acv-border-regular);
    }

    &.ghost {
      --acv-button-background-color-active: hsl(from var(--acv-button-color) h calc(s - 12) calc(l + 23));
      --acv-button-background-color-disabled: hsl(from var(--acv-button-background-color) h s calc(l + 10));
      --acv-button-background-color-hover: hsl(from var(--acv-button-color) calc(h - 1) calc(s - 11) calc(l + 33));
      --acv-button-background-color: var(--acv-color-transparent);
      --acv-button-border-width: var(--acv-base-border-width-00);
      --acv-button-text-color: var(--acv-button-color);
      --acv-button-text-color-active: hsl(from var(--acv-button-color) h s calc(l - 20));
      --acv-button-text-color-disabled: hsl(from var(--acv-button-color) h s calc(l - 10));
      --acv-button-text-color-hover: hsl(from var(--acv-button-color) h s calc(l - 10));
    }

    &.light {
      --acv-button-background-color-active: hsl(
          from var(--acv-button-background-color) calc(h - 5) calc(s + 5)
          calc(l - 20)
      );
      --acv-button-background-color-disabled: hsl(
          from var(--acv-button-background-color) h s calc(l + 10)
      );
      --acv-button-background-color-hover: hsl(
          from var(--acv-button-background-color) h s calc(l - 10)
      );
      --acv-button-background-color: hsl(
          from var(--acv-button-color) h s l / 0.4
      );
      --acv-button-text-color-active: hsl(
          from var(--acv-color-text-secondary) h s calc(l - 30)
      );
      --acv-button-text-color-hover: hsl(
          from var(--acv-color-text-secondary) h s calc(l - 20)
      );
      --acv-button-text-color: var(--acv-color-text-secondary);
    }

    /* Button colors */

    &.primary {
      --acv-button-color: var(--acv-color-primary);

      &.solid {
        --acv-button-background-color-active: var(--acv-color-button-active-primary);
        --acv-button-background-color-disabled: var(--acv-color-button-disabled);
        --acv-button-background-color-hover: var(--acv-color-button-hover-primary);
        --acv-button-text-color: var(--acv-color-text-inversed-primary);
      }
    }

    &.secondary {
      --acv-button-color: var(--acv-color-button-secondary);
    }

    &.inverted {
      --acv-button-color: var(--acv-color-button-inversed);
      --acv-button-background-color-active: var(--acv-color-button-active-inversed);
      --acv-button-background-color-disabled: var(--acv-color-button-disabled-inversed);
      --acv-button-background-color-hover: var(--acv-color-button-hover-inversed);
      --acv-button-background-color: var(--acv-color-button-inversed);
      --acv-button-text-color-disabled: var(--acv-color-link-disabled-inversed);
      --acv-button-text-color: var(--acv-color-link-inversed-primary);
    }

    &.neutral {
      --acv-button-color: var(--acv-color-neutral);
    }

    &.info {
      --acv-button-color: var(--acv-color-info);

      &.outline {
        --acv-button-border-color: var(--acv-color-info-border);
        --acv-button-text-color: var(--acv-color-info-text);
        --acv-button-text-color-hover: var(--acv-color-info-text);
      }
    }

    &.success {
      --acv-button-color: var(--acv-color-success);

      &.outline {
        --acv-button-border-color: var(--acv-color-success-border);
        --acv-button-text-color: var(--acv-color-success-text);
        --acv-button-text-color-hover: var(--acv-color-success-text);
      }
    }

    &.warning {
      --acv-button-color: var(--acv-color-warning);

      &.outline {
        --acv-button-border-color: var(--acv-color-warning);
        --acv-button-text-color: var(--acv-color-warning-text);
        --acv-button-text-color-hover: var(--acv-color-warning-text);
      }
    }

    &.critical {
      --acv-button-color: var(--acv-color-critical);
    }

    &.danger {
      --acv-button-color: var(--acv-color-button-danger);

      &.outline {
        --acv-button-border-color: var(--acv-color-button-danger);
        --acv-button-text-color: var(--acv-color-button-danger);
        --acv-button-text-color-hover: var(--acv-color-button-danger);
      }
    }

    &.white {
      &.solid {
        --acv-button-text-color: var(--acv-color-text-primary);
      }
    }

    &.loading {
      cursor: default;
    }

    /* States */

    &:hover:not(.disabled, .loading),
    &.hover:not(.disabled, .loading) {
      --acv-button-border-color: var(--acv-button-border-color-hover);
      --acv-button-background-color: var(--acv-button-background-color-hover);
      --acv-button-text-color: var(--acv-button-text-color-hover);
      cursor: pointer;
    }

    &:active,
    &.active {
     transform: translateY(1px);
    }

    &:active,
    &.active,
    &.selected {
      --acv-button-background-color: var(--acv-button-background-color-active);
      --acv-button-border-color: var(--acv-button-border-color-active);
      --acv-button-text-color: var(--acv-button-text-color-active, currentColor);
    }

    &:focus-visible,
    &.focus {
      outline: var(--acv-button-focus-outline);
    }

    &:disabled,
    &[disabled],
    &.disabled {
      background-color: var(--acv-button-background-color-disabled);
      color: var(--acv-button-text-color-disabled);
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
      box-shadow: none;

      &:not(.inverted) {
        --acv-button-border-color: var(--acv-button-border-color-disabled);
      }
    }

    /* Elements */

    .loader {
      position: absolute;
      display: flex;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
</style>

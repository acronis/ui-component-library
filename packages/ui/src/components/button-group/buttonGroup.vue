<script setup lang="ts">
  import { computed } from 'vue';
  import type { ButtonGroupEvents, ButtonGroupProps, ButtonGroupSlots } from './buttonGroup.ts';
  import './buttonGroup.css';

  const { size, vertical } = defineProps<ButtonGroupProps>();

  defineEmits<ButtonGroupEvents>();
  defineSlots<ButtonGroupSlots>();

  const classes = computed(() => {
    return {
      'acv-button-group': !vertical,
      'acv-button-group-vertical': vertical,
      [`acv-button-group-size-${size}`]: size,
    };
  });
</script>

<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<style scoped>
  .acv-button-group,
  .acv-button-group-vertical {
    position: relative;
    display: inline-flex;
    vertical-align: middle;

    > .acv-button {
      position: relative;
      flex: 1 1 auto;
    }

    > .acv-button-check:checked + .acv-button,
    > .acv-button-check:focus + .acv-button,
    > .acv-button:hover,
    > .acv-button:focus,
    > .acv-button:active,
    > .acv-button.active {
      z-index: var(--acv-z-index-normal);
    }
  }

  .acv-button-group {
    border-radius: var(--acv-button-border-radius);

    /* Prevent double borders when buttons are next to each other */

    > :not(.acv-button-check:first-child) + .acv-button,
    > .acv-button-group:not(:first-child) {
      margin-left: calc(var(--acv-button-border-width) * -1);
    }

    /* Reset rounded corners */

    > .acv-button:not(:last-child, .dropdown-toggle),
    > .acv-button.dropdown-toggle-split:first-child,
    > .acv-button-group:not(:last-child) > .acv-button {
      border-end-start-radius: 0;
      border-end-end-radius: 0;
    }

    /* The left radius should be 0 if the button is: */

    /* - the "third or more" child */

    /* - the second child and the previous element isn't `.acv-button-check` (making it the first child visually) */

    /* - part of a btn-group which isn't the first child */

    > .acv-button:nth-child(n + 3),
    > :not(.acv-button-check) + .acv-button,
    > .acv-button-group:not(:first-child) > .acv-button {
      border-start-start-radius: 0;
      border-start-end-radius: 0;
    }
  }

  /* Sizing */

  /* Remix the default button sizing classes into new ones for easier manipulation. */

  .acv-button-group-small > .acv-button { /* @include .acv-button-sm; */ }
  .acv-button-group-large > .acv-button { /* @include .acv-button-lg; */}

  /* Split button dropdowns */

  .dropdown-toggle-split {
    padding-right: calc(var(--acv-button-padding-x) * .75);
    padding-left: calc(var(--acv-button-padding-x) * .75);

    &:after,
    .dropup &:after,
    .dropend &:after {
      margin-inline-start: 0;
    }

    .dropstart &:before {
      margin-inline-end: 0;
    }
  }

  .acv-button-small + .dropdown-toggle-split {
    padding-right: calc(var(--acv-button-padding-x-sm) * .75);
    padding-left: calc(var(--acv-button-padding-x-sm) * .75);
  }

  .acv-button-large + .dropdown-toggle-split {
    padding-right:calc( var(--acv-button-padding-x-lg) * .75);
    padding-left: calc(var(--acv-button-padding-x-lg) * .75);
  }

  /* The clickable button for toggling the menu */

  /* Set the same inset shadow as the :active state */

  .acv-button-group.show .dropdown-toggle {
    box-shadow: var(--acv-button-active-box-shadow);

    /* Show no shadow for `.acv-button-link` since it has no other button styles. */

    &.acv-button-link {
      box-shadow: none;
    }
  }

  /* Vertical button groups */

  .acv-button-group-vertical {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    > .acv-button,
    > .acv-button-group {
      width: 100%;
    }

    > .acv-button:not(:first-child),
    > .acv-button-group:not(:first-child) {
      margin-top: calc(var(--acv-button-border-width) * -1); /* stylelint-disable-line function-disallowed-list */
    }

    /* Reset rounded corners */

    > .acv-button:not(:last-child, .dropdown-toggle),
    > .acv-button-group:not(:last-child) > .acv-button {
      border-bottom-left-radius: var(--acv-border-radius-none);
      border-bottom-right-radius: var(--acv-border-radius-none);
    }

    > .acv-button ~ .acv-button,
    > .acv-button-group:not(:first-child) > .acv-button {
      border-top-left-radius: var(--acv-border-radius-none);
      border-top-right-radius: var(--acv-border-radius-none);
    }
  }
</style>

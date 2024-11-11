<script lang="ts" setup>
  defineProps<{
    disabled?: boolean
  }>();
</script>

<template>
  <label
    class="go-pick"
    :class="disabled && 'go-pick_disabled'"
  >
    <slot name="input" />
    <span class="content">
      <span class="icon">
        <slot name="icon" />
      </span>
      <span
        v-if="$slots.default"
        class="label"
      >
        <slot />
      </span>
    </span>
  </label>
</template>

<style scoped>
  .go-pick {
    /* @mixin text-ui-13; */
    position: relative;
    display: inline-flex;
    color: var(--base-pick-color);
    cursor: pointer;
  }

  .go-pick_disabled {
    color: var(--color-glyph-tretiary);
    cursor: default;
  }

  .go-pick :deep(input) {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .content {
    position: relative;
    display: inline-flex;
    flex-grow: 1;
    align-items: flex-start;
    border: var(--go-pick-border, solid 2px transparent);
    border-radius: var(--go-pick-border-radius, 0);
    background-color: var(--go-pick-background-color, transparent);
    gap: 8px;
    min-block-size: 24px;
    padding-block: var(--go-pick-padding-block, 0);
    padding-inline: var(--go-pick-padding-inline, 2px);
  }

  input:focus-visible + .content {
    border-color: var(--color-framing-focus);
  }

  input:checked + .content {
    border: var(--go-pick-selected-border, 0);
    background-color: var(--go-pick-selected-background-color, transparent);
  }

  .icon {
    display: flex;
    align-items: center;
    block-size: var(--line-height-text-ui-13);
  }

  .label {
    flex-grow: 1;
  }
</style>

<script>
  import uniqueId from '../../mixins/uniqueId';

  export default {
    name: 'Toggle',
    /**
     * Toggle component that alternates between two states
     */

    // Use unique ID so clicking the label also toggles the Toggle
    mixins: [uniqueId],
    props: {
      value: Boolean,
      checked: { type: Boolean, default: undefined },
      disabled: Boolean,
    },
    emits: ['input'],
  };
</script>

<template>
  <div class="fig-toggle">
    <input
      :id="uniqueId"
      class="fig-toggle__knob"
      type="checkbox"
      :checked="checked !== undefined ? checked : value"
      :value="value"
      :disabled="disabled"
      @change="$emit('input', $event.target.checked)"
    >
    <label
      class="fig-toggle__label"
      :for="uniqueId"
    >
      <slot>Item</slot>
    </label>
  </div>
</template>

<style scoped>
.fig-toggle {
  position: relative;
  display: flex;
  align-items: center;
  height: var(--size-medium);
  cursor: default;

  input {
    opacity: 0;
  }

  input:checked + .fig-toggle__label:before {
    color: var(--black);
    background-color: var(--black8);
  }

  input:checked + .fig-toggle__label:after {
    transform: translateX(12px);
  }

  input:checked:disabled + .fig-toggle__label:before {
    background-color: var(--black);
    border: 1px solid var(--black);
  }

  input:focus + .fig-toggle__label:before {
    box-shadow: 0 0 0 2px var(--blue);
  }

  input:disabled + .fig-toggle__label {
    color: var(--black);
    opacity: 0.3;
  }

  .fig-toggle__label {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: -16px;
    padding: 0 var(--size-xsmall) 0 var(--size-large);
    color: var(--black8);
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xsmall);
    font-family: var(--font-stack);
    line-height: var(--font-line-height);
    letter-spacing: var(--font-letter-spacing-pos-xsmall);
    user-select: none;

    /*  Tracker */
    &:before {
      position: absolute;
      top: 10px;
      left: 8px;
      display: block;
      width: 22px;
      height: 10px;
      background-color: var(--white);
      border: 1px solid var(--black8);
      border-radius: 6px;
      transition: background-color 0.2s ease;
      content: '';
    }

    /* Slider */
    &:after {
      position: absolute;
      top: 10px;
      left: 8px;
      display: block;
      width: 10px;
      height: 10px;
      background-color: var(--white);
      border: 1px solid var(--black8);
      border-radius: 50%;
      transition: transform 0.2s;
      content: '';
    }
  }
}
</style>

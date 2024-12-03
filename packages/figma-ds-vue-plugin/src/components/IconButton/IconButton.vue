<script>
  export default {
    name: 'Icon',
    /**
     * Icon button component.
     * Default Figma icons are located in ./assets/icons
     */
    props: {
      icon: { type: String, default: 'heart' },
      iconText: String,
      selected: Boolean,
      disabled: Boolean,
      spinning: Boolean,
    },
    emits: ['click'],
    methods: {
      onClick(e) {
        e.preventDefault();
        if (!this.disabled) {
          this.$emit('click', e);
        }
      },
    },
  };
</script>

<template>
  <span
    v-if="!iconText"
    class="fig-icon fig-icon-btn"
    :class="{
      [`fig-icon--${icon}`]: icon,
      'fig-icon-btn--selected': selected,
      'fig-icon-btn--spinning': spinning,
      'fig-icon-btn--disabled': disabled,
    }"
    :tabIndex="disabled ? 'false' : 0"
    @click="onClick"
    @keydown.space="onClick"
  />
  <span
    v-else
    class="fig-icon fig-icon--text fig-icon-btn"
    :class="{ 'fig-icon-btn--selected': selected, spinning, disabled }"
    :tabIndex="disabled ? 'false' : 0"
    @click="onClick"
    @keydown.space="onClick"
    v-html="iconText"
  />
</template>

<style scoped>
/*
  Inherits the .icon class styles (_icon.css)
  but overrides some additional styles
*/
.fig-icon-btn {
  min-width: var(--size-medium);
  min-height: var(--size-medium);
  background-position: -2px -2px;
  border: 2px solid transparent;
  border-radius: var(--border-radius-small);
  outline: none;

  &:hover {
    background-color: var(--hover-fill);
  }

  &:active,
  &:focus {
    border: 2px solid var(--blue);
    outline: none;
  }

  &.fig-icon-btn--disabled {
    opacity: 0.3;

    &:hover {
      background-color: transparent;
    }

    &:active,
    &:focus {
      border: 2px solid transparent;
      outline: none;
    }
  }

  &.fig-icon-btn--selected {
    color: var(--white);
    background-color: var(--blue);

    &:hover {
      color: var(--white);
      background-color: var(--blue);
    }

    &:active {
      color: var(--white);
      background-color: var(--blue);
    }
  }
}

/* Spinning animation moved to ->  _animations.css */
</style>

<script>
  import uniqueId from '../../mixins/uniqueId';

  export default {
    name: 'NumInput',
    // Use unique ID so clicking the label also focuses the input
    mixins: [uniqueId],
    props: {
      icon: { type: String, default: undefined },
      iconText: { type: String, default: undefined },
      value: { type: [Number, String], default: 0 },
      disabled: Boolean,
      border: Boolean,
      spinning: Boolean,
      min: { type: [Number, String], default: undefined },
      max: { type: [Number, String], default: undefined },
      steps: { type: [Number, String], default: 1 },
      unit: { type: String, default: undefined },
    },
    emits: ['input'],
    /**
     * Input component with optional icon
     */
    data: () => ({
      isAltPressed: false,
      isMouseDown: false,
      mouseDownTarget: undefined,
      initialMousePos: null,
      initialValue: undefined,
    }),
    mounted() {
      this.initialValue = this.value;
      document.addEventListener('keydown', this.handleKeyAltDown);
      document.addEventListener('keyup', this.handleKeyAltUp);
    },
    beforeUnmount() {
      document.removeEventListener('keydown', this.handleKeyAltDown);
      document.removeEventListener('keyup', this.handleKeyAltUp);
    },
    methods: {
      // Event handlers
      handleMouseDown(event, target) {
        this.isMouseDown = true;
        this.mouseDownTarget = target;

        this.initialMousePos = {
          x: event.clientX,
          y: event.clientY,
        };

        this.initialValue = this.value;

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
      },
      handleMouseMove(e) {
        // Prevent select text on alt press
        if (this.isAltPressed) {
          e.preventDefault();
        }
        // Only allow scrubbing when icon clicked or alt key pressed
        if (
          (
            this.mouseDownTarget === 'input'
            && this.isMouseDown
            && this.isAltPressed
          )
          || (this.mouseDownTarget === 'icon' && this.isMouseDown)
        ) {
          const newVal = this.initialValue
            + ((e.clientX - this.initialMousePos.x) * this.steps);

          this.$emit('input', this.clamp(newVal, this.min, this.max));
        }
      },
      handleMouseUp() {
        this.isMouseDown = false;
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
      },
      handleKeyAltDown(e) {
        if (e.altKey) {
          this.isAltPressed = true;
          e.preventDefault();
        }
      },
      handleKeyAltUp() {
        this.isAltPressed = false;
      },
      handleKeyArrowUp(e) {
        const val = Number.parseFloat(e.target.value) + this.steps;
        this.$emit('input', this.clamp(val, this.min, this.max));
        e.preventDefault();
      },
      handleKeyArrowDown(e) {
        const val = Number.parseFloat(e.target.value) - this.steps;
        this.$emit('input', this.clamp(val, this.min, this.max));
        e.preventDefault();
      },
      handleChange(e) {
        const validate = !Number.isNaN(Number.parseFloat(e.target.value))
          ? Number.parseFloat(e.target.value)
          : this.initialValue;

        this.$emit('input', this.clamp(validate, this.min, this.max));
        // Update input element after manual input
        this.$refs.numInput.value = this.unit
          ? this.clamp(validate, this.min, this.max) + this.unit
          : this.clamp(validate, this.min, this.max);
      },
      // Helpers
      clamp(value, min, max) {
        // if (min != undefined && max != undefined) {
        //   return this.round(Math.min(Math.max(value, min), max), 2)
        // } else return value
        if (min !== undefined && max !== undefined) {
          return this.round(Math.min(Math.max(value, min), max), 2);
        }

        if (min !== undefined && max === undefined) {
          return this.round(Math.max(value, min), 2);
        }

        if (min === undefined && max !== undefined) {
          return this.round(Math.min(value, max), 2);
        }

        return value;
      },
      round(value, decimals) {
        return Number(`${Math.round(`${value}e${decimals}`)}e-${decimals}`);
      },
    },
  };
</script>

<template>
  <div>
    <div class="fig-num-input">
      <div
        v-if="icon"
        class="fig-icon fig-num-input__icon"
        :class="{
          [`fig-icon--${icon}`]: icon,
          'fig-icon--spinning': spinning,
        }"
        @mousedown="handleMouseDown($event, 'icon')"
      />
      <div
        v-if="iconText"
        class="fig-num-input__icon--text"
        :class="{ 'fig-icon--spinning': spinning }"
        @mousedown="handleMouseDown($event, 'icon')"
        v-html="iconText"
      />
      <input
        :id="uniqueId"
        ref="numInput"
        type="text"
        class="fig-num-input__field"
        :class="{
          'fig-num-input--border': border,
          'fig-num-input--indent': icon || iconText,
          'fig-num-input__field--alt-pressed': isAltPressed,
          'fig-num-input__field--is-active': isMouseDown,
          'fig-num-input__field--min-max': value === min || value === max,
        }"
        :value="`${value}${unit ? unit : ''}`"
        :disabled="disabled"
        @change="handleChange"
        @mousedown="handleMouseDown($event, 'input')"
        @keydown.up="handleKeyArrowUp"
        @keydown.down="handleKeyArrowDown"
      >
    </div>
  </div>
</template>

<style scoped>
.fig-num-input {
  position: relative;

  .fig-num-input__field {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 32px;
    margin: 1px 0 1px 0;
    padding: var(--size-xxsmall) var(--size-xxxsmall) var(--size-xxsmall)
      var(--size-xxsmall);
    overflow: visible;
    color: var(--black8);
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xsmall);
    line-height: var(--font-line-height);
    letter-spacing: var(--font-letter-spacing-neg-xsmall);
    background-color: var(--white);
    border: 1px solid transparent;
    border-radius: var(--border-radius-small);
    outline: none;
    cursor: default;

    &:hover,
    &:placeholder-shown:hover {
      color: var(--black8);
      background-image: none;
      border: 1px solid var(--black1);
    }

    &::selection {
      color: var(--black);
      background-color: var(--blue3);
    }

    &::placeholder {
      color: var(--black3);
      border: 1px solid transparent;
    }

    &:placeholder-shown {
      color: var(--black8);
      background-image: none;
      border: 1px solid var(--black1);
    }

    &:focus:placeholder-shown {
      border: 1px solid var(--blue);
      outline: 1px solid var(--blue);
      outline-offset: -2px;
    }

    &:disabled:hover {
      border: 1px solid transparent;
    }

    &:active,
    &:focus,
    &--is-active {
      color: var(--black);
      border: 1px solid var(--blue);
      outline: 1px solid var(--blue);
      outline-offset: -2px;
    }

    &:disabled {
      position: relative;
      color: var(--black3);
      background-image: none;
    }

    &:disabled:active {
      outline: none;
    }

    &--alt-pressed {
      cursor: ew-resize !important;
    }

    &--min-max:active,
    &--min-max:focus {
      color: var(--blue);
    }
  }

  /*
    Inherits the .icon class styles (_icon.css)
    but overrides some additional styles
  */

  .fig-num-input__icon {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    opacity: 0.3;
    pointer-events: all; /* Overwrite to enable scrubbing */

    .fig-num-input__icon--text {
      position: absolute;
      top: calc(36px / 4);
      left: 12px;
      z-index: 1;
      color: var(--black3);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-xsmall);
      opacity: 1;
      user-select: none;

      &:hover {
        cursor: ew-resize !important;
      }
    }

    &:hover {
      cursor: ew-resize !important;
    }
  }

  .fig-num-input--border {
    background-image: none;
    border: 1px solid var(--black1);

    &:disabled {
      background-image: none;
      border: 1px solid transparent;
    }

    &:disabled:placeholder-shown {
      background-image: none;
      border: 1px solid transparent;
    }

    &:disabled:placeholder-shown:active {
      border: 1px solid transparent;
      outline: none;
    }

    &:placeholder-shown {
      background-image: none;
      border: 1px solid var(--black1);
    }
  }

  .fig-num-input--indent {
    padding-left: 32px;
  }
}

/* Spinning animation moved to ->  _animations.css */
</style>

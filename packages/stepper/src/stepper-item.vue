<template>
  <div
    class="el-stepper-item qa-stepper-item"
    :class="{
      'is-interactive': stepper.interactive,
      'is-completed': completed,
      'is-active': isActive,
      'is-visited': isVisited,
      'is-pressed': isMouseDown,
      'is-focus': isFocus
    }"
    :tabindex="tabIndex"
    @click="handleClick"
    @keydown.enter="handleClick"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <span class="el-stepper-item__bullet qa-item-bullet">
      {{ index + 1 }}
    </span>

    <span
      class="el-stepper-item__name"
      :class="[
        title ?`qa-stepper-item--${title}`: '',
      ]"
    >
      <slot>{{ title }}</slot>
    </span>
  </div>
</template>

<script>

  export default {
    name: 'ElStepperItem',
    props: {
      title: {
        type: String,
        default: ''
      },
      defaultVisited: {
        type: Boolean,
        default: false
      },
      beforeChange: {
        type: Function
      }
    },
    inject: ['stepper'],
    data() {
      return {
        index: -1,
        internalStatus: '',
        isVisited: this.defaultVisited,
        isMouseDown: false,
        isFocus: false
      };
    },
    computed: {
      completed() {
        return this.index < this.stepper.value;
      },
      isActive() {
        return this.index === this.stepper.value;
      },
      tabIndex() {
        if (!this.stepper.interactive) return -1;
        if (this.isVisited && !this.isActive) return 0;
        if (this.completed) return 0;
        return null; // provide a default to not render tabIndex
      }
    },
    watch: {
      'stepper.value'(value) {
        if (!this.stepper.interactive) return;
        if (this.index === value) {
          this.isVisited = true;
        }
      }
    },
    created() {
      this.index = this.stepper.setItem(this);
    },
    beforeUnmount() {
      this.stepper.removeItem(this);
    },
    mounted() {
      if (this.stepper.interactive && this.isActive) {
        this.isVisited = true;
      }
    },
    methods: {
      async handleClick() {
        if (!this.stepper.interactive || this.isActive) return;

        if (this.completed || this.isVisited) {
          if (this.beforeChange) {
            try {
              await this.beforeChange(this.index, this.stepper.value);
            } catch (e) {
              JSON.stringify(e) !== JSON.stringify({}) && console.warn(e);
              return;
            }
          }

          this.stepper.selectedItem(this.index);
        }
      },
      handleMouseDown() {
        if (this.stepper.interactive) {
          this.isMouseDown = true;
        }
      },
      handleMouseUp() {
        this.isMouseDown = false;
      },
      handleFocus() {
        if (!this.isMouseDown && this.stepper.interactive) {
          this.isFocus = true;
        }
      },
      handleBlur() {
        this.isMouseDown = false;
        this.isFocus = false;
      }
    }
  };
</script>

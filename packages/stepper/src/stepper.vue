<template>
  <div
    class="el-stepper qa-stepper"
    :class="{
      'is-horizontal': horizontal
    }"
  >
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'ElStepper',
    props: {
      value: {
        type: Number,
        default: 0
      },
      horizontal: {
        type: Boolean,
        default: false
      },
      interactive: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        steps: []
      };
    },
    methods: {
      setItem(item) {
        return this.steps.push(item) - 1;
      },
      removeItem(item) {
        const index = this.steps.indexOf(item);
        this.steps.splice(index, 1);
      },
      selectedItem(index) {
        this.$emit('input', index);
      }
    },
    provide() {
      return {
        stepper: this
      };
    }
  };
</script>

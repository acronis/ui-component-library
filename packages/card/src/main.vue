<template>
  <div
    class="el-card qa-card"
    :class="{
      'el-card--modal': modal,
      [`el-card--color-border-${borderColor}`]: borderColor,
      [`el-card--color-background-${backgroundColor}`]: backgroundColor,
      'is-focus': focus
    }"
  >
    <div
      class="el-card__body qa-card-body"
      :style="bodyStyle"
    >
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ElCard',

    props: {
      bodyStyle: {
        type: Object,
        default: {}
      },
      modal: Boolean,
      focus: Boolean,
      borderColor: {
        type: String,
        default: 'brand-lighter'
      },
      backgroundColor: {
        type: String,
        default: 'fixed-white'
      }
    }
  };
</script>

<template>
  <div
    class="el-toolbar-search"
    :style="`width: ${width}px`"
  >
    <slot />
  </div>
</template>

<script>
  export default {
    name: 'ElToolbarSearch',
    props: {
      width: {
        type: Number,
        default: 750,
        validator: (value) => value >= 208 && value <= 760
      }
    }
  };
</script>

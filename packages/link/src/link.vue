<template>
  <a
    v-bind="$attrs"
    :class="[
      'el-link',
      {'is-disabled': disabled}
    ]"
  >
    <slot />
  </a>
</template>

<script>
export default {
  name: 'ElLink',
  props: {
    disabled: Boolean
  }
};
</script>

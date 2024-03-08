<template>
  <div
    class="el-sidebar-layout"
    :class="{
      'is-open': open
    }"
  >
    <div class="el-sidebar-layout__panel">
      <slot name="panel" />
    </div>
    <div
      v-if="open"
      class="el-sidebar-layout__sidebar"
    >
      <slot name="sidebar" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ElSidebarLayout',

    props: {
      open: {
        type: Boolean,
        default: false
      }
    },

    provide() {
      return {
        sidebar: this
      };
    },

    methods: {
      close() {
        this.$emit('close');
      }
    }
  };
</script>

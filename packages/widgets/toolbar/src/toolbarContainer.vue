<template>
  <div
    class="el-toolbar-container"
    :class="{'el-toolbar-container--active': value || active}"
  >
    <div
      v-if="value || active"
      key="active"
    >
      <slot name="active" />
    </div>
    <slot v-else />
  </div>
</template>

<script>
  export default {
    name: 'ElToolbarContainer',

    props: {
      value: {
        type: Boolean,
        default: false
      },
      active: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

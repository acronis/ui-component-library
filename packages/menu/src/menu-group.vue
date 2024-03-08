<template>
  <div class="el-menu-group">
    <div class="el-menu-group__title el-text el-text--accent el-text--ellipsis">
      {{ title }}
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ElMenuGroup',
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>

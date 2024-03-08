<template>
  <aside
    class="el-aside"
    :class="{[`el-aside--color-${color}`]: isColorModifier(color)}"
    :style="[
      {width: width},
      {backgroundColor: !isColorModifier(color) ? color : null}
    ]"
  >
    <slot />
  </aside>
</template>

<script>
  import createColorMixin from '@/mixins/color';

  export default {
    name: 'ElAside',

    mixins: [
      createColorMixin(['nav-primary'])
    ],

    componentName: 'ElAside',

    props: {
      width: {
        type: String,
        default: ''
      }
    }
  };
</script>

<template>
  <footer
    class="el-footer"
    :class="{[`el-footer--color-${color}`]: isColorModifier(color)}"
    :style="[
      {height: height},
      {backgroundColor: !isColorModifier(color) ? color : null}
    ]"
  >
    <div class="el-footer__content">
      <slot />
    </div>
    <div>
      <slot name="aside" />
    </div>
  </footer>
</template>

<script>
  import createColorMixin from '@/mixins/color';

  export default {
    name: 'ElFooter',

    mixins: [
      createColorMixin(['brand-lightest', 'fixed-white'])
    ],

    componentName: 'ElFooter',

    props: {
      height: {
        type: String,
        default: '64px'
      }
    }
  };
</script>

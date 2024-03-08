<template>
  <main
    class="el-main"
    :class="{[`el-main--color-${color}`]: isColorModifier(color)}"
    :style="[
      {backgroundColor: !isColorModifier(color) ? color : null}
    ]"
  >
    <slot />
  </main>
</template>

<script>
import createColorMixin from '@/mixins/color';

export default {
  name: 'ElMain',
  mixins: [
    createColorMixin(['brand-light', 'brand-accent', 'brand-lightest'])
  ],
  componentName: 'ElMain'
};
</script>

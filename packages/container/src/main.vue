<template>
  <section
    class="el-container"
    :class="{
      'is-vertical': isVertical,
      [`el-container--color-${color}`]: isColorModifier(color)
    }"
    :style="{backgroundColor: !isColorModifier(color) ? color : null}"
  >
    <slot />
  </section>
</template>

<script>
  import createColorMixin from '@/mixins/color';

  export default {
    name: 'ElContainer',

    mixins: [
      createColorMixin(['brand-lightest'])
    ],

    componentName: 'ElContainer',

    props: {
      direction: String
    },

    computed: {
      isVertical() {
        if (this.direction === 'vertical') {
          return true;
        }
        if (this.direction === 'horizontal') {
          return false;
        }
        return this.$slots && this.$slots.default
          ? this.$slots.default().some((vnode) => {
            const tag = vnode.componentOptions && vnode.componentOptions.tag;
            return tag === 'el-header' || tag === 'el-footer' || tag === 'el-toolbar';
          })
          : false;
      }
    }
  };
</script>

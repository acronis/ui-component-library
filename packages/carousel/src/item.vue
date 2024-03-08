<template>
  <div
    class="el-carousel__item"
    :class="{
      'is-active': active,
    }"
  >
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'ElCarouselItem',

    props: {
      name: String
    },

    data() {
      return {
        active: false
      };
    },

    methods: {
      translateItem(pIndex, activeIndex) {
        this.active = pIndex === activeIndex;
      }
    },

    created() {
      this.$parent && this.$parent.updateItems();
    },

    unmounted() {
      this.$parent && this.$parent.updateItems();
    }
  };
</script>

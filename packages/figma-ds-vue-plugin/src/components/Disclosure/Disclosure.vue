<script>
  export default {
    name: 'DisclosureWrapper',
    provide() {
      return { disclosure: this.disclosure, concede: this.concede };
    },
    props: {
      concede: {
        type: Boolean,
        default: false,
      },
    },
    /**
     * Disclosure menu wrapper, takes DisclosureItem.vue as children
     */
    data: () => ({
      disclosure: {
        numItems: 0,
        currentIndex: null,
      },
    }),
  };
</script>

<template>
  <ul class="fig-disclosure">
    <slot />
  </ul>
</template>

<style scoped>
.fig-disclosure {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
}
</style>

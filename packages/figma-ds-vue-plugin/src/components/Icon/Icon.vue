<script>
  /**
   * Icon wrapper
   * Default Figma icons are located in ./assets/icons
   */
  export default {
    name: 'Icon',
    props: {
      icon: { type: String, default: 'heart' },
      iconText: String,
      spinning: Boolean,
    },
  };
</script>

<template>
  <span
    v-if="!iconText"
    class="fig-icon"
    :class="{
      [`fig-icon--${icon}`]: icon,
      spinning,
    }"
  />
  <span
    v-else
    class="fig-icon fig-icon--text"
    :class="{ spinning }"
    v-html="iconText"
  />
</template>

<style scoped>
/*
  Since the icon class is also used by other components, styles are
  moved to -> _icon.css
*/
</style>

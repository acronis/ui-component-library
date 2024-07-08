<script setup>
  import AcvLink from '@/components/link/link.vue';

  function handleClick() {
    console.log('Link is clicked');
  }
</script>

<template>
  <div class="acv-text acv-text--body-24">
    <AcvLink @click="handleClick">
      Check console
    </AcvLink>
  </div>
  <div class="acv-text acv-text--body-24">
    <AcvLink
      href="/ui-component-library/components/button/button.doc.html"
      @click="handleClick"
    >
      Will trigger both href and click
    </AcvLink>
  </div>
</template>

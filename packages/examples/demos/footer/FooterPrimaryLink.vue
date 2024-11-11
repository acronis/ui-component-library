<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvFooter from '@/components/footer/footer.vue';
  import AcvLink from '@/components/link/link.vue';
</script>

<template>
  <AcvFooter>
    <AcvButton
      type="primary"
    >
      Button
    </AcvButton>
    <template #side>
      <AcvLink>Link</AcvLink>
    </template>
  </AcvFooter>
</template>

<style scoped>

</style>

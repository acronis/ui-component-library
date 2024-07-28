<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvFooter from '@/components/footer/footer.vue';
</script>

<template>
  <AcvFooter>
    <AcvButton
      type="primary"
    >
      Button
    </AcvButton>
    <template #side>
      Text
    </template>
  </AcvFooter>
</template>

<style scoped>

</style>

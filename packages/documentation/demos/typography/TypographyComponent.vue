<script setup>
  import AcvTypography from '@/components/typography/typography.vue';
</script>

<template>
  <AcvTypography
    title="Typography component with title and subtitle"
    subtitle="This is subtitle"
  />

  <AcvTypography
    title="Typography component with header-right"
    subtitle="This is subtitle"
  >
    <template #header-right>
      <div>Header Right</div>
    </template>
  </AcvTypography>

  <AcvTypography
    title="Typography component with text"
    subtitle="This is subtitle"
  >
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  </AcvTypography>
</template>

<script setup>
  import AcvButton from '@/components/button/button.vue';
  import ConfigProvider from '@/components/config-provider/configProvider.vue';

  const defaultProps = {
    button: {
      size: 'large'
    }
  };
</script>

<template>
  <ConfigProvider :props="defaultProps">
    <AcvButton>Button with custom default props</AcvButton>
  </ConfigProvider>
</template>

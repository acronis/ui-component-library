<script setup>
  import AcvButton from '@/components/button/button.vue';
  import ThemeProvider from '@/components/theme-provider/themeProvider.vue';
  import { ref } from 'vue';

  const theme = ref('acronis');

  function toggleTheme() {
    theme.value = theme.value === 'acronis' ? 'constructor' : 'acronis';
  }
</script>

<template>
  <ThemeProvider :theme="theme">
    <AcvButton @click="toggleTheme">
      Theme
    </AcvButton>
  </ThemeProvider>
</template>

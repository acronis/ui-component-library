<script setup>
  import DefaultTheme from 'vitepress/theme';
  import ThemeSwitcher from '@/widgets/theme-switcher/themeSwitcher.vue';

  const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <div class="ml-16">
        <ThemeSwitcher class="ml-8" />
      </div>
    </template>
  </Layout>
</template>

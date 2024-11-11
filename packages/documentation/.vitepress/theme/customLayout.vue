<script setup>
  import ThemeSwitcher from '@/components/theme-switcher/themeSwitcher.vue';
  import DefaultTheme from 'vitepress/theme';

  const isProd = process.env.NODE_ENV === 'production';

  const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <div
        v-if="!isProd"
        class="ml-16"
      >
        <ThemeSwitcher class="ml-8" />
      </div>
    </template>
  </Layout>
</template>

<script setup>
  import { computed, getCurrentInstance } from 'vue';
  import { createRouter, createWebHashHistory, useRoute, useRouter } from 'vue-router';
  import { AcvPagination, getAcvPaginationQuery } from '@acronis-platform/ui-component-library';

  const routers = createRouter({
    history: createWebHashHistory(),
    routes: [
      {
        path: '/',
        component: {
          template: '<div>Test</div>',
        },
      },
    ],
  });

  const { app } = getCurrentInstance().appContext;
  app.use(routers);

  const route = useRoute();
  const router = useRouter();
  const currentPage = computed(() => (route.query.page ? +route.query.page : 1));

  async function setActivePage(newPage) {
    await router.push({ query: getAcvPaginationQuery(route.query, newPage) });
  }
</script>

<template>
  <AcvPagination
    :total="20"
    :limit="1"
    :model-value="currentPage"
    @update:model-value="setActivePage"
  />
</template>

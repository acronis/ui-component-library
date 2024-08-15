<script setup>
  import { AcvPagination, usePagination } from '@acronis-platform/ui-component-library';
  import { getCurrentInstance } from 'vue';
  import { createRouter, createWebHashHistory } from 'vue-router';

  const router = createRouter({
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
  app.use(router);

  const paginationService = usePagination({ limit: 1 });
  const { setTotal, setPage } = paginationService;

  setTotal(20);
  setPage(1);
</script>

<template>
  <AcvPagination :pagination="paginationService" />
</template>

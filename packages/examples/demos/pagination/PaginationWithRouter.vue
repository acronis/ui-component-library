<script setup lang="ts">
  import { AcvPagination } from '@acronis-platform/ui-component-library';
  // TODO: fix example with vue-router
  // import { computed, getCurrentInstance } from 'vue';
  // import { createRouter, createWebHistory, useRoute } from 'vue-router';

  // const router = createRouter({
  //   history: createWebHistory(),
  //   routes: [
  //     {
  //       path: '/',
  //       component: {
  //         template: '<div>Test</div>',
  //       },
  //     },
  //   ],
  // });

  // const { app } = getCurrentInstance().appContext;
  // app.use(router);
  //
  // const route = useRoute();
  // // const router = useRouter();
  // const currentPage = computed(() => (route.query.page ? +route.query.page : 1));

  /**
   * Merge existing query with pagination params
   */
  // function getAcvPaginationQuery(query: LocationQueryRaw, page: number): LocationQueryRaw {
  //   // don't show first page in url
  //   return { ...query, page: page > 1 ? page : undefined };
  // }

  async function setActivePage() {
    // await router.push({ query: getAcvPaginationQuery(route.query, newPage) });
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

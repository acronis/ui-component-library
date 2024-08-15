<script setup>
  import { AcvPagination, usePagination } from '@acronis-platform/ui-component-library';

  const paginationService = usePagination({ limit: 1 });
  const { setTotal, setPage } = paginationService;

  setTotal(20);
  setPage(1);
</script>

<template>
  <AcvPagination :pagination="paginationService" />
</template>

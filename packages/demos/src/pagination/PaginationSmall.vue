<script setup>
  import { AcvPagination, usePagination } from '@acronis-platform/ui-component-library';

  const paginationService = usePagination({ limit: 1 });
  const { setTotal } = paginationService;

  setTotal(7);
</script>

<template>
  <AcvPagination :pagination="paginationService" />
</template>

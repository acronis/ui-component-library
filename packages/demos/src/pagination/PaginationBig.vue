<script setup>
  import { AcvPagination, useAcvPagination } from '@acronis-platform/ui-component-library';

  const paginationService = useAcvPagination({ limit: 1 });
  const { setTotal, setPage } = paginationService;

  setTotal(20);
  setPage(1);
</script>

<template>
  <AcvPagination :pagination="paginationService" />
</template>

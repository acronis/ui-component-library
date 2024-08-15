<script setup>
  import { AcvPagination, useAcvPagination } from '@acronis-platform/ui-component-library';

  const paginationService = useAcvPagination({ limit: 1 });
  const { setTotal } = paginationService;

  setTotal(7);
</script>

<template>
  <AcvPagination :pagination="paginationService" />
</template>

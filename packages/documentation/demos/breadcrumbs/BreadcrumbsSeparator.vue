<script setup>
  import { IChevronRight } from '@acronis-platform/icons';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
  import BreadcrumbLink from '@/components/breadcrumbs/breadcrumbLink.vue';
</script>

<template>
  <Breadcrumbs>
    <template #separator>
      <IChevronRight />
    </template>
    <BreadcrumbLink to="/">
      Home
    </BreadcrumbLink>
    <BreadcrumbLink
      icon="i-folder-o--16"
      to="/products"
    >
      Products
    </BreadcrumbLink>
    <BreadcrumbLink
      icon="i-customer-o--16"
      to="/customers"
    >
      Customers
    </BreadcrumbLink>
  </Breadcrumbs>
</template>

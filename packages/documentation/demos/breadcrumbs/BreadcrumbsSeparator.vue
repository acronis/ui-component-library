<script setup>
  import { IconChevronRight16 } from '@acronis-platform/icons/chevron';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
  import BreadcrumbLink from '@/components/breadcrumbs/breadcrumbLink.vue';
</script>

<template>
  <Breadcrumbs>
    <template #separator>
      <IconChevronRight16 />
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

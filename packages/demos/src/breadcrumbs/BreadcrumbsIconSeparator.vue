<script setup>
  import BreadcrumbLink from '@/components/breadcrumbs/breadcrumbLink.vue';
  import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs.vue';
  import { IconChevronRight16 } from '@acronis-platform/icons/chevron';
</script>

<template>
  <Breadcrumbs :separator="IconChevronRight16">
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
